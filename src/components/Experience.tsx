"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";

interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  duration: string;
  highlights: string[];
  skills: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    role: "Artificial Intelligence & Data Analytics Intern",
    company: "Skills4Future (AICTE × Shell India × Edunet Foundation)",
    location: "Lucknow, India (Remote)",
    duration: "Oct 2025 – Nov 2025",
    highlights: [
      "Built predictive Machine Learning models using regression and classification techniques.",
      "Performed detailed data preprocessing, cleaning, and outlier management on diverse real-world datasets.",
      "Executed feature engineering to extract high-value indicators and optimized hyperparameter tuning.",
      "Evaluated model metrics (Precision, Recall, ROC-AUC, RMSE) to prepare business analytical reports."
    ],
    skills: ["Python", "Scikit-Learn", "Data Preprocessing", "Feature Engineering", "Model Evaluation"]
  },
  {
    role: "Web Developer Intern",
    company: "CodeAlpha Technology",
    location: "Lucknow, India (Remote)",
    duration: "Feb 2025 – Mar 2025",
    highlights: [
      "Developed high-performance web applications using React.js and modern state management tools.",
      "Engineered responsive layouts maximizing compatibility across various mobile and desktop viewports.",
      "Optimized client-side loading times and assets delivery to improve production lighthouse scores.",
      "Integrated REST API endpoints and managed git workflows for production builds deployment."
    ],
    skills: ["React.js", "Responsive UI", "CSS Grid/Flexbox", "API Integration", "Git & GitHub"]
  }
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-900"
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
            // PROFESSIONAL CHRONICLES
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Work <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">History</span>
          </motion.h3>
          <div className="w-16 h-[2px] bg-neon-cyan/40 mt-4 rounded-full" />
        </div>

        {/* Timeline body */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical axis line */}
          <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-[1px] bg-gradient-to-b from-neon-cyan via-neon-purple to-transparent -translate-x-1/2 hidden sm:block" />
          <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-neon-cyan via-neon-purple to-transparent sm:hidden" />

          <div className="space-y-12">
            {EXPERIENCES.map((exp, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className={`relative flex flex-col sm:flex-row items-stretch ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Glowing Node */}
                  <div className="absolute left-6 sm:left-1/2 top-6 -translate-x-1/2 z-20">
                    <div className="w-4 h-4 rounded-full bg-background border-2 border-neon-cyan flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.6)] animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                    </div>
                  </div>

                  {/* Left spacer for desktop */}
                  <div className="w-full sm:w-1/2 hidden sm:block" />

                  {/* Card Content container */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="w-full sm:w-1/2 pl-12 sm:pl-0 sm:px-8"
                  >
                    <div className="glassmorphism rounded-2xl p-6 hover:border-neon-cyan/20 hover:bg-neutral-900/[0.04] transition-all group interactive-card">
                      
                      {/* Sub-header info */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono font-semibold tracking-wider text-neon-cyan uppercase flex items-center gap-1.5">
                          <Briefcase className="w-3 h-3" /> Internship
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {exp.duration}
                        </span>
                      </div>

                      {/* Job title */}
                      <h4 className="text-base font-bold text-foreground group-hover:text-neon-cyan transition-colors mb-1">
                        {exp.role}
                      </h4>
                      
                      {/* Company name */}
                      <p className="text-xs font-mono text-neutral-400 mb-4">
                        {exp.company}
                      </p>

                      {/* Highlights */}
                      <ul className="space-y-2 mb-6">
                        {exp.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-xs text-neutral-400 flex items-start gap-2 leading-relaxed font-light">
                            <CheckCircle2 className="w-3.5 h-3.5 text-neon-cyan/50 shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Skills tags */}
                      <div className="flex flex-wrap gap-1.5 border-t border-glass-border pt-4">
                        {exp.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[9px] font-mono bg-glass-bg border border-glass-border text-neutral-400 px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
