"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, Cpu, ExternalLink } from "lucide-react";

interface Certificate {
  title: string;
  issuer: string;
  year: string;
  id?: string;
  type: "Professional" | "Hackathon" | "Workshop" | "Simulation";
}

const CERTIFICATES: Certificate[] = [
  {
    title: "Oracle Cloud Infrastructure 2025 Generative AI Professional",
    issuer: "Oracle Cloud",
    year: "2025",
    id: "OCI-GENAI-2025",
    type: "Professional"
  },
  {
    title: "Open Source Connect India Contributor",
    issuer: "Connect India",
    year: "2025",
    type: "Hackathon"
  },
  {
    title: "GenAI Exchange Hackathon finalist",
    issuer: "GenAI Exchange",
    year: "2025",
    type: "Hackathon"
  },
  {
    title: "HackFest Certificate of Achievement",
    issuer: "HackFest Committee",
    year: "2025",
    type: "Hackathon"
  },
  {
    title: "Hack Node India participant",
    issuer: "Hack Node India",
    year: "2025",
    type: "Hackathon"
  },
  {
    title: "AI Impact India Summit attendee",
    issuer: "AI Impact India",
    year: "2025",
    type: "Workshop"
  },
  {
    title: "AI/ML Certification & Training",
    issuer: "AICTE × Industry partner",
    year: "2024",
    type: "Professional"
  },
  {
    title: "Generative AI & ChatGPT mastery",
    issuer: "Tech Academy",
    year: "2024",
    type: "Professional"
  },
  {
    title: "GenAI Data Analytics Simulation",
    issuer: "Forage × Tech Partner",
    year: "2025",
    type: "Simulation"
  },
  {
    title: "Technology Job Simulation Program",
    issuer: "Forage",
    year: "2024",
    type: "Simulation"
  },
  {
    title: "AI Cloud & GCP Workshop participant",
    issuer: "Google Developer Groups",
    year: "2024",
    type: "Workshop"
  }
];

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="relative py-24 px-6 overflow-hidden bg-neutral-950"
    >
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[350px] h-[350px] bg-neon-cyan/5 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-3"
          >
            // VERIFIED CREDENTIALS
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Certifications & <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Recognitions</span>
          </motion.h3>
          <div className="w-16 h-[2px] bg-neon-cyan/40 mt-4 rounded-full" />
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATES.map((cert, index) => {
            const isProfessional = cert.type === "Professional";
            const isHackathon = cert.type === "Hackathon";
            const typeColor = isProfessional 
              ? "text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5" 
              : isHackathon 
              ? "text-neon-purple border-neon-purple/20 bg-neon-purple/5"
              : "text-neon-pink border-neon-pink/20 bg-neon-pink/5";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (index % 3) * 0.05, duration: 0.4 }}
                className="glassmorphism p-5 rounded-2xl flex flex-col justify-between hover:border-neon-cyan/20 hover:bg-neutral-900/[0.04] transition-all group interactive-card"
              >
                <div>
                  {/* Category and Year */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[9px] font-mono font-semibold tracking-widest px-2.5 py-0.5 rounded-full uppercase ${typeColor}`}>
                      {cert.type}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {cert.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-foreground mb-2 leading-snug group-hover:text-neon-cyan transition-colors">
                    {cert.title}
                  </h4>

                  {/* Issuer */}
                  <p className="text-xs text-neutral-400 font-light mb-4">
                    Issued by {cert.issuer}
                  </p>
                </div>

                {/* Footer validation */}
                <div className="border-t border-glass-border pt-3.5 flex items-center justify-between text-[9px] font-mono">
                  {cert.id ? (
                    <span className="text-neutral-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-500/70" /> ID: {cert.id}
                    </span>
                  ) : (
                    <span className="text-neutral-600 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-neutral-600" /> Event Verified
                    </span>
                  )}
                  
                  <span className="text-neutral-500 flex items-center gap-1 group-hover:text-neon-cyan transition-colors">
                    Credential View <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
