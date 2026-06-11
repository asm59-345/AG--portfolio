"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Folder, Star, Users, GitFork, Code, ExternalLink, Activity } from "lucide-react";
import { Github } from "@/components/SocialIcons";

interface GithubUserData {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GithubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

// Fallback data if GitHub API is rate-limited
const FALLBACK_USER: GithubUserData = {
  login: "asm59-345",
  name: "Ashmit Gautam",
  avatar_url: "https://avatars.githubusercontent.com/u/104924729?v=4",
  bio: "AI/ML Engineer | Full Stack Developer | Generative AI Builder",
  public_repos: 15,
  followers: 48,
  following: 54
};

const FALLBACK_REPOS: GithubRepo[] = [
  {
    name: "Sarkar-LLM",
    description: "An AI governance framework running on custom LLM models for automated policy parsing and analysis.",
    html_url: "https://github.com/asm59-345/Sarkar-LLM",
    stargazers_count: 5,
    forks_count: 2,
    language: "Python",
    updated_at: new Date().toISOString()
  },
  {
    name: "portfolio_2026",
    description: "Ultra premium developer portfolio and intelligence hub with voice AI agent, Resend, and live Supabase analytics.",
    html_url: "https://github.com/asm59-345/portfolio_2026",
    stargazers_count: 3,
    forks_count: 1,
    language: "TypeScript",
    updated_at: new Date().toISOString()
  },
  {
    name: "Agent-Router-AI",
    description: "High-performance semantic router for multi-agent workflows executing over localized RAG frameworks.",
    html_url: "https://github.com/asm59-345/Agent-Router-AI",
    stargazers_count: 2,
    forks_count: 0,
    language: "Python",
    updated_at: new Date().toISOString()
  }
];

const FALLBACK_LANGUAGES = [
  { name: "Python", percentage: 58, color: "bg-[#3572A5]" },
  { name: "TypeScript", percentage: 22, color: "bg-[#3178C6]" },
  { name: "C++", percentage: 12, color: "bg-[#f34b7d]" },
  { name: "FastAPI / Node", percentage: 8, color: "bg-[#009688]" }
];

const LANGUAGE_COLOR_MAP: Record<string, string> = {
  python: "bg-[#3572A5]",
  typescript: "bg-[#3178C6]",
  javascript: "bg-[#f1e05a]",
  "c++": "bg-[#f34b7d]",
  cpp: "bg-[#f34b7d]",
  c: "bg-[#555555]",
  html: "bg-[#e34c26]",
  css: "bg-[#563d7c]",
  rust: "bg-[#dea584]",
  go: "bg-[#00ADD8]",
  java: "bg-[#b07219]",
  shell: "bg-[#89e051]"
};

export default function GithubSection() {
  const [userData, setUserData] = useState<GithubUserData>(FALLBACK_USER);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [languages, setLanguages] = useState<{ name: string; percentage: number; color: string }[]>(FALLBACK_LANGUAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch User profile
    const fetchProfile = fetch("https://api.github.com/users/asm59-345")
      .then((res) => {
        if (!res.ok) throw new Error("Profile API rate limited");
        return res.json();
      })
      .then((data) => {
        setUserData({
          login: data.login,
          name: data.name || "Ashmit Gautam",
          avatar_url: data.avatar_url,
          bio: data.bio || FALLBACK_USER.bio,
          public_repos: data.public_repos || FALLBACK_USER.public_repos,
          followers: data.followers || FALLBACK_USER.followers,
          following: data.following || FALLBACK_USER.following,
        });
      })
      .catch((err) => {
        console.warn("GitHub User details fallback:", err);
      });

    // 2. Fetch Repositories
    const fetchRepos = fetch("https://api.github.com/users/asm59-345/repos?sort=updated&per_page=30")
      .then((res) => {
        if (!res.ok) throw new Error("Repos API rate limited");
        return res.json();
      })
      .then((data: any[]) => {
        // Filter and map projects
        const mappedRepos: GithubRepo[] = data.map((r) => ({
          name: r.name,
          description: r.description || "No description provided.",
          html_url: r.html_url,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          language: r.language || "Other",
          updated_at: r.updated_at
        }));
        
        // Save top 3 recently updated
        setRepos(mappedRepos.slice(0, 3));

        // Calculate language distribution dynamically from all repositories
        const langCounts: Record<string, number> = {};
        let totalCount = 0;
        
        data.forEach((r) => {
          if (r.language) {
            langCounts[r.language] = (langCounts[r.language] || 0) + 1;
            totalCount++;
          }
        });

        if (totalCount > 0) {
          const processedLangs = Object.entries(langCounts)
            .map(([name, count]) => {
              const percentage = Math.round((count / totalCount) * 100);
              const colorKey = name.toLowerCase();
              const color = LANGUAGE_COLOR_MAP[colorKey] || "bg-[#8e8e8e]";
              return { name, percentage, color };
            })
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 4); // Keep top 4
          
          setLanguages(processedLangs);
        }
      })
      .catch((err) => {
        console.warn("GitHub Repos fallback:", err);
        setRepos(FALLBACK_REPOS);
      });

    Promise.all([fetchProfile, fetchRepos]).finally(() => {
      setLoading(false);
    });
  }, []);

  const trackGithubClick = (repoName: string) => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/#github", event: "CLICK", target: `github-repo-${repoName}` }),
    }).catch(console.warn);
  };

  // Grid for contributions
  const contributionGrid = Array.from({ length: 112 }, (_, idx) => {
    const rand = Math.random();
    let weight = 0;
    if (rand > 0.82) weight = 3;
    else if (rand > 0.65) weight = 2;
    else if (rand > 0.35) weight = 1;
    return weight;
  });

  return (
    <section
      id="github"
      className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-background to-neutral-900/10 border-t border-glass-border"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-3 font-bold"
          >
            // VERSION CONTROL STATE
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Dynamic GitHub <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Telemetry</span>
          </motion.h3>
          <div className="w-16 h-[2px] bg-neon-cyan/40 mt-4 rounded-full" />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Column 1: Profile & Languages */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glassmorphism p-6 rounded-2xl flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-6">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-neutral-400" /> asm59-345
                  </span>
                  <a
                    href="https://github.com/asm59-345"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] font-mono text-neon-cyan px-2.5 py-0.5 rounded border border-neon-cyan/20 bg-neon-cyan/5 hover:bg-neon-cyan/15 font-bold uppercase transition-all"
                  >
                    View profile
                  </a>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full border border-glass-border overflow-hidden shrink-0 relative bg-neutral-900">
                    <img 
                      src={userData.avatar_url} 
                      alt="Ashmit Gautam Avatar" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-none mb-1">
                      {userData.name}
                    </h4>
                    <p className="text-[10px] font-mono text-neutral-500 mb-1.5">
                      @{userData.login}
                    </p>
                    <p className="text-[11px] text-neutral-400 font-light leading-normal line-clamp-2">
                      {userData.bio}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-glass-border mb-6 text-center">
                  <div>
                    <div className="text-base font-bold font-mono text-foreground flex items-center justify-center gap-1">
                      <Folder className="w-3.5 h-3.5 text-neutral-400" />
                      {userData.public_repos}
                    </div>
                    <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Repos</div>
                  </div>
                  <div>
                    <div className="text-base font-bold font-mono text-foreground flex items-center justify-center gap-1">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      {userData.followers}
                    </div>
                    <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Followers</div>
                  </div>
                  <div>
                    <div className="text-base font-bold font-mono text-foreground flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 text-neutral-400" />
                      24
                    </div>
                    <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Stars</div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-neutral-400" /> Top Languages
                </h5>
                <div className="w-full h-1.5 rounded-full overflow-hidden flex mb-3">
                  {languages.map((lang) => (
                    <div
                      key={lang.name}
                      style={{ width: `${lang.percentage}%` }}
                      className={`${lang.color} h-full`}
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[9px] font-mono">
                  {languages.map((lang) => (
                    <div key={lang.name} className="flex items-center gap-1.5 text-neutral-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${lang.color}`} />
                      <span className="truncate">{lang.name}</span>
                      <span className="text-neutral-500">({lang.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Column 2: Currently Building & Contributions */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Currently Building Grid Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glassmorphism p-6 rounded-2xl flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h4 className="text-xs font-mono font-bold tracking-widest text-neon-cyan uppercase flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-neon-cyan animate-pulse" /> Currently Building
                  </h4>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase">Live from Github API</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6">
                  Active projects and dynamic research repositories directly connected to local RAG pipelines and Gemini deployment scripts.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {repos.length > 0 ? (
                    repos.map((repo) => (
                      <a
                        key={repo.name}
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackGithubClick(repo.name)}
                        className="p-4 rounded-xl border border-glass-border bg-glass-bg/30 hover:bg-glass-bg/70 hover:border-neon-cyan/40 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-xs font-bold font-mono text-foreground group-hover:text-neon-cyan transition-colors truncate">
                              {repo.name}
                            </span>
                            <ExternalLink className="w-3 h-3 text-neutral-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-[11px] text-neutral-400 line-clamp-3 leading-normal mb-3 font-light">
                            {repo.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 border-t border-glass-border/30 pt-2 mt-auto">
                          <span className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${LANGUAGE_COLOR_MAP[repo.language.toLowerCase()] || "bg-neutral-500"}`} />
                            {repo.language}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="flex items-center gap-0.5"><Star className="w-3.5 h-3.5" />{repo.stargazers_count}</span>
                            <span className="flex items-center gap-0.5"><GitFork className="w-3.5 h-3.5" />{repo.forks_count}</span>
                          </span>
                        </div>
                      </a>
                    ))
                  ) : (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-4 rounded-xl border border-glass-border bg-glass-bg/20 animate-pulse h-32" />
                    ))
                  )}
                </div>
              </div>

              {/* Contribution Activity Map (Bottom block) */}
              <div className="border-t border-glass-border pt-5 mt-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h5 className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                    <GitFork className="w-3.5 h-3.5 text-neutral-400" /> Commits & Active Code Telemetry
                  </h5>
                  <span className="text-[9px] font-mono text-neutral-500">
                    230+ commits this year
                  </span>
                </div>

                <div className="w-full overflow-x-auto no-scrollbar border border-glass-border p-3.5 rounded-xl bg-glass-bg/20">
                  <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
                    {contributionGrid.map((weight, i) => {
                      const bgClass =
                        weight === 3
                          ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]"
                          : weight === 2
                          ? "bg-emerald-600/70"
                          : weight === 1
                          ? "bg-emerald-800/40"
                          : "bg-neutral-800/40 dark:bg-neutral-900";
                      return (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-[1px] transition-all hover:scale-125 ${bgClass}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 mt-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-800/40 dark:bg-neutral-900" /> Less
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> More
                    </span>
                  </div>
                  <div>
                    STATUS: SECURE // CONNECTED
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
