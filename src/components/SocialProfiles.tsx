"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Cloud, Users, MessageSquare, ExternalLink, Copy, Check } from "lucide-react";
import { Github, Linkedin } from "@/components/SocialIcons";

interface SocialProfile {
  name: string;
  username: string;
  url: string;
  description: string;
  icon: React.ReactNode;
  color: "cyan" | "purple" | "pink" | "white";
  isCopyable?: boolean;
}

// SVG Icons for Twitter, Instagram, Commudle, Discord, Google Cloud
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="insta-profile-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="28%" stopColor="#fd5949" />
        <stop offset="65%" stopColor="#d6249f" />
        <stop offset="100%" stopColor="#285AEB" />
      </linearGradient>
    </defs>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" stroke="url(#insta-profile-grad)" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#insta-profile-grad)" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke="url(#insta-profile-grad)" />
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

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.9-.65,1.76-1.34,2.58-2a75.58,75.58,0,0,0,73.1,0c.83.71,1.69,1.4,2.59,2a68.21,68.21,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,50.75,124.23,27.88,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
  </svg>
);

const GoogleCloudIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gcp-profile-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="35%" stopColor="#EA4335" />
        <stop offset="70%" stopColor="#FBBC05" />
        <stop offset="100%" stopColor="#34A853" />
      </linearGradient>
    </defs>
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" stroke="url(#gcp-profile-grad)" fill="none" />
  </svg>
);

const SOCIAL_PROFILES: SocialProfile[] = [
  {
    name: "GitHub",
    username: "@asm59-345",
    url: "https://github.com/asm59-345",
    description: "Open-source projects, machine learning models, RAG frameworks, and full-stack repositories.",
    icon: <Github className="w-5 h-5" />,
    color: "cyan"
  },
  {
    name: "LinkedIn",
    username: "Ashmit Gautam",
    url: "https://www.linkedin.com/in/ashmit-gautam-asar",
    description: "Professional networking, hackathon updates, internships timeline, and industry connections.",
    icon: <Linkedin className="w-5 h-5" />,
    color: "purple"
  },
  {
    name: "Google Cloud Profile",
    username: "skills.google/public_profiles/62d03ab9...",
    url: "https://www.skills.google/public_profiles/62d03ab9-e1ab-4cb3-a121-c95363ab1982",
    description: "Verified quest badges, labs, GenAI tracks, and cloud architecture credentials.",
    icon: <GoogleCloudIcon className="w-5 h-5" />,
    color: "cyan"
  },
  {
    name: "Commudle",
    username: "ashu_gautam",
    url: "https://www.commudle.com/users/ashu_gautam",
    description: "Active community hub, tech meetup participation, speaker logs, and developer events.",
    icon: <CommudleIcon className="w-5 h-5" />,
    color: "pink"
  },
  {
    name: "Twitter / X",
    username: "@GautamAshmit081",
    url: "https://twitter.com/GautamAshmit081",
    description: "Tech thoughts, machine learning ecosystem updates, research reposts, and AI discussions.",
    icon: <TwitterIcon className="w-4.5 h-4.5" />,
    color: "white"
  },
  {
    name: "Instagram",
    username: "@iag_908.ml",
    url: "https://www.instagram.com/iag_908.ml/",
    description: "Social snapshots, student life glimpses, custom filters, and casual chats.",
    icon: <InstagramIcon className="w-5 h-5" />,
    color: "purple"
  },
  {
    name: "Discord",
    username: "ashmitgautam_08838",
    url: "ashmitgautam_08838",
    description: "Direct real-time coordination, AI group syncs, development chats, and project calls.",
    icon: <DiscordIcon className="w-5 h-5" />,
    color: "purple",
    isCopyable: true
  },
  {
    name: "Email Address",
    username: "gautamashmit1485@gmail.com",
    url: "mailto:gautamashmit1485@gmail.com",
    description: "Direct channel for career discussions, internship inquiries, collaborations, and queries.",
    icon: <Mail className="w-5 h-5" />,
    color: "pink"
  }
];

