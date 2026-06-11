"use client";

import { motion } from "framer-motion";
import { BookOpen, GitBranch, Layers, Cpu, ArrowUpRight } from "lucide-react";

interface StudyTrack {
  topic: string;
  category: string;
  status: string;
  description: string;
  keyConcepts: string[];
  source: string;
  iconName: "git-branch" | "layers" | "cpu";
}

const TRACKS: StudyTrack[] = [
  {
    topic: "LangGraph & Agentic Workflows",
    category: "Agentic AI",
    status: "Deep Dive",
    description: "Designing stateful multi-agent systems, cyclic graphs, routing, and memory retention mechanisms using LangGraph.",
    keyConcepts: ["State Management", "Multi-Agent Collaboration", "Human-in-the-loop", "Dynamic Routing"],
    source: "Official LangChain & LangGraph Docs",
    iconName: "git-branch"
  },
  {
    topic: "MLOps & Model Infrastructure",
    category: "Machine Learning Engineering",
    status: "Active Research",
    description: "Configuring containerized pipelines, model registry systems, monitoring, and automated retraining workflows.",
    keyConcepts: ["DVC (Data Version Control)", "MLflow Tracking", "Kubeflow Pipelines", "Prometheus & Grafana"],
    source: "Designing Machine Learning Systems (Chip Huyen)",
    iconName: "cpu"
  },
  {
    topic: "Distributed AI & System Design",
    category: "System Engineering",
    status: "Skill Acquisition",
    description: "Designing systems that handle petabyte-scale data pipelines, distributed training, low-latency inferencing, and rate limiters.",
    keyConcepts: ["Sharding & Replication", "CDN Caching", "Load Balancing", "Vector Database Sharding"],
    source: "Designing Data-Intensive Applications (Martin Kleppmann)",
    iconName: "layers"
  }
];

export default function CurrentlyLearning() {
  const getIcon = (name: string) => {
    switch (name) {
      case "git-branch":
        return <GitBranch className="w-5 h-5 text-neon-cyan" />;
      case "layers":
        return <Layers className="w-5 h-5 text-neon-pink" />;
      case "cpu":
        return <Cpu className="w-5 h-5 text-neon-purple" />;
      default:
        return <BookOpen className="w-5 h-5 text-neon-cyan" />;
    }
  };

  return (
    <section id="currently-learning" className="relative py-24 px-6 overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-neon-purple uppercase mb-3"
          >
            // CONTINUOUS EVOLUTION
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Currently <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">Learning</span>
          </motion.h3>
          <div className="w-16 h-[2px] bg-neon-purple/40 mt-4 rounded-full" />
          <p className="text-xs text-neutral-400 max-w-lg mt-4 font-light">
            An engineer never stops building. Here are the core topics, paradigms, and literatures I am actively mastering right now.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRACKS.map((track, idx) => {
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.45 }}
                className="glassmorphism p-6 rounded-2xl flex flex-col justify-between hover:border-white/10 hover:bg-neutral-900/[0.04] transition-all group interactive-card"
              >
                <div>
                  {/* Category and Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                      {track.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[9px] font-mono font-semibold tracking-wider text-neon-purple uppercase bg-neon-purple/5 border border-neon-purple/10 px-2 py-0.5 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-neon-purple animate-pulse" />
                      {track.status}
                    </span>
                  </div>

                  {/* Header Title with Icon */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-glass-bg border border-glass-border rounded-xl mt-0.5 group-hover:scale-105 transition-transform duration-300">
                      {getIcon(track.iconName)}
                    </div>
                    <h4 className="text-base font-bold text-foreground group-hover:text-neon-cyan transition-colors leading-snug">
                      {track.topic}
                    </h4>
                  </div>

                  <p className="text-xs text-neutral-400 font-light leading-relaxed mb-4">
                    {track.description}
                  </p>

                  {/* Key Concepts Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {track.keyConcepts.map((concept, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[9px] font-mono text-neutral-500 bg-glass-bg border border-glass-border px-2 py-0.5 rounded-md"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Primary Resource Citation */}
                <div className="border-t border-glass-border pt-4 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span className="flex items-center gap-1.5 truncate max-w-[85%]">
                    <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="truncate">Resource: {track.source}</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neon-cyan transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
