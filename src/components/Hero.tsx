"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Download, Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/SocialIcons";
import { motion } from "framer-motion";
import Image from "next/image";

const TYPING_TITLES = [
  "AI/ML Engineer",
  "Generative AI Developer",
  "Full Stack Developer",
  "LLM Builder",
  "Open Source Contributor"
];

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentTitle = TYPING_TITLES[titleIndex];
    const typingSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && displayText === currentTitle) {
      // Pause at full text
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % TYPING_TITLES.length);
    } else {
      timer = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentTitle.substring(0, displayText.length - 1)
            : currentTitle.substring(0, displayText.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, titleIndex]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden px-6"
    >
      {/* Background neon blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-neon-cyan/5 blur-[90px] animate-glow-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[100px] animate-glow-slow" style={{ animationDelay: "4s" }} />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Text Area */}
        <div className="lg:col-span-7 flex flex-col items-start text-left order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-3 py-1 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 text-[10px] font-mono tracking-widest text-neon-cyan uppercase mb-6 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.05)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            Welcome to the AI frontier
          </motion.div>

          {/* Large Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-4"
          >
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none text-foreground select-none">
              ASHMIT <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-neon-cyan via-[#8b8b8b] to-neon-purple bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(0,240,255,0.15)]">
                GAUTAM
              </span>
            </h1>
          </motion.div>

          {/* Typing Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-8 flex items-center mb-6"
          >
            <span className="text-sm font-mono text-neutral-400 mr-2 uppercase tracking-widest">
              SYSTEM_ROLE //
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-wide text-neon-cyan text-glow-cyan">
              {displayText}
              <span className="animate-pulse ml-0.5">|</span>
            </h2>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-base text-neutral-400 max-w-xl mb-10 leading-relaxed font-light"
          >
            Building intelligent systems powered by AI, LLMs, RAG, Agentic Workflows, and modern web technologies. Specialized in crafting autonomous, context-aware frameworks and high-performance full-stack applications.
          </motion.p>

          {/* Call-to-actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap gap-4 items-center mb-10"
          >
            <button
              onClick={() => scrollTo("projects")}
              className="group btn-primary flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm focus:outline-none"
            >
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="/resume.pdf"
              download="Ashmit_Gautam_Resume.pdf"
              className="btn-secondary flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm focus:outline-none"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>

            <button
              onClick={() => scrollTo("contact")}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-neon-purple/30 hover:border-neon-purple bg-neon-purple/5 hover:bg-neon-purple/10 text-neon-purple font-semibold text-sm transition-all duration-300 cursor-pointer focus:outline-none"
            >
              <Mail className="w-4 h-4" />
              Hire Me
            </button>
          </motion.div>

          {/* Social connections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center gap-5 border-t border-glass-border pt-8 w-full max-w-sm"
          >
            <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
              CONNECT:
            </span>
            <a
              href="https://github.com/asm59-345"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full border border-glass-border bg-glass-bg hover:bg-neon-cyan/10 hover:border-neon-cyan/30 text-neutral-400 hover:text-neon-cyan transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/ashmit-gautam-asar"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full border border-glass-border bg-glass-bg hover:bg-neon-purple/10 hover:border-neon-purple/30 text-neutral-400 hover:text-neon-purple transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Profile Avatar Frame */}
        <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative w-64 h-64 sm:w-80 sm:h-80"
          >
            {/* Outer glowing orbiting frame */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-neon-cyan via-transparent to-neon-purple animate-spin" style={{ animationDuration: "12s" }} />
            
            {/* Inner frame borders */}
            <div className="absolute inset-[3px] rounded-full bg-background z-10" />
            <div className="absolute inset-[6px] rounded-full border-2 border-dashed border-glass-border z-10 animate-spin" style={{ animationDuration: "30s" }} />

            {/* Profile Avatar Image Container */}
            <div className="absolute inset-[10px] rounded-full overflow-hidden z-20 border border-glass-border group bg-glass-bg">
              <Image
                src="/profile_photo.jpg"
                alt="Ashmit Gautam Professional Portrait"
                fill
                priority
                className="object-cover object-[center_15%] transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 256px, 320px"
              />
              {/* Overlay glass tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating neural indicators */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-3 -right-3 z-30 px-2.5 py-1 rounded-md border border-neon-cyan/20 bg-glass-bg backdrop-blur-md text-[10px] font-mono text-neon-cyan flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
              Agentic AI
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-3 -left-3 z-30 px-2.5 py-1 rounded-md border border-neon-purple/20 bg-glass-bg backdrop-blur-md text-[10px] font-mono text-neon-purple flex items-center gap-1.5 shadow-[0_0_10px_rgba(189,0,255,0.2)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple" />
              RAG Engine
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative vertical coordinates overlay */}
      <div className="absolute bottom-8 right-8 font-mono text-[9px] text-neutral-600 hidden md:block select-none pointer-events-none">
        LAT: 26.8467° N // LNG: 80.9462° E
      </div>
    </section>
  );
}
