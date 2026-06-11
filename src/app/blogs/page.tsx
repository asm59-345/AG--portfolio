"use client";

import { useState, useEffect } from "react";
import { getAllBlogs, BlogData } from "@/lib/content";
import { Search, Calendar, Clock, ArrowLeft, BookOpen, Activity, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ParticleBackground from "@/components/ParticleBackground";
import CustomCursor from "@/components/CustomCursor";
import { supabase } from "@/lib/supabase";

interface AIUpdateItem {
  type: "news" | "repo" | "paper";
  title: string;
  description: string;
  source: string;
  link: string;
  date: string;
  meta?: string;
}

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [updates, setUpdates] = useState<AIUpdateItem[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // 1. Fetch Blogs from Supabase with local fallback
    async function fetchBlogs() {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .order("date", { ascending: false });

        if (error || !data || data.length === 0) {
          throw new Error("Supabase blogs empty or error");
        }

        const mappedBlogs: BlogData[] = data.map((b: any) => ({
          slug: b.slug,
          title: b.title,
          description: b.description,
          category: b.category,
          tags: Array.isArray(b.tags) ? b.tags : JSON.parse(b.tags || "[]"),
          date: b.date,
          readTime: b.read_time || b.readTime || "5 min read",
          content: b.content,
          featured: b.featured
        }));
        setBlogs(mappedBlogs);
      } catch (err) {
        console.warn("Supabase blogs fallback to local content:", err);
        setBlogs(getAllBlogs());
      }
    }

    // 2. Fetch AI updates feed
    async function fetchUpdates() {
      try {
        const res = await fetch("/api/ai-updates");
        if (res.ok) {
          const data = await res.json();
          setUpdates(data);
        }
      } catch (err) {
        console.warn("Could not load AI telemetry updates:", err);
      } finally {
        setLoadingUpdates(false);
      }
    }

    fetchBlogs();
    fetchUpdates();
    
    // Log page visit
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/blogs", event: "VIEW" }),
    }).catch(console.warn);
  }, []);

  const handleBlogClick = (slug: string) => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/blogs", event: "CLICK", target: `blog-${slug}` }),
    }).catch(console.warn);
  };

  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = activeCategory === "All" || b.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <CustomCursor />
      <ParticleBackground />

      <div className="min-h-screen py-16 px-6 relative z-10 max-w-7xl mx-auto">
        {/* Navigation back */}
        <div className="mb-10 select-none">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-500 hover:text-neon-cyan transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO PORTFOLIO
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <span className="text-[10px] font-mono tracking-[0.2em] text-neon-cyan uppercase block mb-2 font-bold">
            // COGNITIVE LOGS
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground uppercase mb-4">
            Research & <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Insights</span>
          </h1>
          <p className="text-sm text-neutral-400 font-light max-w-2xl">
            Articles on building context-driven RAG pipelines, stateful agent graphs, standardized protocols, and system design workflows.
          </p>
        </div>

        {/* Toolbar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
          {/* Search bar */}
          <div className="lg:col-span-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-glass-border bg-glass-bg focus-within:border-neon-cyan/40 transition-colors">
            <Search className="w-4 h-4 text-neutral-500 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles or tags..."
              className="w-full text-xs text-foreground bg-transparent outline-none border-none focus:ring-0 placeholder-neutral-500"
            />
          </div>

          {/* Category buttons */}
          <div className="lg:col-span-8 flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-wider transition-all duration-300 cursor-pointer focus:outline-none uppercase border ${
                  activeCategory === cat
                    ? "bg-neon-cyan/15 border-neon-cyan text-neon-cyan font-bold"
                    : "bg-glass-bg border-glass-border text-neutral-400 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Grid: Blogs list + Sidebar Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Blogs (Col 8) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog, idx) => (
                <motion.div
                  key={blog.slug}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glassmorphism p-6 rounded-2xl flex flex-col justify-between hover:border-neon-cyan/20 transition-all group interactive-card"
                >
                  <div>
                    {/* Meta details */}
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-neutral-500 mb-4 select-none">
                      <span className="text-neon-cyan flex items-center gap-1.5 uppercase font-bold">
                        <BookOpen className="w-3.5 h-3.5 text-neon-cyan" /> {blog.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {blog.date}
                      </span>
                    </div>

                    {/* Title */}
                    <Link
                      href={`/blogs/${blog.slug}`}
                      onClick={() => handleBlogClick(blog.slug)}
                      className="block focus:outline-none mb-2"
                    >
                      <h3 className="text-base font-bold text-foreground group-hover:text-neon-cyan transition-colors leading-snug">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                      {blog.description}
                    </p>
                  </div>

                  {/* Footer tags & readTime */}
                  <div className="border-t border-glass-border pt-4 flex items-center justify-between mt-auto">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-mono bg-glass-bg border border-glass-border text-neutral-500 px-2 py-0.5 rounded"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                    
                    <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" /> {blog.readTime}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 font-mono text-xs text-neutral-500">
                No matching research logs found in database.
              </div>
            )}
          </div>

          {/* Right panel: Latest AI Updates Feed (Col 4) */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glassmorphism p-6 rounded-2xl flex flex-col gap-5"
            >
              <div>
                <h4 className="text-xs font-mono font-bold tracking-widest text-neon-cyan uppercase flex items-center gap-2 mb-1.5">
                  <Activity className="w-3.5 h-3.5 text-neon-cyan animate-pulse" /> Latest AI Updates
                </h4>
                <p className="text-[11px] text-neutral-500 leading-normal font-light">
                  Live aggregator syncing trends in Agentic workflows, RAG techniques, and trending models daily.
                </p>
              </div>

              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                {loadingUpdates ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-3 border border-glass-border rounded-xl bg-glass-bg/25 animate-pulse h-20" />
                  ))
                ) : updates.length > 0 ? (
                  updates.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-xl border border-glass-border bg-glass-bg/30 hover:bg-glass-bg/70 hover:border-neon-purple/40 transition-all flex flex-col gap-1.5 group"
                    >
                      <div className="flex items-center justify-between gap-2 text-[9px] font-mono text-neutral-500">
                        <span className="text-neon-purple font-bold uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-neon-purple" /> {item.source}
                        </span>
                        <span>{item.date}</span>
                      </div>
                      
                      <h5 className="text-[11px] font-bold text-foreground leading-snug group-hover:text-neon-purple transition-colors truncate">
                        {item.title}
                      </h5>

                      <p className="text-[10px] text-neutral-400 leading-normal font-light line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 border-t border-glass-border/30 pt-1.5 mt-1 select-none">
                        <span>{item.meta || "Telemetric update"}</span>
                        <span className="text-neon-purple font-bold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          EXPLORE <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-center py-6 text-[10px] font-mono text-neutral-500">
                    Aggregation feed offline.
                  </div>
                )}
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </>
  );
}
