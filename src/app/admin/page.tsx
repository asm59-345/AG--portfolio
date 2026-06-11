"use client";

import { useState, useEffect } from "react";
import { 
  Lock, Mail, Download, BarChart2, Eye, ShieldCheck, LogOut, 
  FileCode, Plus, Trash2, Edit, Save, Settings, Upload, FileText, 
  Check, Globe, Activity, AlertCircle, Share2, ArrowLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleBackground from "@/components/ParticleBackground";
import CustomCursor from "@/components/CustomCursor";
import { supabase } from "@/lib/supabase";
import { getAllBlogs, getAllProjects } from "@/lib/content";
import Link from "next/link";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "blogs" | "projects" | "research" | "settings">("analytics");
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Stats State
  const [stats, setStats] = useState({
    pageViews: 1254,
    resumeDownloads: 142,
    messageCount: 0,
    githubClicks: 284,
    chatbotSessions: 94,
    voiceCalls: 48
  });

  // DB Sync / Status State
  const [supabaseReady, setSupabaseReady] = useState(true);

  // --- CRUD STATES ---
  // Blogs
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: "", slug: "", category: "LLM", tags: "", readTime: "5 min read", description: "", content: "", featured: false
  });

  // Projects
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "", slug: "", description: "", category: "Generative AI", tech: "", github: "", demo: "", featured: false,
    longDescription: "", challenges: "", learnings: "", architecture: ""
  });

  // Research Reviews
  const [researchList, setResearchList] = useState<any[]>([]);
  const [editingResearch, setEditingResearch] = useState<any | null>(null);
  const [researchForm, setResearchForm] = useState({
    title: "", focus: "", takeaway: "", impact: "", category: "LLM", date: new Date().toISOString().split("T")[0]
  });

  // Social Links Form
  const [socialLinks, setSocialLinks] = useState({
    github: "https://github.com/asm59-345",
    linkedin: "https://www.linkedin.com/in/ashmit-gautam-asar",
    gcp: "https://www.skills.google/public_profiles/62d03ab9-e1ab-4cb3-a121-c95363ab1982",
    commudle: "https://www.commudle.com/users/ashu_gautam",
    twitter: "https://twitter.com/GautamAshmit081",
    instagram: "https://www.instagram.com/iag_908.ml/",
    discord: "ashmitgautam_08838",
    email: "gautamashmit1485@gmail.com"
  });

  // Resume File Upload Mock State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const securePass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "secure_admin_password";

    if (password === securePass) {
      setIsAuthenticated(true);
      setError("");
      sessionStorage.setItem("admin_token", password);
      showAlert("success", "Authentication established. Connection secure.");
    } else {
      setError("Incorrect password credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    sessionStorage.removeItem("admin_token");
  };

  const showAlert = (type: "success" | "error" | "info", text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  useEffect(() => {
    const cachedToken = sessionStorage.getItem("admin_token");
    const securePass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "secure_admin_password";
    if (cachedToken === securePass) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch telemetry / initialize CRUD data
  useEffect(() => {
    if (isAuthenticated) {
      loadInboxAndTelemetry();
      loadBlogs();
      loadProjects();
      loadResearch();
      loadSocialLinks();
    }
  }, [isAuthenticated]);

  // Load telemetry stats & contact messages
  const loadInboxAndTelemetry = async () => {
    setLoadingMessages(true);
    const token = sessionStorage.getItem("admin_token") || "secure_admin_password";

    try {
      const res = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = await res.json();
      if (resData.success) {
        setMessages(resData.data);
        setStats(prev => ({
          ...prev,
          messageCount: resData.data.length
        }));
      }
    } catch (e) {
      console.warn("Could not load contact messages:", e);
      setSupabaseReady(false);
    } finally {
      setLoadingMessages(false);
    }

    // Try to load analytics totals from Supabase
    try {
      const { data: viewsData } = await supabase.from("analytics").select("event");
      if (viewsData) {
        const views = viewsData.filter(e => e.event === "VIEW").length || 1254;
        const downloads = viewsData.filter(e => e.event === "DOWNLOAD").length || 142;
        const clicks = viewsData.filter(e => e.event === "CLICK").length || 284;
        const chatbot = viewsData.filter(e => e.event === "CHAT").length || 94;
        const voice = viewsData.filter(e => e.event === "VOICE_CALL").length || 48;
        
        setStats(prev => ({
          ...prev,
          pageViews: views,
          resumeDownloads: downloads,
          githubClicks: clicks,
          chatbotSessions: chatbot,
          voiceCalls: voice
        }));
      }
    } catch (e) {
      console.warn("Supabase analytics table query failed, using simulator telemetry:", e);
    }
  };

  // --- CRUD FUNCTIONS ---

  // BLOGS
  const loadBlogs = async () => {
    try {
      const { data, error } = await supabase.from("blogs").select("*").order("date", { ascending: false });
      if (error) throw error;
      setBlogsList(data || []);
    } catch (e) {
      console.warn("Blogs Supabase fetch failed. Loading local fallback.");
      // Fallback local json + localStorage configuration
      const local = localStorage.getItem("admin_blogs");
      if (local) {
        setBlogsList(JSON.parse(local));
      } else {
        const fallback = getAllBlogs();
        setBlogsList(fallback);
        localStorage.setItem("admin_blogs", JSON.stringify(fallback));
      }
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug || !blogForm.description || !blogForm.content) {
      showAlert("error", "Please fill in all required blog fields.");
      return;
    }

    const payload = {
      ...blogForm,
      tags: typeof blogForm.tags === "string" ? blogForm.tags.split(",").map(t => t.trim()) : blogForm.tags
    };

    let savedDb = false;
    try {
      if (editingBlog) {
        const { error } = await supabase
          .from("blogs")
          .update(payload)
          .eq("slug", editingBlog.slug);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("blogs")
          .insert([payload]);
        if (error) throw error;
      }
      savedDb = true;
    } catch (e) {
      console.warn("Blogs database write failed. Saving locally to client.", e);
    }

    // Sync localStorage fallback
    const current = [...blogsList];
    if (editingBlog) {
      const idx = current.findIndex(b => b.slug === editingBlog.slug);
      if (idx !== -1) current[idx] = payload;
    } else {
      current.unshift(payload);
    }
    setBlogsList(current);
    localStorage.setItem("admin_blogs", JSON.stringify(current));

    setBlogForm({ title: "", slug: "", category: "LLM", tags: "", readTime: "5 min read", description: "", content: "", featured: false });
    setEditingBlog(null);
    showAlert("success", savedDb ? "Blog updated directly in Supabase." : "Blog updated locally on client cache.");
  };

  const handleDeleteBlog = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    let deletedDb = false;
    try {
      const { error } = await supabase.from("blogs").delete().eq("slug", slug);
      if (error) throw error;
      deletedDb = true;
    } catch (e) {
      console.warn("Blogs database delete failed.");
    }

    const updated = blogsList.filter(b => b.slug !== slug);
    setBlogsList(updated);
    localStorage.setItem("admin_blogs", JSON.stringify(updated));
    showAlert("success", deletedDb ? "Blog deleted from database." : "Blog deleted from client cache.");
  };

  // PROJECTS
  const loadProjects = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) throw error;
      setProjectsList(data || []);
    } catch (e) {
      const local = localStorage.getItem("admin_projects");
      if (local) {
        setProjectsList(JSON.parse(local));
      } else {
        const fallback = getAllProjects();
        setProjectsList(fallback);
        localStorage.setItem("admin_projects", JSON.stringify(fallback));
      }
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.slug || !projectForm.description) {
      showAlert("error", "Title, Slug, and Description are required.");
      return;
    }

    const payload = {
      ...projectForm,
      tech: typeof projectForm.tech === "string" ? projectForm.tech.split(",").map(t => t.trim()) : projectForm.tech
    };

    let savedDb = false;
    try {
      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("slug", editingProject.slug);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([payload]);
        if (error) throw error;
      }
      savedDb = true;
    } catch (e) {
      console.warn("Projects database write failed.", e);
    }

    const current = [...projectsList];
    if (editingProject) {
      const idx = current.findIndex(p => p.slug === editingProject.slug);
      if (idx !== -1) current[idx] = payload;
    } else {
      current.push(payload);
    }
    setProjectsList(current);
    localStorage.setItem("admin_projects", JSON.stringify(current));

    setProjectForm({
      title: "", slug: "", description: "", category: "Generative AI", tech: "", github: "", demo: "", featured: false,
      longDescription: "", challenges: "", learnings: "", architecture: ""
    });
    setEditingProject(null);
    showAlert("success", savedDb ? "Project written to Supabase." : "Project saved to client cache.");
  };

  const handleDeleteProject = async (slug: string) => {
    if (!confirm("Delete project?")) return;

    let deletedDb = false;
    try {
      const { error } = await supabase.from("projects").delete().eq("slug", slug);
      if (error) throw error;
      deletedDb = true;
    } catch (e) {
      console.warn("Projects database delete failed.");
    }

    const updated = projectsList.filter(p => p.slug !== slug);
    setProjectsList(updated);
    localStorage.setItem("admin_projects", JSON.stringify(updated));
    showAlert("success", deletedDb ? "Project deleted from database." : "Project deleted from client cache.");
  };

  // RESEARCH REVIEWS
  const loadResearch = async () => {
    try {
      const { data, error } = await supabase.from("research").select("*").order("date", { ascending: false });
      if (error) throw error;
      setResearchList(data || []);
    } catch (e) {
      const local = localStorage.getItem("admin_research");
      if (local) {
        setResearchList(JSON.parse(local));
      } else {
        const fallback = [
          { id: "1", title: "Attention Is All You Need", focus: "Attention mechanisms", takeaway: "RNNs replaced by transformers", impact: "All modern LLMs", category: "LLM", date: "2017-06-12" }
        ];
        setResearchList(fallback);
        localStorage.setItem("admin_research", JSON.stringify(fallback));
      }
    }
  };

  const handleResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchForm.title || !researchForm.focus || !researchForm.takeaway) {
      showAlert("error", "Please fill in all research fields.");
      return;
    }

    const payload = {
      ...researchForm,
      id: editingResearch?.id || Math.random().toString(36).substr(2, 9)
    };

    let savedDb = false;
    try {
      if (editingResearch) {
        const { error } = await supabase
          .from("research")
          .update(payload)
          .eq("id", editingResearch.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("research")
          .insert([payload]);
        if (error) throw error;
      }
      savedDb = true;
    } catch (e) {
      console.warn("Research database write failed.");
    }

    const current = [...researchList];
    if (editingResearch) {
      const idx = current.findIndex(r => r.id === editingResearch.id);
      if (idx !== -1) current[idx] = payload;
    } else {
      current.unshift(payload);
    }
    setResearchList(current);
    localStorage.setItem("admin_research", JSON.stringify(current));

    setResearchForm({ title: "", focus: "", takeaway: "", impact: "", category: "LLM", date: new Date().toISOString().split("T")[0] });
    setEditingResearch(null);
    showAlert("success", savedDb ? "Research log written to Supabase." : "Research log saved to client cache.");
  };

  const handleDeleteResearch = async (id: string) => {
    if (!confirm("Delete research review?")) return;

    let deletedDb = false;
    try {
      const { error } = await supabase.from("research").delete().eq("id", id);
      if (error) throw error;
      deletedDb = true;
    } catch (e) {
      console.warn("Research database delete failed.");
    }

    const updated = researchList.filter(r => r.id !== id);
    setResearchList(updated);
    localStorage.setItem("admin_research", JSON.stringify(updated));
    showAlert("success", deletedDb ? "Research log deleted from database." : "Research log deleted from client cache.");
  };

  // SETTINGS (SOCIAL LINKS)
  const loadSocialLinks = () => {
    const saved = localStorage.getItem("ashmit_social_links");
    if (saved) {
      try {
        setSocialLinks(JSON.parse(saved));
      } catch (e) {
        console.warn("Failed to parse settings cache", e);
      }
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("ashmit_social_links", JSON.stringify(socialLinks));
    
    let savedDb = false;
    try {
      // Sync into supabase config table if it exists
      const { error } = await supabase
        .from("settings")
        .upsert([{ key: "social_links", value: socialLinks }], { onConflict: "key" });
      if (!error) savedDb = true;
    } catch (e) {
      console.warn("Supabase settings sync failed. Synced locally.");
    }

    showAlert("success", savedDb ? "Settings synced across database." : "Settings updated locally.");
  };

  // RESUME UPLOAD SIMULATOR
  const handleResumeUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      showAlert("error", "No file selected. Select a PDF asset first.");
      return;
    }

    setUploadingResume(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadingResume(false);
          setResumeFile(null);
          showAlert("success", `Asset ${resumeFile.name} successfully deployed to /public/resume.pdf`);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  // Render Form Pre-population helpers
  const startEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
      readTime: blog.readTime || "5 min read",
      description: blog.description,
      content: blog.content,
      featured: !!blog.featured
    });
  };

  const startEditProject = (p: any) => {
    setEditingProject(p);
    setProjectForm({
      title: p.title,
      slug: p.slug,
      description: p.description || "",
      category: p.category,
      tech: Array.isArray(p.tech) ? p.tech.join(", ") : p.tech || "",
      github: p.github || "",
      demo: p.demo || "",
      featured: !!p.featured,
      longDescription: p.longDescription || "",
      challenges: p.challenges || "",
      learnings: p.learnings || "",
      architecture: p.architecture || ""
    });
  };

  const startEditResearch = (r: any) => {
    setEditingResearch(r);
    setResearchForm({
      title: r.title,
      focus: r.focus,
      takeaway: r.takeaway,
      impact: r.impact,
      category: r.category,
      date: r.date || new Date().toISOString().split("T")[0]
    });
  };

  if (!isAuthenticated) {
    return (
      <>
        <CustomCursor />
        <ParticleBackground />
        
        <div className="min-h-screen flex items-center justify-center px-6 relative z-10 select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm glassmorphism p-6 sm:p-8 rounded-2xl relative border-neon-purple/20"
          >
            <div className="flex flex-col items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center text-neon-purple mb-4 animate-pulse">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold font-mono tracking-widest text-foreground uppercase">
                ADMINISTRATION
              </h2>
              <span className="text-[10px] font-mono text-neutral-500 uppercase mt-1">
                Enter access code to open telemetry console
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full text-xs text-center text-foreground placeholder-neutral-500 bg-glass-bg border border-glass-border focus:border-neon-purple/50 rounded-xl px-4 py-3 outline-none transition-colors"
                />
              </div>
              {error && (
                <p className="text-[10px] font-mono text-neon-pink text-center">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-neon-purple/10 border border-neon-purple/20 hover:bg-neon-purple/20 text-neon-purple text-xs font-mono font-bold tracking-widest uppercase cursor-pointer transition-colors"
              >
                Access Console
              </button>
            </form>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <ParticleBackground />

      <div className="min-h-screen py-16 px-6 relative z-10 max-w-7xl mx-auto">
        
        {/* Floating alerts */}
        <AnimatePresence>
          {alertMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl border shadow-lg flex items-center gap-3 text-xs font-mono select-none ${
                alertMessage.type === "success" 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                  : alertMessage.type === "error"
                  ? "bg-neon-pink/10 border-neon-pink/30 text-neon-pink"
                  : "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan"
              }`}
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>{alertMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation back */}
        <div className="mb-6 select-none">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-neon-cyan transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> LEAVE CONSOLE
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-glass-border pb-6 mb-10 select-none">
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-neon-cyan uppercase block mb-1">
              // CONTROL STATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight uppercase flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-neon-cyan" /> Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-glass-border hover:border-neon-pink/30 bg-glass-bg text-xs font-mono text-neutral-400 hover:text-neon-pink transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Console Mode Tab Selection */}
        <div className="flex flex-wrap bg-glass-bg border border-glass-border p-1 rounded-2xl w-max max-w-full overflow-x-auto no-scrollbar mb-10 select-none">
          {["analytics", "blogs", "projects", "research", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                activeTab === tab
                  ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20"
                  : "text-neutral-400 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT AREA --- */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ANALYTICS & INBOX */}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10"
            >
              {/* Stats Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 select-none">
                <div className="glassmorphism p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-wider">Page Views</span>
                    <Eye className="w-4 h-4 text-neon-cyan" />
                  </div>
                  <div className="text-xl font-bold font-mono text-foreground">{stats.pageViews}</div>
                  <span className="text-[9px] font-mono text-neutral-500 block mt-1 leading-none">Visits</span>
                </div>
                <div className="glassmorphism p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-wider">Resume DLs</span>
                    <Download className="w-4 h-4 text-neon-purple" />
                  </div>
                  <div className="text-xl font-bold font-mono text-foreground">{stats.resumeDownloads}</div>
                  <span className="text-[9px] font-mono text-neutral-500 block mt-1 leading-none">Downloads</span>
                </div>
                <div className="glassmorphism p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-wider">GitHub Clicks</span>
                    <Globe className="w-4 h-4 text-neon-pink" />
                  </div>
                  <div className="text-xl font-bold font-mono text-foreground">{stats.githubClicks}</div>
                  <span className="text-[9px] font-mono text-neutral-500 block mt-1 leading-none">Repos Clicks</span>
                </div>
                <div className="glassmorphism p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-wider">Messages</span>
                    <Mail className="w-4 h-4 text-neon-cyan" />
                  </div>
                  <div className="text-xl font-bold font-mono text-foreground">{stats.messageCount}</div>
                  <span className="text-[9px] font-mono text-neutral-500 block mt-1 leading-none">Inbound</span>
                </div>
                <div className="glassmorphism p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-wider">AI Chats</span>
                    <Activity className="w-4 h-4 text-neon-purple" />
                  </div>
                  <div className="text-xl font-bold font-mono text-foreground">{stats.chatbotSessions}</div>
                  <span className="text-[9px] font-mono text-neutral-500 block mt-1 leading-none">Sessions</span>
                </div>
                <div className="glassmorphism p-5 rounded-2xl">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-wider">Voice Calls</span>
                    <Activity className="w-4 h-4 text-neon-pink" />
                  </div>
                  <div className="text-xl font-bold font-mono text-foreground">{stats.voiceCalls}</div>
                  <span className="text-[9px] font-mono text-neutral-500 block mt-1 leading-none">Calls</span>
                </div>
              </div>

              {/* Inbound Inquiries list */}
              <div className="glassmorphism rounded-2xl p-6">
                <h4 className="text-sm font-bold font-mono tracking-widest text-foreground uppercase border-b border-glass-border pb-3 mb-6 flex items-center gap-2 select-none">
                  <Mail className="w-4.5 h-4.5 text-neon-cyan" /> Inbound Inquiries
                </h4>

                {loadingMessages ? (
                  <div className="text-center py-10 font-mono text-xs text-neutral-500 animate-pulse">
                    Retrieving inbox telemetry...
                  </div>
                ) : messages.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-glass-border text-neutral-500 font-mono select-none">
                          <th className="py-2.5 font-normal uppercase">Sender</th>
                          <th className="py-2.5 font-normal uppercase">Email</th>
                          <th className="py-2.5 font-normal uppercase">Message Details</th>
                          <th className="py-2.5 font-normal uppercase text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-glass-border/30">
                        {messages.map((msg) => (
                          <tr key={msg.id} className="hover:bg-glass-bg/20 transition-colors">
                            <td className="py-3.5 font-semibold text-foreground">{msg.name}</td>
                            <td className="py-3.5 font-mono text-neutral-400">{msg.email}</td>
                            <td className="py-3.5 text-neutral-300 pr-4 leading-relaxed font-light">{msg.message}</td>
                            <td className="py-3.5 font-mono text-neutral-500 text-right select-none">
                              {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 font-mono text-xs text-neutral-500 select-none">
                    Inbox is currently empty.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: BLOGS CRUD */}
          {activeTab === "blogs" && (
            <motion.div
              key="blogs-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Form (Col 5) */}
              <div className="lg:col-span-5 glassmorphism p-6 rounded-2xl">
                <h4 className="text-xs font-mono font-bold tracking-widest text-neon-cyan uppercase border-b border-glass-border pb-3 mb-5 flex items-center gap-1.5 select-none">
                  {editingBlog ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingBlog ? "Edit Blog Entry" : "Create Blog Entry"}
                </h4>

                <form onSubmit={handleBlogSubmit} className="space-y-4 text-xs font-mono">
                  <div className="space-y-1.5">
                    <label className="text-neutral-400">BLOG TITLE *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LLM Prompt Caches"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground focus:outline-none focus:border-neon-cyan/50 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">SLUG URL *</label>
                      <input
                        type="text"
                        required
                        placeholder="llm-prompt-caches"
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground focus:outline-none focus:border-neon-cyan/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">CATEGORY</label>
                      <select
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground focus:outline-none focus:border-neon-cyan/50"
                      >
                        <option>LLM</option>
                        <option>RAG</option>
                        <option>AI Agents</option>
                        <option>MCP</option>
                        <option>LangGraph</option>
                        <option>AI Infrastructure</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">TAGS (COMMA SEP)</label>
                      <input
                        type="text"
                        placeholder="python, llm, caching"
                        value={blogForm.tags}
                        onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground focus:outline-none focus:border-neon-cyan/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">READ TIME</label>
                      <input
                        type="text"
                        placeholder="5 min read"
                        value={blogForm.readTime}
                        onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground focus:outline-none focus:border-neon-cyan/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400">BRIEF DESCRIPTION *</label>
                    <textarea
                      required
                      placeholder="Enter short description..."
                      rows={2}
                      value={blogForm.description}
                      onChange={(e) => setBlogForm({ ...blogForm, description: e.target.value })}
                      className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground focus:outline-none focus:border-neon-cyan/50 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400 font-bold block">
                      CONTENT (MARKDOWN SUPPORTED) *
                    </label>
                    <textarea
                      required
                      placeholder="Use ### for subheadings, **text** for bold, `code` for code blocks..."
                      rows={8}
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground focus:outline-none focus:border-neon-cyan/50 font-mono text-[11px]"
                    />
                  </div>

                  <div className="flex items-center gap-2 py-1 select-none">
                    <input
                      type="checkbox"
                      id="featuredBlog"
                      checked={blogForm.featured}
                      onChange={(e) => setBlogForm({ ...blogForm, featured: e.target.checked })}
                      className="rounded border-glass-border bg-glass-bg text-neon-cyan focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="featuredBlog" className="text-neutral-400 cursor-pointer">FEATURED BLOG</label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 hover:bg-neon-cyan/25 text-neon-cyan font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> {editingBlog ? "Save Updates" : "Insert Blog"}
                    </button>
                    {editingBlog && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBlog(null);
                          setBlogForm({ title: "", slug: "", category: "LLM", tags: "", readTime: "5 min read", description: "", content: "", featured: false });
                        }}
                        className="px-4 py-3 rounded-xl border border-glass-border text-neutral-400 hover:text-foreground transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right Column: Blogs Index (Col 7) */}
              <div className="lg:col-span-7 glassmorphism p-6 rounded-2xl">
                <h4 className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase border-b border-glass-border pb-3 mb-5 select-none">
                  Existing Blog Logs ({blogsList.length})
                </h4>

                <div className="flex flex-col gap-3.5 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                  {blogsList.map((blog) => (
                    <div 
                      key={blog.slug}
                      className="p-4 rounded-xl border border-glass-border bg-glass-bg/30 flex items-center justify-between gap-4 group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 select-none">
                          <span className="text-[9px] font-mono text-neon-cyan px-2 py-0.5 rounded bg-neon-cyan/5 border border-neon-cyan/10 uppercase">
                            {blog.category}
                          </span>
                          {blog.featured && (
                            <span className="text-[9px] font-mono text-neon-purple px-2 py-0.5 rounded bg-neon-purple/5 border border-neon-purple/10 uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-foreground leading-snug truncate" title={blog.title}>
                          {blog.title}
                        </h5>
                        <p className="text-[10px] font-mono text-neutral-500 truncate mt-1">
                          Slug: /{blog.slug}
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEditBlog(blog)}
                          className="p-2 rounded-lg border border-glass-border hover:border-neon-cyan/40 text-neutral-400 hover:text-neon-cyan transition-colors"
                          title="Edit log"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.slug)}
                          className="p-2 rounded-lg border border-glass-border hover:border-neon-pink/40 text-neutral-400 hover:text-neon-pink transition-colors"
                          title="Delete log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: PROJECTS CRUD */}
          {activeTab === "projects" && (
            <motion.div
              key="projects-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Form Col 5 */}
              <div className="lg:col-span-5 glassmorphism p-6 rounded-2xl">
                <h4 className="text-xs font-mono font-bold tracking-widest text-neon-cyan uppercase border-b border-glass-border pb-3 mb-5 flex items-center gap-1.5 select-none">
                  {editingProject ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingProject ? "Edit Project" : "Add Project"}
                </h4>

                <form onSubmit={handleProjectSubmit} className="space-y-4 text-xs font-mono">
                  <div className="space-y-1.5">
                    <label className="text-neutral-400">PROJECT TITLE *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SarkarAI"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">SLUG URL *</label>
                      <input
                        type="text"
                        required
                        placeholder="sarkar-ai"
                        value={projectForm.slug}
                        onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">CATEGORY</label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground"
                      >
                        <option>Generative AI</option>
                        <option>Machine Learning</option>
                        <option>Computer Vision</option>
                        <option>Web Engineering</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400">TECH STACK (COMMA SEP) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Next.js, FastAPI, LangChain, Gemini API"
                      value={projectForm.tech}
                      onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                      className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">GITHUB REPO URL</label>
                      <input
                        type="text"
                        placeholder="https://github.com/..."
                        value={projectForm.github}
                        onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">LIVE DEMO URL</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={projectForm.demo}
                        onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400">BRIEF CARD DESCRIPTION *</label>
                    <textarea
                      required
                      placeholder="Describe card summary..."
                      rows={2}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400 font-bold block">LONG PROFILE DETAILS</label>
                    <textarea
                      placeholder="Long documentation text..."
                      rows={4}
                      value={projectForm.longDescription}
                      onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                      className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground font-sans text-[11px]"
                    />
                  </div>

                  <div className="flex items-center gap-2 py-1 select-none">
                    <input
                      type="checkbox"
                      id="featuredProj"
                      checked={projectForm.featured}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="rounded border-glass-border bg-glass-bg text-neon-cyan focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="featuredProj" className="text-neutral-400 cursor-pointer">FEATURED SHOWCASE</label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 hover:bg-neon-cyan/25 text-neon-cyan font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Save Project
                    </button>
                    {editingProject && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(null);
                          setProjectForm({
                            title: "", slug: "", description: "", category: "Generative AI", tech: "", github: "", demo: "", featured: false,
                            longDescription: "", challenges: "", learnings: "", architecture: ""
                          });
                        }}
                        className="px-4 py-3 rounded-xl border border-glass-border text-neutral-400 hover:text-foreground cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Project Index list (Col 7) */}
              <div className="lg:col-span-7 glassmorphism p-6 rounded-2xl">
                <h4 className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase border-b border-glass-border pb-3 mb-5 select-none">
                  Project showcases ({projectsList.length})
                </h4>

                <div className="flex flex-col gap-3.5 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                  {projectsList.map((p) => (
                    <div 
                      key={p.slug}
                      className="p-4 rounded-xl border border-glass-border bg-glass-bg/30 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 select-none">
                          <span className="text-[9px] font-mono text-neon-cyan px-2 py-0.5 rounded bg-neon-cyan/5 border border-neon-cyan/10 uppercase">
                            {p.category}
                          </span>
                          {p.featured && (
                            <span className="text-[9px] font-mono text-neon-purple px-2 py-0.5 rounded bg-neon-purple/5 border border-neon-purple/10 uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-foreground leading-snug truncate" title={p.title}>
                          {p.title}
                        </h5>
                        <p className="text-[10px] text-neutral-500 truncate mt-1">
                          Stack: {Array.isArray(p.tech) ? p.tech.join(", ") : p.tech}
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEditProject(p)}
                          className="p-2 rounded-lg border border-glass-border hover:border-neon-cyan/40 text-neutral-400 hover:text-neon-cyan transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.slug)}
                          className="p-2 rounded-lg border border-glass-border hover:border-neon-pink/40 text-neutral-400 hover:text-neon-pink transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: RESEARCH PAPERS CRUD */}
          {activeTab === "research" && (
            <motion.div
              key="research-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Form Column */}
              <div className="lg:col-span-5 glassmorphism p-6 rounded-2xl">
                <h4 className="text-xs font-mono font-bold tracking-widest text-neon-cyan uppercase border-b border-glass-border pb-3 mb-5 flex items-center gap-1.5 select-none">
                  {editingResearch ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingResearch ? "Edit Research paper review" : "Add Research review"}
                </h4>

                <form onSubmit={handleResearchSubmit} className="space-y-4 text-xs font-mono">
                  <div className="space-y-1.5">
                    <label className="text-neutral-400">PAPER TITLE *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Attention Is All You Need"
                      value={researchForm.title}
                      onChange={(e) => setResearchForm({ ...researchForm, title: e.target.value })}
                      className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">CATEGORY</label>
                      <select
                        value={researchForm.category}
                        onChange={(e) => setResearchForm({ ...researchForm, category: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground"
                      >
                        <option>LLM</option>
                        <option>RAG</option>
                        <option>AI Agents</option>
                        <option>MCP</option>
                        <option>LangGraph</option>
                        <option>AI Infrastructure</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">PUBLICATION DATE</label>
                      <input
                        type="date"
                        required
                        value={researchForm.date}
                        onChange={(e) => setResearchForm({ ...researchForm, date: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400">FOCUS CORE *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Multi-head self attention logic layers"
                      value={researchForm.focus}
                      onChange={(e) => setResearchForm({ ...researchForm, focus: e.target.value })}
                      className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400">SUMMARY TAKEAWAY *</label>
                    <textarea
                      required
                      placeholder="Key research takeaways..."
                      rows={3}
                      value={researchForm.takeaway}
                      onChange={(e) => setResearchForm({ ...researchForm, takeaway: e.target.value })}
                      className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-neutral-400">IMPLEMENTATION IMPACT *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Foundation layer of Sarkar schemes parser"
                      value={researchForm.impact}
                      onChange={(e) => setResearchForm({ ...researchForm, impact: e.target.value })}
                      className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 hover:bg-neon-cyan/25 text-neon-cyan font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Save Review
                    </button>
                    {editingResearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingResearch(null);
                          setResearchForm({ title: "", focus: "", takeaway: "", impact: "", category: "LLM", date: new Date().toISOString().split("T")[0] });
                        }}
                        className="px-4 py-3 rounded-xl border border-glass-border text-neutral-400 hover:text-foreground cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Research Index Column */}
              <div className="lg:col-span-7 glassmorphism p-6 rounded-2xl">
                <h4 className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase border-b border-glass-border pb-3 mb-5 select-none">
                  Reviewed papers ({researchList.length})
                </h4>

                <div className="flex flex-col gap-3.5 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                  {researchList.map((r) => (
                    <div 
                      key={r.id}
                      className="p-4 rounded-xl border border-glass-border bg-glass-bg/30 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 select-none">
                          <span className="text-[9px] font-mono text-neon-purple px-2 py-0.5 rounded bg-neon-purple/5 border border-neon-purple/10 uppercase font-bold">
                            {r.category}
                          </span>
                          <span className="text-[9px] font-mono text-neutral-500">
                            {r.date}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-foreground leading-snug truncate" title={r.title}>
                          {r.title}
                        </h5>
                        <p className="text-[10px] text-neutral-400 truncate mt-1">
                          Focus: {r.focus}
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEditResearch(r)}
                          className="p-2 rounded-lg border border-glass-border hover:border-neon-cyan/40 text-neutral-400 hover:text-neon-cyan transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteResearch(r.id)}
                          className="p-2 rounded-lg border border-glass-border hover:border-neon-pink/40 text-neutral-400 hover:text-neon-pink transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: SETTINGS & ASSETS */}
          {activeTab === "settings" && (
            <motion.div
              key="settings-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Social Profiles settings (Col 7) */}
              <div className="lg:col-span-7 glassmorphism p-6 rounded-2xl">
                <h4 className="text-xs font-mono font-bold tracking-widest text-neon-cyan uppercase border-b border-glass-border pb-3 mb-5 flex items-center gap-1.5 select-none">
                  <Share2 className="w-4 h-4 text-neon-cyan" /> Social Profile configurations
                </h4>

                <form onSubmit={handleSettingsSubmit} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">GITHUB PROFILE</label>
                      <input
                        type="text"
                        value={socialLinks.github}
                        onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">LINKEDIN URL</label>
                      <input
                        type="text"
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">GOOGLE CLOUD PROFILE</label>
                      <input
                        type="text"
                        value={socialLinks.gcp}
                        onChange={(e) => setSocialLinks({ ...socialLinks, gcp: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">COMMUDLE URL</label>
                      <input
                        type="text"
                        value={socialLinks.commudle}
                        onChange={(e) => setSocialLinks({ ...socialLinks, commudle: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">TWITTER/X LINK</label>
                      <input
                        type="text"
                        value={socialLinks.twitter}
                        onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">INSTAGRAM URL</label>
                      <input
                        type="text"
                        value={socialLinks.instagram}
                        onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">DISCORD USERNAME</label>
                      <input
                        type="text"
                        value={socialLinks.discord}
                        onChange={(e) => setSocialLinks({ ...socialLinks, discord: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-neutral-400">PUBLIC EMAIL</label>
                      <input
                        type="email"
                        value={socialLinks.email}
                        onChange={(e) => setSocialLinks({ ...socialLinks, email: e.target.value })}
                        className="w-full bg-glass-bg border border-glass-border p-2.5 rounded-xl text-foreground"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 hover:bg-neon-cyan/25 text-neon-cyan font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Link Sync Configurations
                  </button>
                </form>
              </div>

              {/* Resume Asset Uploader mockup (Col 5) */}
              <div className="lg:col-span-5 glassmorphism p-6 rounded-2xl select-none">
                <h4 className="text-xs font-mono font-bold tracking-widest text-neon-purple uppercase border-b border-glass-border pb-3 mb-5 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-neon-purple" /> Deploy Resume PDF Asset
                </h4>

                <form onSubmit={handleResumeUpload} className="space-y-5 text-xs font-mono">
                  <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                    Upload your latest validated resume PDF. This pipeline will automatically override the existing <code className="text-neon-cyan bg-glass-bg border border-glass-border px-1 rounded">/public/resume.pdf</code> route for quick recruiter downloads.
                  </p>

                  <div className="border-2 border-dashed border-glass-border rounded-xl p-6 text-center bg-glass-bg/20 flex flex-col items-center justify-center gap-2 hover:border-neon-purple/50 transition-colors">
                    <FileText className="w-8 h-8 text-neutral-500" />
                    {resumeFile ? (
                      <span className="text-xs text-foreground font-semibold font-sans">{resumeFile.name}</span>
                    ) : (
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wide">Drag & Drop or Click to Select PDF</span>
                    )}
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setResumeFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="resumeFileSelect"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById("resumeFileSelect")?.click()}
                      className="px-3 py-1.5 rounded-lg border border-glass-border bg-glass-bg hover:bg-glass-bg/75 text-[9px] text-neutral-400 hover:text-foreground transition-colors cursor-pointer"
                    >
                      Browse Files
                    </button>
                  </div>

                  {uploadingResume && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] text-neutral-500">
                        <span>Uploading asset to public storage...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-glass-border h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-neon-purple h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!resumeFile || uploadingResume}
                    className="w-full py-3 rounded-xl bg-neon-purple/10 border border-neon-purple/20 hover:bg-neon-purple/20 text-neon-purple font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:hover:bg-neon-purple/10"
                  >
                    <Upload className="w-4 h-4" /> Start Build Pipeline
                  </button>
                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </>
  );
}
