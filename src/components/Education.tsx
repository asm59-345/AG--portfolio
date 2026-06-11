"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Landmark } from "lucide-react";

interface EducationItem {
  degree: string;
  major?: string;
  institution: string;
  location: string;
  duration: string;
  highlights: string[];
}

const EDUCATION_ITEMS: EducationItem[] = [
  {
    degree: "Bachelor of Technology",
    major: "Computer Science Engineering (AI & ML)",
    institution: "Dr. A.P.J. Abdul Kalam Technical University",
    location: "Lucknow, Uttar Pradesh, India",
    duration: "2023–2027",
    highlights: [
      "Specializing in Machine Learning models, Deep Learning structures, NLP frameworks, and Vector databases.",
      "Core Coursework: Data Structures, Advanced Algorithms, Database Management Systems, Neural Networks, Operating Systems.",
      "Maintained strong engineering performance and practical project execution."
    ]
  },
  {
    degree: "Intermediate (Science)",
    institution: "BSNV Inter College",
    location: "Lucknow, Uttar Pradesh, India",
    duration: "2022–2023",
    highlights: [
      "Focused on Physics, Chemistry, and Mathematics (PCM).",
      "Gained robust foundations in quantitative analysis, statistics, algebra, and classical logic.",
      "Participated in science exhibitions and secondary programming tasks."
    ]
  }
];

export default function Education() {
  return (
    <section
      id="education"
      className="relative py-24 px-6 overflow-hidden bg-neutral-900"
    >
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-neon-purple/5 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-3"
          >
            // KNOWLEDGE ACCUMULATION
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Academic <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">Background</span>
          </motion.h3>
          <div className="w-16 h-[2px] bg-neon-purple/40 mt-4 rounded-full" />
        </div>

        {/* Cards list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {EDUCATION_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glassmorphism rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-neon-purple/20 hover:bg-neutral-900/[0.04] transition-all group interactive-card"
            >
              <div>
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-[10px] font-mono text-neutral-500">
                  <span className="text-neon-purple font-semibold tracking-wider flex items-center gap-1 uppercase">
                    <GraduationCap className="w-3.5 h-3.5" /> Degree
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {item.duration}
                  </span>
                </div>

                {/* Degree and Major */}
                <h4 className="text-lg font-bold text-foreground group-hover:text-neon-cyan transition-colors mb-2">
                  {item.degree}
                </h4>
                {item.major && (
                  <p className="text-xs font-mono text-neon-cyan/80 mb-4 uppercase tracking-wider">
                    {item.major}
                  </p>
                )}

                {/* Institution */}
                <div className="space-y-1.5 mb-6 text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>{item.institution}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                </div>

                {/* Highlights */}
                <ul className="space-y-2 border-t border-glass-border pt-5">
                  {item.highlights.map((h, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-neutral-400 leading-relaxed font-light list-disc list-inside"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
