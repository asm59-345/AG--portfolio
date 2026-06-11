"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import CommandMenu from "@/components/CommandMenu";
import ChatAssistant from "@/components/ChatAssistant";
import VoiceAssistant from "@/components/VoiceAssistant";
import SocialSidebar from "@/components/SocialSidebar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Research from "@/components/Research";
import Certifications from "@/components/Certifications";
import Achievements from "@/components/Achievements";
import GithubSection from "@/components/GithubSection";
import Contact from "@/components/Contact";
import CurrentlyLearning from "@/components/CurrentlyLearning";
import GoogleCloud from "@/components/GoogleCloud";
import SocialProfiles from "@/components/SocialProfiles";
import { Mail, Calendar, FileDown } from "lucide-react";
import { Github, Linkedin } from "@/components/SocialIcons";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Log main page view
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/", event: "VIEW" }),
      }).catch(console.warn);
    }
  }, [isLoading]);

  const trackDownload = () => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/", event: "DOWNLOAD", target: "resume-pdf" }),
    }).catch(console.warn);
  };

  const handleSocialClick = (name: string) => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/", event: "CLICK", target: `footer-${name.toLowerCase()}` }),
    }).catch(console.warn);
  };

  return (
    <>
      {/* Loading Screen Entrance Gate */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {/* Main layout contents */}
      {!isLoading && (
        <div className="relative min-h-screen flex flex-col justify-between">
          {/* Custom Follower Cursor */}
          <CustomCursor />

          {/* Canvas Neural Web Background */}
          <ParticleBackground />

          {/* Shifting Ambient Background Glow Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
            {/* Top Section - Cyan Glow */}
            <div className="absolute top-[4%] left-[10%] w-[320px] h-[320px] sm:w-[550px] sm:h-[550px] rounded-full bg-neon-cyan/6 blur-[130px] animate-glow-slow" />
            
            {/* Middle Section - Purple Glow */}
            <div className="absolute top-[38%] right-[5%] w-[380px] h-[380px] sm:w-[650px] sm:h-[650px] rounded-full bg-neon-purple/5 blur-[150px] animate-glow-slow" style={{ animationDelay: "3s", animationDuration: "16s" }} />
            
            {/* Lower Middle Section - Pink Glow */}
            <div className="absolute top-[68%] left-[8%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-neon-pink/4 blur-[120px] animate-glow-slow" style={{ animationDelay: "6s", animationDuration: "20s" }} />

            {/* Bottom Section - Cyan/Purple Mix */}
            <div className="absolute bottom-[5%] right-[10%] w-[350px] h-[350px] sm:w-[580px] sm:h-[580px] rounded-full bg-neon-cyan/5 blur-[140px] animate-glow-slow" style={{ animationDelay: "9s", animationDuration: "18s" }} />
          </div>

          {/* Floating Navigation Header */}
          <Navbar onSearchClick={() => setIsSearchOpen(true)} />

          {/* Social Profiles Floating Sidebar */}
          <SocialSidebar />

          {/* Recruiter Quick Actions Bar */}
          <div className="bg-neutral-950/90 border-b border-glass-border py-3.5 px-6 sticky top-[60px] z-30 select-none hidden md:block backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  Recruiter Hub: Quick scheduling and analytics enabled
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="/resume.pdf"
                  download="Ashmit_Gautam_Resume.pdf"
                  onClick={trackDownload}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 hover:text-neon-cyan transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" /> Resume DL
                </a>
                <a
                  href="https://www.linkedin.com/in/ashmit-gautam-asar"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 hover:text-neon-purple transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" /> Schedule Sync
                </a>
              </div>
            </div>
          </div>

          {/* Centralized section blocks */}
          <main className="flex-grow">
            <Hero />
            
            {/* Embedded Blogs quick portal redirect (Stripe style) */}
            <section className="py-12 bg-neutral-900/60 border-t border-b border-glass-border select-none relative z-10">
              <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider mb-1">
                    Technical Knowledge Base
                  </h4>
                  <p className="text-xs text-neutral-500 font-light font-sans">
                    Read Ashmit's latest research logs on RAG, agent graphs, and system design pipelines.
                  </p>
                </div>
                <Link
                  href="/blogs"
                  className="px-5 py-2.5 text-xs font-mono tracking-widest text-neon-cyan border border-neon-cyan/20 bg-neon-cyan/5 hover:bg-neon-cyan/15 rounded-full uppercase transition-all"
                >
                  Enter Blogs Directory
                </Link>
              </div>
            </section>

            <About />
            <Skills />
            <CurrentlyLearning />
            <Projects />
            <Experience />
            <Education />
            <Research />
            <Certifications />
            <GoogleCloud />
            <Achievements />
            <GithubSection />
            <SocialProfiles />
            <Contact />
          </main>

          {/* Command Menu overlay (⌘K / Ctrl+K) */}
          <CommandMenu isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

          {/* Bottom right AI widget */}
          <ChatAssistant />

          {/* Bottom left Voice AI agent widget */}
          <VoiceAssistant />

          {/* Premium Footer */}
          <footer className="relative bg-neutral-950 border-t border-glass-border py-12 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
            
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              
              {/* Branding */}
              <div className="text-center md:text-left">
                <span className="text-sm font-bold tracking-widest text-foreground font-mono uppercase">
                  ASHMIT GAUTAM <span className="text-neon-cyan text-glow-cyan">●</span> PORTFOLIO
                </span>
                <p className="text-[10px] font-mono text-neutral-500 mt-1 uppercase tracking-wider">
                  Engineered with Next.js 15, Tailwind v4, & Supabase Analytics
                </p>
              </div>

              {/* Status info */}
              <div className="hidden lg:flex items-center gap-1.5 font-mono text-[9px] text-neutral-600 uppercase tracking-widest">
                <span>SYSTEM STATE: SAFE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>// LUCKNOW, INDIA</span>
              </div>

              {/* Socials quick anchors */}
              <div className="flex items-center gap-4 select-none">
                <a
                  href="https://github.com/asm59-345"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleSocialClick("github")}
                  className="text-neutral-500 hover:text-neon-cyan transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/ashmit-gautam-asar"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleSocialClick("linkedin")}
                  className="text-neutral-500 hover:text-neon-purple transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="mailto:gautamashmit1485@gmail.com"
                  className="text-neutral-500 hover:text-neon-pink transition-colors"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>

            </div>

            {/* Copyright */}
            <div className="text-center text-[9px] font-mono text-neutral-600 uppercase tracking-wider mt-8 relative z-10">
              © {new Date().getFullYear()} Ashmit Gautam. All rights reserved.
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
