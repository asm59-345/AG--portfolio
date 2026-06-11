"use client";

import React, { useState, useEffect } from "react";
import { Mail, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin } from "@/components/SocialIcons";

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string; // cyan, purple, pink
  tooltipText: string;
}

// Custom simple Discord, Commudle, Twitter, and Instagram SVG icons to keep package light
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.9-.65,1.76-1.34,2.58-2a75.58,75.58,0,0,0,73.1,0c.83.71,1.69,1.4,2.59,2a68.21,68.21,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,50.75,124.23,27.88,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
  </svg>
);

const CommudleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const SOCIALS: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/asm59-345",
    icon: <Github className="w-4 h-4" />,
    color: "neon-cyan",
    tooltipText: "asm59-345"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/ashmit-gautam-asar",
    icon: <Linkedin className="w-4 h-4" />,
    color: "neon-purple",
    tooltipText: "ashmit-gautam-asar"
  },
  {
    name: "Discord",
    url: "https://discord.com", // clicks open discord app/site
    icon: <DiscordIcon className="w-4 h-4" />,
    color: "neon-cyan",
    tooltipText: "Discord: ashmitgautam_08838"
  },
  {
    name: "Commudle",
    url: "https://www.commudle.com/users/ashu_gautam",
    icon: <CommudleIcon className="w-4 h-4" />,
    color: "neon-pink",
    tooltipText: "ashu_gautam"
  },
  {
    name: "Twitter",
    url: "https://twitter.com/GautamAshmit081",
    icon: <TwitterIcon className="w-3.5 h-3.5" />,
    color: "neon-cyan",
    tooltipText: "GautamAshmit081"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/iag_908.ml/",
    icon: <InstagramIcon className="w-4 h-4" />,
    color: "neon-purple",
    tooltipText: "iag_908.ml"
  },
  {
    name: "Email",
    url: "mailto:gautamashmit1485@gmail.com",
    icon: <Mail className="w-4 h-4" />,
    color: "neon-pink",
    tooltipText: "Send direct email"
  }
];

export default function SocialSidebar() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>(SOCIALS);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ashmit_social_links");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const updated = SOCIALS.map((s) => {
            let value = "";
            let tooltip = s.tooltipText;
            if (s.name === "GitHub" && parsed.github) { 
              value = parsed.github; 
              tooltip = parsed.github.replace(/https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, ""); 
            }
            else if (s.name === "LinkedIn" && parsed.linkedin) { 
              value = parsed.linkedin; 
              tooltip = parsed.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, ""); 
            }
            else if (s.name === "Discord" && parsed.discord) { 
              value = `https://discord.com`; 
              tooltip = `Discord: ${parsed.discord}`; 
            }
            else if (s.name === "Commudle" && parsed.commudle) { 
              value = parsed.commudle; 
              tooltip = parsed.commudle.replace(/https?:\/\/(www\.)?commudle\.com\/users\//, "").replace(/\/$/, ""); 
            }
            else if (s.name === "Twitter" && parsed.twitter) { 
              value = parsed.twitter; 
              tooltip = parsed.twitter.replace(/https?:\/\/(www\.)?twitter\.com\//, "").replace(/\/$/, ""); 
            }
            else if (s.name === "Instagram" && parsed.instagram) { 
              value = parsed.instagram; 
              tooltip = parsed.instagram.replace(/https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, ""); 
            }
            else if (s.name === "Email" && parsed.email) { 
              value = `mailto:${parsed.email}`; 
              tooltip = parsed.email; 
            }
            
            if (value) {
              return { ...s, url: value, tooltipText: tooltip };
            }
            return s;
          });
          setSocials(updated);
        } catch (e) {
          console.warn("Failed to parse local sidebar social links:", e);
        }
      }
    }
  }, []);

  const handleLinkClick = (name: string) => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname, event: "CLICK", target: `social-${name.toLowerCase()}` }),
    }).catch(console.warn);
  };

  return (
    <div className="fixed left-6 bottom-0 z-40 hidden xl:flex flex-col items-center gap-4 select-none">
      {/* Social List */}
      <div className="flex flex-col gap-3.5 pb-4">
        {socials.map((social, idx) => {
          const isCyan = social.color === "neon-cyan";
          const isPurple = social.color === "neon-purple";
          const glowColorClass = isCyan
            ? "hover:border-neon-cyan hover:bg-neon-cyan/5 hover:text-neon-cyan hover:shadow-[0_0_12px_rgba(37,99,235,0.2)]"
            : isPurple
            ? "hover:border-neon-purple hover:bg-neon-purple/5 hover:text-neon-purple hover:shadow-[0_0_12px_rgba(124,58,237,0.2)]"
            : "hover:border-neon-pink hover:bg-neon-pink/5 hover:text-neon-pink hover:shadow-[0_0_12px_rgba(219,39,119,0.2)]";

          return (
            <div key={idx} className="relative flex items-center">
              {/* Main anchor button */}
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleLinkClick(social.name)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`w-9 h-9 rounded-full border border-glass-border bg-glass-bg text-neutral-400 flex items-center justify-center transition-all duration-300 cursor-pointer ${glowColorClass}`}
              >
                {social.icon}
              </a>

              {/* Tooltip bubble */}
              <AnimatePresence>
                {hoveredIdx === idx && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-12 bg-glass-bg border border-glass-border px-3 py-1 rounded-md text-[10px] font-mono text-foreground whitespace-nowrap shadow-lg pointer-events-none"
                  >
                    {social.tooltipText}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Vertical line indicator */}
      <div className="w-[1px] h-28 bg-gradient-to-b from-glass-border to-transparent" />
    </div>
  );
}