export default function SocialProfiles() {
  const [profiles, setProfiles] = useState<SocialProfile[]>(SOCIAL_PROFILES);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ashmit_social_links");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const updated = SOCIAL_PROFILES.map((p) => {
            let value = "";
            let username = p.username;
            if (p.name === "GitHub" && parsed.github) { 
              value = parsed.github; 
              username = "@" + (parsed.github.replace(/\/$/, "").split("/").pop() || "asm59-345"); 
            }
            else if (p.name === "LinkedIn" && parsed.linkedin) { 
              value = parsed.linkedin; 
              username = parsed.linkedin.replace(/\/$/, "").split("/").pop() || p.username; 
            }
            else if (p.name === "Google Cloud Profile" && parsed.gcp) { 
              value = parsed.gcp; 
              username = parsed.gcp.replace(/\/$/, "").split("/").pop()?.substring(0, 15) + "..." || p.username;
            }
            else if (p.name === "Commudle" && parsed.commudle) { 
              value = parsed.commudle; 
              username = "@" + (parsed.commudle.replace(/\/$/, "").split("/").pop() || "ashu_gautam"); 
            }
            else if (p.name === "Twitter / X" && parsed.twitter) { 
              value = parsed.twitter; 
              username = "@" + (parsed.twitter.replace(/\/$/, "").split("/").pop() || "GautamAshmit081"); 
            }
            else if (p.name === "Instagram" && parsed.instagram) { 
              value = parsed.instagram; 
              username = "@" + (parsed.instagram.replace(/\/$/, "").split("/").pop() || "iag_908.ml"); 
            }
            else if (p.name === "Discord" && parsed.discord) { 
              value = parsed.discord; 
              username = parsed.discord; 
            }
            else if (p.name === "Email Address" && parsed.email) { 
              value = `mailto:${parsed.email}`; 
              username = parsed.email; 
            }
            
            if (value) {
              return { ...p, url: value, username };
            }
            return p;
          });
          setProfiles(updated);
        } catch (e) {
          console.warn("Failed to parse dynamic social links:", e);
        }
      }
    }
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    
    // Log telemetry
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname, event: "CLICK", target: `copy-social-${label.toLowerCase()}` }),
    }).catch(console.warn);

    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleLinkClick = (name: string) => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname, event: "CLICK", target: `social-profiles-${name.toLowerCase()}` }),
    }).catch(console.warn);
  };

  return (
    <section id="social-profiles" className="relative py-24 px-6 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/4 w-[280px] h-[280px] bg-neon-cyan/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[320px] h-[320px] bg-neon-purple/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-3"
          >
            // CONNECTIVITY LAYER
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Social Profiles & <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Digital Hubs</span>
          </motion.h3>
          <div className="w-16 h-[2px] bg-neon-cyan/40 mt-4 rounded-full" />
          <p className="text-xs text-neutral-400 max-w-lg mt-4 font-light">
            Find me on open-source repositories, developer networks, professional boards, and gaming handles. Let's sync up.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((profile, idx) => {
            const getProfileStyles = (name: string) => {
              switch (name) {
                case "GitHub":
                  return {
                    iconColor: "text-[#111827] dark:text-neon-cyan",
                    borderGlowHover: "hover:border-[#111827]/40 dark:hover:border-neon-cyan/40 hover:shadow-[0_0_15px_rgba(37,99,235,0.08)]",
                  };
                case "LinkedIn":
                  return {
                    iconColor: "text-[#0A66C2] dark:text-neon-purple",
                    borderGlowHover: "hover:border-[#0A66C2]/40 dark:hover:border-neon-purple/40 hover:shadow-[0_0_15px_rgba(189,0,255,0.08)]",
                  };
                case "Google Cloud Profile":
                  return {
                    iconColor: "", // Handled internally in GoogleCloudIcon via SVG gradient
                    borderGlowHover: "hover:border-sky-500/40 dark:hover:border-neon-cyan/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.08)]",
                  };
                case "Twitter / X":
                  return {
                    iconColor: "text-[#111827] dark:text-white",
                    borderGlowHover: "hover:border-[#111827]/40 dark:hover:border-neutral-400/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]",
                  };
                case "Instagram":
                  return {
                    iconColor: "", // Handled internally in InstagramIcon via SVG gradient
                    borderGlowHover: "hover:border-pink-500/40 dark:hover:border-neon-pink/40 hover:shadow-[0_0_15px_rgba(255,0,122,0.08)]",
                  };
                case "Discord":
                  return {
                    iconColor: "text-[#5865F2]",
                    borderGlowHover: "hover:border-[#5865F2]/40 dark:hover:border-neon-purple/40 hover:shadow-[0_0_15px_rgba(189,0,255,0.08)]",
                  };
                case "Commudle":
                  return {
                    iconColor: "text-neon-pink",
                    borderGlowHover: "hover:border-neon-pink/40 hover:shadow-[0_0_15px_rgba(255,0,122,0.08)]",
                  };
                case "Email Address":
                  return {
                    iconColor: "text-neon-pink",
                    borderGlowHover: "hover:border-neon-pink/40 hover:shadow-[0_0_15px_rgba(255,0,122,0.08)]",
                  };
                default:
                  return {
                    iconColor: "text-foreground",
                    borderGlowHover: "hover:border-glass-border",
                  };
              }
            };

            const styles = getProfileStyles(profile.name);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className={`glassmorphism p-6 rounded-2xl flex flex-col justify-between hover:bg-neutral-900/[0.04] transition-all duration-300 group border border-glass-border ${styles.borderGlowHover}`}
              >
                <div>
                  {/* Icon and Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 bg-glass-bg border border-glass-border rounded-xl ${styles.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                      {profile.icon}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase">
                      {profile.name}
                    </span>
                  </div>

                  {/* Username Display */}
                  <div className="text-sm font-mono font-bold text-foreground mb-2 truncate" title={profile.username}>
                    {profile.username}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                    {profile.description}
                  </p>
                </div>

                {/* Card Action */}
                <div className="border-t border-glass-border pt-4">
                  {profile.isCopyable ? (
                    <button
                      onClick={() => handleCopy(profile.url, profile.name)}
                      className="w-full flex items-center justify-between text-[10px] font-mono text-neutral-500 hover:text-neon-cyan transition-colors focus:outline-none"
                    >
                      <span>
                        {copiedText === profile.name ? "COPIED TO SYSTEM" : "COPY HANDLE"}
                      </span>
                      {copiedText === profile.name ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ) : (
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleLinkClick(profile.name)}
                      className="w-full flex items-center justify-between text-[10px] font-mono text-neutral-500 hover:text-neon-cyan transition-colors"
                    >
                      <span>ESTABLISH SYNC</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neon-cyan transition-colors" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
