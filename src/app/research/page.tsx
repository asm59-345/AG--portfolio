"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, BookOpen, Search, FileText, ExternalLink, Calendar, 
  Sparkles, Cpu, Layers, Workflow, FileCheck, ShieldAlert, AlertCircle 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";

interface PaperReview {
  id: string;
  title: string;
  focus: string;
  takeaway: string;
  impact: string;
  category: string;
  date: string;
}

interface ArxivPaper {
  title: string;
  summary: string;
  authors: string[];
  published: string;
  id: string;
  pdfUrl: string;
  category: string;
}

const STATIC_REVIEWS: PaperReview[] = [
  {
    id: "1",
    title: "Attention Is All You Need (Transformer)",
    focus: "Multi-Head Self-Attention mechanisms mapping global dependencies.",
    takeaway: "Eliminated recurrence (RNNs) in seq-to-seq models, proving that attention alone handles contextual word associations with high parallelization.",
    impact: "Foundation of all modern LLMs, GPT architectures, and vision transformers.",
    category: "LLM",
    date: "2017-06-12"
  },
  {
    id: "2",
    title: "Retrieval-Augmented Generation (RAG)",
    focus: "Combining dense vector index queries with LLM generation sequences.",
    takeaway: "Integrates parametric knowledge (pre-trained model) with non-parametric knowledge (external vectors) to decrease factual errors.",
    impact: "Critical for building enterprise medical, legal, and financial question-answering bots.",
    category: "RAG",
    date: "2020-05-20"
  },
  {
    id: "3",
    title: "LangGraph & Agentic Graph Coordination",
    focus: "Stateful, multi-agent networks modeling cyclic loops and tasks delegation.",
    takeaway: "Introduced graph-driven agent flows where nodes act as executors and edges write conditional state checks.",
    impact: "Enables complex self-correcting agent chains, multi-step debugging, and autonomous planners.",
    category: "AI Agents",
    date: "2024-01-15"
  },
  {
    id: "4",
    title: "Model Context Protocol (MCP)",
    focus: "Standardizing tool execution and context loading between agents and tools.",
    takeaway: "Defines client-server rules for listing tools, serving prompts, and reading files across separate systems securely.",
    impact: "Standardizes integrations, making integrations plug-and-play across different LLM ecosystems.",
    category: "MCP",
    date: "2024-11-20"
  },
  {
    id: "5",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    focus: "Masked Language Modeling (MLM) and Next Sentence Prediction (NSP).",
    takeaway: "Learns context from both left and right directions simultaneously, optimizing semantic classifications.",
    impact: "Highly effective for advanced grievance analysis and semantic question pair grouping.",
    category: "LLM",
    date: "2018-10-11"
  },
  {
    id: "6",
    title: "LLM Evaluation & AI Safety Guidelines",
    focus: "Factual alignment, red-teaming, and benchmark evaluating pipelines.",
    takeaway: "Systematizes automated testing (RAGAS, G-Eval) to verify faithfulness, context precision, and safety boundaries.",
    impact: "Ensures production deployment readiness by avoiding toxic outputs and prompt injections.",
    category: "AI Infrastructure",
    date: "2023-08-04"
  }
];

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<"reviews" | "arxiv">("reviews");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [arxivPapers, setArxivPapers] = useState<ArxivPaper[]>([]);
  const [loadingArxiv, setLoadingArxiv] = useState(false);
  const [arxivError, setArxivError] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Categories list
  const categories = ["All", "LLM", "RAG", "AI Agents", "MCP", "LangGraph", "AI Infrastructure"];

  // Fetch arXiv papers
  useEffect(() => {
    if (activeTab === "arxiv" && arxivPapers.length === 0) {
      fetchLatestArxiv();
    }
  }, [activeTab]);

  const fetchLatestArxiv = async () => {
    setLoadingArxiv(true);
    setArxivError("");
    try {
      // Fetching recent papers in LLMs, RAG, and Agents
      const query = `(ti:"large language" OR ti:"retrieval-augmented" OR ti:"agentic" OR ti:"multi-agent" OR ti:"RAG")`;
      const url = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(query)}&sortBy=submittedDate&sortOrder=descending&max_results=15`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("arXiv API responded with error");
      const xmlText = await res.text();
      
      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const entries = xmlDoc.getElementsByTagName("entry");
      
      const parsedPapers: ArxivPaper[] = [];
      
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const title = entry.getElementsByTagName("title")[0]?.textContent?.replace(/\n/g, " ").trim() || "Untitled Paper";
        const summary = entry.getElementsByTagName("summary")[0]?.textContent?.replace(/\n/g, " ").trim() || "No abstract available.";
        const published = entry.getElementsByTagName("published")[0]?.textContent || "";
        const id = entry.getElementsByTagName("id")[0]?.textContent || "";
        
        // Authors
        const authorElements = entry.getElementsByTagName("author");
        const authors: string[] = [];
        for (let j = 0; j < authorElements.length; j++) {
          const name = authorElements[j].getElementsByTagName("name")[0]?.textContent;
          if (name) authors.push(name.trim());
        }

        // PDF Link
        let pdfUrl = id;
        const links = entry.getElementsByTagName("link");
        for (let j = 0; j < links.length; j++) {
          const titleAttr = links[j].getAttribute("title");
          const typeAttr = links[j].getAttribute("type");
          const hrefAttr = links[j].getAttribute("href");
          if (typeAttr === "application/pdf" || titleAttr === "pdf") {
            pdfUrl = hrefAttr || pdfUrl;
          }
        }

        // Determine category from title/summary
        let category = "LLM";
        const combined = (title + " " + summary).toLowerCase();
        if (combined.includes("retrieval-augmented") || combined.includes("rag")) {
          category = "RAG";
        } else if (combined.includes("agentic") || combined.includes("agent") || combined.includes("multi-agent")) {
          category = "AI Agents";
        } else if (combined.includes("mcp") || combined.includes("protocol")) {
          category = "MCP";
        } else if (combined.includes("langgraph") || combined.includes("graph")) {
          category = "LangGraph";
        } else if (combined.includes("infrastructure") || combined.includes("eval")) {
          category = "AI Infrastructure";
        }

        parsedPapers.push({
          title,
          summary,
          authors,
          published: published ? new Date(published).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) : "Date unknown",
          id,
          pdfUrl,
          category
        });
      }

      setArxivPapers(parsedPapers);
    } catch (err: any) {
      console.error("Error fetching papers from arXiv:", err);
      setArxivError("Failed to fetch live arXiv telemetry. Standard access has been rate-limited.");
    } finally {
      setLoadingArxiv(false);
    }
  };

  // Filter local reviews
  const filteredReviews = STATIC_REVIEWS.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          paper.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          paper.takeaway.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || paper.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter arXiv papers
  const filteredArxiv = arxivPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          paper.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || paper.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "LLM": return <Layers className="w-4 h-4 text-neon-cyan" />;
      case "RAG": return <BookOpen className="w-4 h-4 text-neon-purple" />;
      case "AI Agents": return <Workflow className="w-4 h-4 text-neon-pink" />;
      case "MCP": return <FileCheck className="w-4 h-4 text-neon-cyan" />;
      default: return <Cpu className="w-4 h-4 text-neon-purple" />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <CustomCursor />
      <ParticleBackground />
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      {/* Main Container */}
      <main className="flex-grow pt-28 pb-16 px-6 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Breadcrumb / Back button */}
        <div className="mb-8 select-none">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-neon-cyan transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO PORTFOLIO
          </Link>
        </div>

        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-glass-border pb-8 mb-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-neon-cyan uppercase block mb-2 font-bold">
              // COGNITIVE RESEARCH HUB
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground uppercase mb-2">
              Research Papers I’m Exploring
            </h1>
            <p className="text-sm text-neutral-400 font-light max-w-2xl">
              An index of core AI architectures, system optimization paradigms, and agentic workflows shaping modern software logic.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-glass-bg border border-glass-border p-1 rounded-xl w-max">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-lg transition-all ${
                activeTab === "reviews" 
                  ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20" 
                  : "text-neutral-400 hover:text-foreground"
              }`}
            >
              Reviewed Papers
            </button>
            <button
              onClick={() => setActiveTab("arxiv")}
              className={`px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-lg transition-all ${
                activeTab === "arxiv" 
                  ? "bg-neon-purple/15 text-neon-purple border border-neon-purple/20" 
                  : "text-neutral-400 hover:text-foreground"
              }`}
            >
              arXiv Live Feed
            </button>
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Search Input */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search paper titles, focus, summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-glass-bg border border-glass-border pl-10 pr-4 py-2.5 rounded-xl text-xs text-foreground placeholder-neutral-500 focus:outline-none focus:border-neon-cyan/50 transition-colors"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 max-w-full overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase border transition-all ${
                  selectedCategory === cat
                    ? "bg-neon-cyan text-white border-neon-cyan font-bold"
                    : "bg-glass-bg text-neutral-400 border-glass-border hover:border-neutral-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Papers Grid rendering */}
        <AnimatePresence mode="wait">
          {activeTab === "reviews" ? (
            <motion.div
              key="reviews-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredReviews.length > 0 ? (
                filteredReviews.map((paper, idx) => (
                  <motion.div
                    key={paper.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    className="glassmorphism p-6 rounded-2xl flex flex-col justify-between hover:border-neon-cyan/20 interactive-card group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-lg bg-glass-bg border border-glass-border flex items-center justify-center group-hover:border-neon-cyan/30 transition-colors">
                          {getCategoryIcon(paper.category)}
                        </div>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                          {paper.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-foreground mb-3 group-hover:text-neon-cyan transition-colors font-sans uppercase tracking-wide">
                        {paper.title}
                      </h4>

                      <div className="space-y-2 mb-4">
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-neon-cyan" /> Focus Core:
                        </div>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                          {paper.focus}
                        </p>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-neon-purple" /> Summary Takeaway:
                        </div>
                        <p className="text-xs text-neutral-300 font-light leading-relaxed">
                          {paper.takeaway}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-glass-border pt-4 mt-4">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                        PROJECT IMPLEMENTATION INFLUENCE:
                      </span>
                      <span className="text-[10px] font-mono text-neon-cyan/90 leading-tight block">
                        {paper.impact}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center select-none">
                  <BookOpen className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">No matching research reviews found</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="arxiv-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {loadingArxiv ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="glassmorphism p-6 rounded-2xl animate-pulse h-48" />
                  ))}
                </div>
              ) : arxivError ? (
                <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-2xl flex items-center gap-4 text-left max-w-2xl mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-500 shrink-0" />
                  <div>
                    <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-1">API Telemetry Interrupted</h4>
                    <p className="text-xs text-neutral-400 font-light">{arxivError}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArxiv.length > 0 ? (
                    filteredArxiv.map((paper, idx) => (
                      <motion.div
                        key={idx}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03, duration: 0.3 }}
                        className="glassmorphism p-6 rounded-2xl flex flex-col justify-between hover:border-neon-purple/20 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-radial-glow opacity-30 pointer-events-none" />
                        <div>
                          <div className="flex items-center justify-between gap-4 mb-3 border-b border-glass-border/30 pb-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-glass-bg border border-glass-border text-neutral-400 tracking-wider">
                              {paper.category}
                            </span>
                            <span className="flex items-center gap-1 text-[9px] font-mono text-neutral-500">
                              <Calendar className="w-3.5 h-3.5" /> {paper.published}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-foreground mb-3 leading-snug group-hover:text-neon-purple transition-colors font-sans">
                            {paper.title}
                          </h4>

                          <p className="text-xs text-neutral-400 font-light leading-relaxed mb-4 line-clamp-4">
                            {paper.summary}
                          </p>

                          <div className="mb-4">
                            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">Authors:</span>
                            <p className="text-[10px] text-neutral-500 truncate max-w-full font-mono">
                              {paper.authors.join(", ")}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-glass-border/40 pt-4 mt-auto flex items-center justify-between">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" /> LIVE TELEMETRY
                          </span>
                          <a
                            href={paper.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-neon-purple hover:text-neon-cyan transition-colors"
                          >
                            PDF PAPER <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center select-none">
                      <FileText className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                      <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">No matching papers found in arXiv cache</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Premium Footer */}
      <footer className="bg-neutral-950 border-t border-glass-border py-8 px-6 text-center text-[9px] font-mono text-neutral-600 uppercase tracking-wider relative z-10">
        © {new Date().getFullYear()} Ashmit Gautam. Powered by arXiv API telemetry.
      </footer>
    </div>
  );
}
