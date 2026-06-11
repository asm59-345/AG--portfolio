"use client";

import { motion as motionClient } from "framer-motion";
import { Cloud, ExternalLink, Award, Sparkles, Database, Cpu } from "lucide-react";

interface Badge {
  title: string;
  category: "GenAI" | "Cloud Infrastructure" | "Data & MLOps";
  description: string;
  status: "Completed" | "In Progress";
  iconName: "sparkles" | "cloud" | "database" | "cpu";
}

const BADGES: Badge[] = [
  {
    title: "Generative AI Fundamentals",
    category: "GenAI",
    description: "Mastery of large language models, prompt engineering, and Vertex AI application design.",
    status: "Completed",
    iconName: "sparkles"
  },
  {
    title: "Vertex AI & Vector Search",
    category: "Data & MLOps",
    description: "Building production RAG pipelines using Gemini models and Google Vector Search engine.",
    status: "Completed",
    iconName: "cpu"
  },
  {
    title: "Google Cloud Fundamentals",
    category: "Cloud Infrastructure",
    description: "Core infrastructure, networking, IAM policies, and cloud resource provisioning.",
    status: "Completed",
    iconName: "cloud"
  },
  {
    title: "MLOps with Vertex AI",
    category: "Data & MLOps",
    description: "Automating model training pipelines, logging, metadata tracking, and serving endpoints.",
    status: "In Progress",
    iconName: "database"
  }
];

export default function GoogleCloud() {
  const getIcon = (name: string) => {
    switch (name) {
      case "sparkles":
        return <Sparkles className="w-5 h-5 text-neon-pink" />;
      case "cloud":
        return <Cloud className="w-5 h-5 text-neon-cyan" />;
      case "database":
        return <Database className="w-5 h-5 text-neon-purple" />;
      case "cpu":
        return <Cpu className="w-5 h-5 text-neon-cyan" />;
      default:
        return <Award className="w-5 h-5 text-neon-cyan" />;
    }
  };

  const handleProfileClick = () => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/", event: "CLICK", target: "gcp-skills-profile" }),
    }).catch(console.warn);
  };

  return (
    <section id="google-cloud" className="relative py-24 px-6 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-neon-cyan/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-neon-purple/5 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motionClient.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-3"
          >
            // CLOUD & LEARNING JOURNEY
          </motionClient.h2>
          <motionClient.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Google Cloud <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">AI Ecosystem</span>
          </motionClient.h3>
          <div className="w-16 h-[2px] bg-neon-cyan/40 mt-4 rounded-full" />
          <p className="text-xs text-neutral-400 max-w-lg mt-4 font-light">
            Hands-on expertise developing and deploying intelligent applications using enterprise-grade GCP tools and architectures.
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {BADGES.map((badge, idx) => {
            const isGenAI = badge.category === "GenAI";
            const isCloud = badge.category === "Cloud Infrastructure";
            const borderCol = isGenAI 
              ? "group-hover:border-neon-pink/40" 
              : isCloud 
              ? "group-hover:border-neon-cyan/40" 
              : "group-hover:border-neon-purple/40";
            
            return (
              <motionClient.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className={`glassmorphism p-6 rounded-2xl flex flex-col justify-between hover:bg-neutral-900/[0.04] transition-all duration-300 group border border-glass-border ${borderCol}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-glass-bg border border-glass-border rounded-xl group-hover:scale-110 transition-transform duration-300">
                        {getIcon(badge.iconName)}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase">
                        {badge.category}
                      </span>
                    </div>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full uppercase border ${
                      badge.status === "Completed"
                        ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                        : "text-amber-500 border-amber-500/20 bg-amber-500/5"
                    }`}>
                      {badge.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-foreground mb-2 leading-snug group-hover:text-neon-cyan transition-colors">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </motionClient.div>
            );
          })}
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center mt-12">
          <motionClient.a
            href="https://www.skills.google/public_profiles/62d03ab9-e1ab-4cb3-a121-c95363ab1982"
            target="_blank"
            rel="noreferrer"
            onClick={handleProfileClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs text-neon-cyan dark:text-white border border-neon-cyan/30 bg-neon-cyan/10 hover:bg-neon-cyan/20 shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all duration-300"
          >
            <Cloud className="w-4 h-4 text-neon-cyan animate-pulse" />
            Verify Google Cloud Skills Profile
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </motionClient.a>
        </div>

      </div>
    </section>
  );
}
