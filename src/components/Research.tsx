"use client";

import { motion } from "framer-motion";
import { BookOpen, HelpCircle, FileCheck, Layers, Workflow, ShieldAlert, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PaperReview {
  title: string;
  focus: string;
  takeaway: string;
  impact: string;
  icon: React.ReactNode;
}

const PAPERS: PaperReview[] = [
  {
    title: "Attention Is All You Need (Transformer)",
    focus: "Multi-Head Self-Attention mechanisms mapping global dependencies.",
    takeaway: "Eliminated recurrence (RNNs) in seq-to-seq models, proving that attention alone handles contextual word associations with high parallelization.",
    impact: "Foundation of all modern LLMs, GPT architectures, and vision transformers.",
    icon: <Layers className="w-5 h-5 text-neon-cyan" />
  },
  {
    title: "Retrieval-Augmented Generation (RAG)",
    focus: "Combining dense vector index queries with LLM generation sequences.",
    takeaway: "Integrates parametric knowledge (pre-trained model) with non-parametric knowledge (external vectors) to decrease factual errors.",
    impact: "Critical for building enterprise medical, legal, and financial question-answering bots.",
    icon: <BookOpen className="w-5 h-5 text-neon-purple" />
  },
  {
    title: "LangGraph & Agentic Graph Coordination",
    focus: "Stateful, multi-agent networks modeling cyclic loops and tasks delegation.",
    takeaway: "Introduced graph-driven agent flows where nodes act as executors and edges write conditional state checks.",
    impact: "Enables complex self-correcting agent chains, multi-step debugging, and autonomous planners.",
    icon: <Workflow className="w-5 h-5 text-neon-pink" />
  },
  {
    title: "Model Context Protocol (MCP)",
    focus: "Standardizing tool execution and context loading between agents and tools.",
    takeaway: "Defines client-server rules for listing tools, serving prompts, and reading files across separate systems securely.",
    impact: "Standardizes integrations, making integrations plug-and-play across different LLM ecosystems.",
    icon: <FileCheck className="w-5 h-5 text-neon-cyan" />
  },
  {
    title: "BERT & Bidirectional Representations",
    focus: "Masked Language Modeling (MLM) and Next Sentence Prediction (NSP).",
    takeaway: "Learns context from both left and right directions simultaneously, optimizing semantic classifications.",
    impact: "Highly effective for advanced grievance analysis and semantic question pair grouping.",
    icon: <Layers className="w-5 h-5 text-neon-purple" />
  },
  {
    title: "LLM Evaluation & AI Safety Guidelines",
    focus: "Factual alignment, red-teaming, and benchmark evaluating pipelines.",
    takeaway: "Systematizes automated testing (RAGAS, G-Eval) to verify faithfulness, context precision, and safety boundaries.",
    impact: "Ensures production deployment readiness by avoiding toxic outputs and prompt injections.",
    icon: <ShieldAlert className="w-5 h-5 text-neon-pink" />
  }
];

export default function Research() {
  return (
    <section
      id="research"
      className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-neutral-900 to-neutral-950"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-3"
          >
            // COGNITIVE RESEARCH LAB
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Deep Studies & <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Implementations</span>
          </motion.h3>
          <div className="w-16 h-[2px] bg-neon-cyan/40 mt-4 rounded-full" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAPERS.map((paper, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="glassmorphism p-6 rounded-2xl flex flex-col justify-between hover:border-neon-cyan/20 hover:bg-neutral-900/[0.04] transition-all group interactive-card"
            >
              <div>
                {/* Icon wrapper */}
                <div className="w-9 h-9 rounded-xl bg-glass-bg border border-glass-border flex items-center justify-center mb-4 group-hover:border-neon-cyan/30 transition-colors">
                  {paper.icon}
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-foreground mb-3 group-hover:text-neon-cyan transition-colors font-sans uppercase tracking-wide">
                  {paper.title}
                </h4>

                {/* Focus */}
                <div className="space-y-2 mb-4">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-neon-cyan" /> Focus Core:
                  </div>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {paper.focus}
                  </p>
                </div>

                {/* Takeaway */}
                <div className="space-y-2 mb-4">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-neon-purple" /> Summary Takeaway:
                  </div>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed font-sans">
                    {paper.takeaway}
                  </p>
                </div>
              </div>

              {/* Impact */}
              <div className="border-t border-glass-border pt-4 mt-4">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  PROJECT IMPLEMENTATION INFLUENCE:
                </span>
                <span className="text-[10px] font-mono text-neon-cyan/80">
                  {paper.impact}
                </span>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Portal redirection */}
        <div className="flex justify-center select-none mt-12">
          <Link
            href="/research"
            className="px-6 py-3 text-xs font-mono tracking-widest text-neon-cyan border border-neon-cyan/20 bg-neon-cyan/5 hover:bg-neon-cyan/15 rounded-full uppercase transition-all flex items-center gap-2 font-bold hover:scale-105 duration-200"
          >
            Enter Cognitive Research Lab <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
