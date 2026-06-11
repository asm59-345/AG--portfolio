"use client";

import { motion } from "framer-motion";
import { Award, Code2, Users, Calendar, Trophy, Globe } from "lucide-react";

interface Achievement {
  title: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    title: "Google Developer Groups Participant",
    description: "Engaged in collaborative developer workshops, cloud training setups, and local AI initiatives hosted by GDG networks.",
    icon: <Users className="w-5 h-5 text-neon-cyan" />,
    tag: "Community"
  },
  {
    title: "National Hackathon Competitor",
    description: "Competed in high-intensity software hackathons developing context-driven RAG and agentic AI models inside 36-hour sprints.",
    icon: <Trophy className="w-5 h-5 text-neon-purple" />,
    tag: "Competitions"
  },
  {
    title: "Open Source Connect India Contributor",
    description: "Committed documentation enhancements, code patches, and tool integration setups in community-led engineering repositories.",
    icon: <Code2 className="w-5 h-5 text-neon-pink" />,
    tag: "Open Source"
  },
  {
    title: "AI Community Member",
    description: "Actively involved in regional GenAI groups discussing LLM evaluation benchmarks, prompting strategies, and vector optimizations.",
    icon: <Globe className="w-5 h-5 text-neon-cyan" />,
    tag: "Collaboration"
  },
  {
    title: "Technical Event Organizer",
    description: "Orchestrated college developer meetups, coordinating schedules, guiding logistics, and hosting technical coding workshops.",
    icon: <Calendar className="w-5 h-5 text-neon-purple" />,
    tag: "Leadership"
  },
  {
    title: "Competitive Programmer",
    description: "Solving complex algorithmic puzzles on competitive sites, optimizing runtime calculations and memory layouts.",
    icon: <Award className="w-5 h-5 text-neon-pink" />,
    tag: "DSA Core"
  }
];

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="relative py-24 px-6 overflow-hidden bg-neutral-900"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-radial-glow opacity-25 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-3"
          >
            // MILESTONE REACHES
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Key Milestones & <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">Involvements</span>
          </motion.h3>
          <div className="w-16 h-[2px] bg-neon-purple/40 mt-4 rounded-full" />
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="glassmorphism p-6 rounded-2xl flex flex-col justify-between hover:border-neon-purple/20 hover:bg-neutral-900/[0.04] transition-all group interactive-card"
            >
              <div>
                {/* Icon and Tag info */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-glass-border flex items-center justify-center group-hover:border-neon-cyan/30 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest px-2.5 py-0.5 rounded border border-glass-border bg-glass-bg">
                    {item.tag}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-foreground mb-2 leading-snug group-hover:text-neon-cyan transition-colors">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Verified stamp decoration */}
              <div className="border-t border-glass-border pt-4 mt-5 flex items-center justify-between text-[9px] font-mono text-neutral-600">
                <span>SYSTEM_NODE // OK</span>
                <span className="text-neon-cyan/60 animate-pulse">● Active</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
