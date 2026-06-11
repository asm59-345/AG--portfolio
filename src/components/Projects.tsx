"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code, Database, Eye, X, Award, ShieldAlert, HeartHandshake } from "lucide-react";
import { Github } from "@/components/SocialIcons";
import { supabase } from "@/lib/supabase";
import defaultProjects from "@/content/projects.json";

interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: "AI & ML" | "Web Dev" | "NLP & CV" | "Others";
  tech: string[];
  github: string;
  demo?: string;
  featured?: boolean;
  longDescription: string;
  challenges: string;
  architecture: string[];
  icon: React.ReactNode;
}

const FILTERS = ["All", "AI & ML", "Web Dev", "NLP & CV", "Others"];

const getProjectIcon = (category: string, slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes("sarkar")) return <Award className="w-6 h-6 text-neon-cyan animate-pulse" />;
  if (s.includes("agent") || s.includes("workflow")) return <Code className="w-6 h-6 text-neon-purple" />;
  if (s.includes("gesture")) return <Database className="w-6 h-6 text-neon-pink" />;
  if (s.includes("medical")) return <HeartHandshake className="w-6 h-6 text-neon-pink" />;
  if (s.includes("fraud")) return <ShieldAlert className="w-6 h-6 text-neon-pink animate-bounce" style={{ animationDuration: "3s" }} />;
  
  switch (category) {
    case "AI & ML":
      return <Award className="w-6 h-6 text-neon-cyan" />;
    case "Web Dev":
      return <Code className="w-6 h-6 text-neon-purple" />;
    case "NLP & CV":
      return <Database className="w-6 h-6 text-neon-pink" />;
    default:
      return <Code className="w-6 h-6 text-neon-cyan" />;
  }
};

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          throw new Error("Supabase projects empty or missing");
        }

        const mapped: Project[] = data.map((p: any, idx: number) => ({
          id: idx,
          slug: p.slug,
          title: p.title,
          description: p.description,
          category: p.category as any,
          tech: Array.isArray(p.tech) ? p.tech : JSON.parse(p.tech || "[]"),
          github: p.github,
          demo: p.demo || undefined,
          featured: !!p.featured,
          longDescription: p.longDescription || p.long_description || "",
          challenges: p.challenges || "",
          architecture: typeof p.architecture === "string"
            ? p.architecture.split("->").map((a: string) => a.trim())
            : Array.isArray(p.architecture) ? p.architecture : ["Custom ML architecture flow"],
          icon: getProjectIcon(p.category, p.slug)
        }));
        setProjectsList(mapped);
      } catch (err) {
        console.warn("Projects Supabase loading failed. Using local fallbacks.", err);
        
        // LocalStorage fallback
        const local = localStorage.getItem("admin_projects");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            const mapped: Project[] = parsed.map((p: any, idx: number) => ({
              ...p,
              id: idx,
              architecture: typeof p.architecture === "string"
                ? p.architecture.split("->").map((a: string) => a.trim())
                : Array.isArray(p.architecture) ? p.architecture : ["Custom ML architecture flow"],
              icon: getProjectIcon(p.category, p.slug || "")
            }));
            setProjectsList(mapped);
            return;
          } catch (e) {
            console.warn("Failed to parse admin_projects cache", e);
          }
        }

        // Static fallback
        const mappedStatic: Project[] = defaultProjects.map((p: any, idx: number) => ({
          id: idx,
          slug: p.slug,
          title: p.title,
          description: p.description,
          category: p.category as any,
          tech: p.tech,
          github: p.github,
          demo: p.demo,
          featured: !!p.featured,
          longDescription: p.longDescription,
          challenges: p.challenges,
          architecture: typeof p.architecture === "string"
            ? p.architecture.split("->").map((a: string) => a.trim())
            : Array.isArray(p.architecture) ? p.architecture : ["Custom ML architecture flow"],
          icon: getProjectIcon(p.category, p.slug)
        }));
        setProjectsList(mappedStatic);
      }
    }

    loadProjects();
  }, []);

  const filteredProjects = projectsList.filter(
    (p) => filter === "All" || p.category === filter
  );

  return (
    <section
      id="projects"
      className="relative py-24 px-6 overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-3 font-bold"
          >
            // TECHNICAL EXECUTIONS
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Featured Engineering <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Showcases</span>
          </motion.h3>
          <div className="w-16 h-[2px] bg-neon-cyan/40 mt-4 rounded-full" />
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer focus:outline-none uppercase border ${
                filter === f
                  ? "bg-neon-cyan/15 border-neon-cyan text-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.15)] font-bold"
                  : "bg-glass-bg border-glass-border text-neutral-400 hover:text-foreground hover:border-glass-border/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`group glassmorphism rounded-2xl overflow-hidden hover:border-neon-cyan/30 transition-all duration-300 flex flex-col justify-between h-[360px] select-none interactive-card relative ${
                  project.featured ? "border border-neon-cyan/25 bg-gradient-to-br from-[#070708]/10 via-[#070708]/10 to-neon-cyan/[0.02]" : ""
                }`}
              >
                {/* Visual Header Mockup */}
                <div className="h-40 bg-glass-bg relative flex items-center justify-center border-b border-glass-border overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />
                  <div className="absolute w-[180px] h-[180px] bg-radial-glow opacity-30 blur-[40px] group-hover:scale-125 transition-transform duration-700" />
                  
                  {/* Decorative Project Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-background border border-glass-border flex items-center justify-center shadow-lg relative group-hover:border-neon-cyan/30 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all duration-300">
                    {project.icon}
                  </div>

                  {/* Featured Badge */}
                  {project.featured && (
                    <span className="absolute top-4 right-4 flex items-center gap-1 text-[9px] font-mono bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan px-2 py-0.5 rounded-full uppercase tracking-wider text-glow-cyan font-bold">
                      <Award className="w-3 h-3" /> Featured
                    </span>
                  )}
                  
                  {/* Tech stack badge count */}
                  <span className="absolute bottom-3 left-4 text-[9px] font-mono text-neutral-500 font-semibold uppercase">
                    TAG: {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-neon-cyan transition-colors line-clamp-1">
                      {project.title}
                    </h4>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-light mt-1">
                      {project.description}
                    </p>
                  </div>

                  {/* Badges and Actions */}
                  <div className="mt-4">
                    {/* Tech tags preview (first 3) */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-mono bg-glass-bg border border-glass-border text-neutral-500 px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="text-[9px] font-mono text-neutral-600 px-1 py-0.5">
                          +{project.tech.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Quick view CTAs */}
                    <div className="flex items-center justify-between border-t border-glass-border pt-3.5">
                      <button
                        onClick={() => setActiveProject(project)}
                        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-foreground transition-colors cursor-pointer focus:outline-none"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>

                      <div className="flex items-center gap-3">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-neutral-400 hover:text-neon-cyan transition-colors"
                          title="View Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-neutral-400 hover:text-neon-purple transition-colors"
                            title="Live Demonstration"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Dynamic Project Details Overlay Modal */}
        <AnimatePresence>
          {activeProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveProject(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-2xl bg-background border border-glass-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-glass-border bg-glass-bg flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-background border border-glass-border flex items-center justify-center shadow-md">
                      {activeProject.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground uppercase tracking-wide">
                        {activeProject.title}
                      </h3>
                      <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest">
                        {activeProject.category} // PROJECT OVERVIEW
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveProject(null)}
                    className="p-1.5 text-neutral-400 hover:text-foreground rounded-md hover:bg-glass-border transition-colors focus:outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                  {/* Detailed Description */}
                  <div>
                    <h5 className="text-xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
                      Description:
                    </h5>
                    <p className="text-xs text-neutral-300 leading-relaxed font-light font-sans">
                      {activeProject.longDescription}
                    </p>
                  </div>

                  {/* Architecture & Flow */}
                  <div>
                    <h5 className="text-xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
                      Core Implementation Pipeline:
                    </h5>
                    <ul className="space-y-1.5">
                      {activeProject.architecture.map((node, i) => (
                        <li
                          key={i}
                          className="text-xs font-mono text-neutral-400 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                          {node}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Engineering Obstacles */}
                  <div className="p-4 rounded-xl border border-neon-purple/20 bg-neon-purple/[0.02]">
                    <h5 className="text-xs font-mono tracking-widest text-neon-purple uppercase mb-1.5">
                      Engineering Challenge & Solution:
                    </h5>
                    <p className="text-xs text-neutral-300 leading-relaxed font-light">
                      {activeProject.challenges}
                    </p>
                  </div>

                  {/* Tech stack badging */}
                  <div>
                    <h5 className="text-xs font-mono tracking-widest text-neutral-500 uppercase mb-2.5">
                      Technologies Involved:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.tech.map((t) => (
                        <span
                          key={t}
                          className="text-xs font-mono bg-glass-bg border border-glass-border text-neutral-300 px-3 py-1 rounded-full animate-float"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-glass-border bg-background flex items-center justify-end gap-3">
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold tracking-wider text-neutral-300 hover:text-foreground border border-glass-border hover:border-neon-cyan/20 bg-glass-bg rounded-full transition-colors focus:outline-none"
                  >
                    <Github className="w-3.5 h-3.5" /> Code Repo
                  </a>
                  {activeProject.demo && (
                    <a
                      href={activeProject.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold tracking-wider text-black bg-gradient-to-r from-neon-cyan to-[#00b8ff] rounded-full hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all focus:outline-none"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> In Action
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
