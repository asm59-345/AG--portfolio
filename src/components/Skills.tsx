"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, Globe, Database, Terminal, 
  Network, Search, MessageSquare, Cpu, Eye, 
  Layers, Server, Binary, Cloud, 
  Play, Laptop, BarChart3, Code
} from "lucide-react";

interface Skill {
  name: string;
  level: "Expert" | "Advanced" | "Proficient";
  symbol: string;
}

interface SubGroup {
  title: string;
  description: string;
  skills: Skill[];
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  color: string; // cyan, purple, pink
  subGroups: SubGroup[];
}

// Brand SVG/Icon Helper
function SkillIcon({ name }: { name: string }) {
  const normalized = name.toLowerCase().trim();
  
  if (normalized.includes("python")) {
    return (
      <svg className="w-4 h-4 text-[#3776AB] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.25.18c.9 0 1.66.73 1.66 1.65v2.77h-3.32c-2.29 0-4.15 1.86-4.15 4.15v1.38H5.06c-.92 0-1.66-.74-1.66-1.66V5.72C3.4 3.43 5.26 1.57 7.55 1.57h6.7zm-4.7 2.22a.97.97 0 1 0 0-1.94.97.97 0 0 0 0 1.94zm.2 21.42c-.9 0-1.66-.73-1.66-1.65v-2.77h3.32c2.29 0 4.15-1.86 4.15-4.15v-1.38h3.38c.92 0 1.66.74 1.66 1.66v2.76c0 2.29-1.86 4.15-4.15 4.15H9.75zm4.7-2.22a.97.97 0 1 0 0 1.94.97.97 0 0 0 0-1.94z" />
      </svg>
    );
  }
  if (normalized.includes("react")) {
    return (
      <svg className="w-4 h-4 text-[#61DAFB] shrink-0 animate-[spin_10s_linear_infinite]" viewBox="-11.5 -10.2 23 20.5" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
        <g stroke="currentColor">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
    );
  }
  if (normalized.includes("next.js")) {
    return (
      <svg className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm5.13 18.26l-6.3-8.23H9.3v6.79H7.93v-9h1.9l5.96 7.82V7.82h1.34v10.44z" />
      </svg>
    );
  }
  if (normalized.includes("typescript")) {
    return (
      <svg className="w-4 h-4 text-[#3178C6] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 0H0v24h24V0zM21.6 19.3c0-2.3-1.4-3.4-4-4.5-1.6-.6-2.2-1.1-2.2-1.9 0-.8.7-1.4 1.8-1.4 1.2 0 1.8.5 2.2 1.3l2.5-1.5c-.7-1.6-2.3-2.6-4.7-2.6-2.9 0-4.9 1.6-4.9 4.2 0 2.5 1.5 3.6 4.3 4.7 1.8.7 2.1 1.2 2.1 2 0 .9-.8 1.5-2.1 1.5-1.5 0-2.4-.7-2.9-2l-2.5 1.5c.9 1.8 2.7 3.1 5.4 3.1 3.2 0 5-.6 5-4.4zm-11.5.2V9.5H13V7.2H5v2.3h2.8v10.1h2.3z" />
      </svg>
    );
  }
  if (normalized.includes("javascript")) {
    return (
      <svg className="w-4 h-4 text-[#F7DF1E] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 0H0v24h24V0zm-2.4 18.6c0-2.1-1.3-3.1-3.6-4.1-1.4-.6-2-1-2-1.7 0-.8.6-1.2 1.6-1.2 1.1 0 1.7.4 2 1.2l2.3-1.3c-.7-1.5-2.1-2.4-4.3-2.4-2.6 0-4.4 1.5-4.4 3.8 0 2.2 1.4 3.2 3.9 4.3 1.6.6 1.9 1.1 1.9 1.8 0 .8-.8 1.4-1.9 1.4-1.4 0-2.2-.7-2.7-1.8l-2.3 1.4c.8 1.6 2.5 2.8 4.9 2.8 2.9 0 4.6-1.6 4.6-4z" />
      </svg>
    );
  }
  if (normalized.includes("docker")) {
    return (
      <svg className="w-4 h-4 text-[#2496ED] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.983 11.078h2.119c.102 0 .186-.083.186-.185V8.99c0-.102-.084-.186-.186-.186h-2.119c-.103 0-.186.084-.186.186v1.903c0 .102.083.185.186.185zM11.261 11.078h2.119c.102 0 .185-.083.185-.185V8.99c0-.102-.083-.186-.185-.186h-2.119c-.102 0-.185.084-.185.186v1.903c0 .102.083.185.185.185zm-2.72 0h2.119c.102 0 .185-.083.185-.185V8.99c0-.102-.083-.186-.185-.186H8.54c-.102 0-.185.084-.185.186v1.903c0 .102.083.185.185.185zm-2.72 0h2.119c.102 0 .186-.083.186-.185V8.99c0-.102-.084-.186-.186-.186h-2.119c-.101 0-.185.084-.185.186v1.903c0 .102.084.185.185.185zm2.72-2.72h2.119c.102 0 .185-.083.185-.186V6.27c0-.102-.083-.186-.185-.186h-2.119c-.102 0-.185.084-.185.186v1.902c0 .103.083.186.185.186zm2.72 0h2.119c.102 0 .185-.083.185-.186V6.27c0-.102-.083-.186-.185-.186h-2.119c-.102 0-.185.084-.185.186v1.902c0 .103.083.186.185.186zm2.72 0h2.119c.102 0 .186-.083.186-.186V6.27c0-.102-.084-.186-.186-.186h-2.119c-.103 0-.186.084-.186.186v1.902c0 .103.083.186.186.186zm2.72-2.72h2.119c.102 0 .186-.083.186-.186V3.547c0-.101-.084-.185-.186-.185h-2.119c-.103 0-.186.084-.186.185v1.902c0 .103.083.186.186.186zm-10.88 5.44h2.119c.102 0 .185-.083.185-.185v-1.9c0-.103-.083-.186-.185-.186H5.82c-.102 0-.186.083-.186.186v1.9c0 .102.084.185.186.185zm-2.72 0h2.119c.101 0 .185-.083.185-.185v-1.9c0-.103-.084-.186-.185-.186H3.1c-.102 0-.186.083-.186.186v1.9c0 .102.084.185.186.185zm-2.72 0h2.119c.102 0 .185-.083.185-.185v-1.9c0-.103-.083-.186-.185-.186H.38c-.102 0-.186.083-.186.186v1.9c0 .102.084.185.186.185zm.186 2.72a.186.186 0 00-.186.186c0 2.49 1.03 4.8 2.85 6.14 2.26 1.67 5.77 1.91 8.62 1.07 4.29-1.27 7.26-5.18 7.26-9.65 0-.25-.01-.49-.04-.74-.12-.87-.69-1.56-1.5-1.85-.85-.31-1.8.02-2.31.78-.47.7-.68 1.48-.68 2.29 0 .18-.01.35-.04.53-.12.83-.81 1.45-1.65 1.45H1.966z" />
      </svg>
    );
  }
  if (normalized.includes("supabase")) {
    return (
      <svg className="w-4 h-4 text-[#3ECF8E] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.4 9.4H12V1.8a.9.9 0 0 0-1.6-.7L1.8 9.7a.9.9 0 0 0 .6 1.6H12v7.6a.9.9 0 0 0 1.6.7l8.6-8.6a.9.9 0 0 0-.8-1.6z" />
      </svg>
    );
  }
  if (normalized.includes("vercel")) {
    return (
      <svg className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 22.5H0L12 1.5l12 21z" />
      </svg>
    );
  }
  if (normalized.includes("hugging face")) {
    return (
      <svg className="w-4 h-4 text-[#FFD21E] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm3.5 6.5a1.5 1.5 0 1 1-1.5 1.5 1.5 1.5 0 0 1 1.5-1.5zm-7 0a1.5 1.5 0 1 1-1.5 1.5 1.5 1.5 0 0 1 1.5-1.5zm3.5 9.5a5.93 5.93 0 0 1-5-2.5h10a5.93 5.93 0 0 1-5 2.5z" />
      </svg>
    );
  }
  if (normalized.includes("pytorch")) {
    return (
      <svg className="w-4 h-4 text-[#EE4C2C] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 14H11v-5h2zm0-7H11V7h2z" opacity="0.3"/>
        <path d="M17.6 13c-.3 0-.6-.1-.8-.3l-3.3-3.3c-.4-.4-1.1-.4-1.5 0L8.7 12.7c-.4.4-1.1.4-1.5 0l-.7-.7c-.4-.4-.4-1.1 0-1.5l4-4c.8-.8 2.2-.8 3 0l4.1 4c.4.4.4 1.1 0 1.5l-1.2 1c-.2.2-.5.3-.8.3zM8.5 17c.8 0 1.5-.7 1.5-1.5S9.3 14 8.5 14 7 14.7 7 15.5 7.7 17 8.5 17zm7 0c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5z"/>
      </svg>
    );
  }
  if (normalized.includes("git & github") || normalized.includes("github actions")) {
    return (
      <svg className="w-4 h-4 text-[#F05032] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.3 11.2L12.8.7c-.9-.9-2.5-.9-3.4 0L7.9 2.2c-.4.4-.3 1 .1 1.3l2.8 2.1c-.2.5-.5.9-.9 1.1l-2-.5a1 1 0 0 0-1 .4l-1.6 1.6c-.3.3-.3.9 0 1.2l3.4 3.4c.3.3.8.3 1.1 0l1.6-1.6c.3-.3.3-.8.1-1.1l-1-.9c.4-.2.8-.5 1-.9l2.8 2.1c.3.3.9.2 1.2-.1l1.5-1.5c1-1 1-2.5 0-3.5zM9 16c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm5.5-5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
      </svg>
    );
  }
  if (normalized.includes("fastapi")) {
    return (
      <svg className="w-4 h-4 text-[#05998B] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L1.75 6v12L12 24l10.25-6V6L12 0zm-1.5 17.5v-4.5H7.75l5.75-8.5v4.5h2.75l-5.75 8.5z" />
      </svg>
    );
  }
  if (normalized.includes("mongodb")) {
    return (
      <svg className="w-4 h-4 text-[#47A248] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.15 11.23c-.23-1.85-1.2-3.83-2.65-5.58C13.2 4.1 12.03 2.95 12 2c-.03.95-1.2 2.1-2.5 3.65-1.45 1.75-2.42 3.73-2.65 5.58-.33 2.62.43 5.06 2.1 6.8 1.63 1.7 3.72 2.25 4.8 2.3v.83c0 .24.2.44.44.44.25 0 .45-.2.45-.44v-.84c1.08-.04 3.17-.6 4.8-2.3 1.67-1.74 2.43-4.18 2.1-6.8zM12 17.85c-.93-.16-2.52-.86-3.48-2.67 1.05.62 2.3.92 3.48.97v1.7z" />
      </svg>
    );
  }
  if (normalized.includes("c++")) {
    return (
      <svg className="w-4 h-4 text-[#00599C] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.06 11h-2.07V8.94h-1.95V11h-2.06v1.94h2.06v2.06h1.95v-2.06h2.07V11zm-8.89 8.21c-4.48 0-8.12-3.64-8.12-8.21s3.64-8.21 8.12-8.21c2.19 0 4.18.88 5.66 2.3l1.83-1.83A10.74 10.74 0 0 0 13.17.65C7.17.65 2.3 5.52 2.3 11.52s4.87 10.87 10.87 10.87c2.81 0 5.38-1.07 7.33-2.82l-1.84-1.84c-1.45 1.34-3.37 2.12-5.49 2.12z" />
      </svg>
    );
  }
  if (normalized.includes("power bi")) {
    return (
      <svg className="w-4 h-4 text-[#F2C811] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.5 0h3v24h-3zm6 6h3v18h-3zm-12 11h3v7h-3z" />
      </svg>
    );
  }
  if (normalized.includes("google analytics")) {
    return (
      <svg className="w-4 h-4 text-[#E37400] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-5h2v5zm4 0h-2V9h2v8zm4 0h-2v-3h2v3z"/>
      </svg>
    );
  }
  if (normalized.includes("postgresql")) {
    return (
      <svg className="w-4 h-4 text-[#336791] shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.1 12.3c-.3.7-.8 1.2-1.5 1.5l-.8-.8c.4-.2.8-.5 1-1l.7.3zm-.8-3c-.1.7-.5 1.3-1.1 1.6l-.7-.7c.3-.2.6-.5.7-1h1.1zm-4.7 6.4c-2.4 0-4.4-2-4.4-4.4s2-4.4 4.4-4.4 4.4 2 4.4 4.4-2 4.4-4.4 4.4z" />
      </svg>
    );
  }
  if (normalized.includes("vector db") || normalized.includes("vector database")) {
    return (
      <svg className="w-4 h-4 text-[#00F0FF] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    );
  }
  
  // Custom Lucide fallbacks with category coloring
  if (normalized.includes("langchain") || normalized.includes("agent")) {
    return <Network className="w-4 h-4 text-neon-cyan shrink-0" />;
  }
  if (normalized.includes("rag") || normalized.includes("search")) {
    return <Search className="w-4 h-4 text-neon-cyan shrink-0" />;
  }
  if (normalized.includes("prompt") || normalized.includes("llm") || normalized.includes("nlp")) {
    return <MessageSquare className="w-4 h-4 text-neon-cyan shrink-0" />;
  }
  if (normalized.includes("learning") || normalized.includes("neural") || normalized.includes("tensorflow")) {
    return <Cpu className="w-4 h-4 text-neon-cyan shrink-0" />;
  }
  if (normalized.includes("vision")) {
    return <Eye className="w-4 h-4 text-neon-cyan shrink-0" />;
  }
  if (normalized.includes("tailwind")) {
    return <Layers className="w-4 h-4 text-neon-purple shrink-0" />;
  }
  if (normalized.includes("node.js") || normalized.includes("express.js")) {
    return <Server className="w-4 h-4 text-neon-purple shrink-0" />;
  }
  if (normalized.includes("data structures") || normalized.includes("algorithms")) {
    return <Binary className="w-4 h-4 text-neon-pink shrink-0" />;
  }
  if (normalized.includes("sql") || normalized.includes("database")) {
    return <Database className="w-4 h-4 text-neon-pink shrink-0" />;
  }
  if (normalized.includes("gcp") || normalized.includes("google cloud") || normalized.includes("oracle") || normalized.includes("cloud")) {
    return <Cloud className="w-4 h-4 text-neon-cyan shrink-0" />;
  }
  if (normalized.includes("postman")) {
    return <Play className="w-4 h-4 text-neon-cyan shrink-0" />;
  }
  if (normalized.includes("vs code")) {
    return <Laptop className="w-4 h-4 text-neon-cyan shrink-0" />;
  }
  if (normalized.includes("pandas") || normalized.includes("matplotlib") || normalized.includes("scikit")) {
    return <BarChart3 className="w-4 h-4 text-neon-pink shrink-0" />;
  }

  return <Code className="w-4 h-4 text-neutral-400 shrink-0" />;
}

// 3-Bar proficiency level visualizer
const LevelIndicator = ({ level, color }: { level: "Expert" | "Advanced" | "Proficient"; color: string }) => {
  const barsCount = level === "Expert" ? 3 : level === "Advanced" ? 2 : 1;
  const activeBgClass = 
    color === "neon-cyan" 
      ? "bg-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.6)]" 
      : color === "neon-purple"
      ? "bg-neon-purple shadow-[0_0_8px_rgba(189,0,255,0.6)]"
      : "bg-neon-pink shadow-[0_0_8px_rgba(255,0,122,0.6)]";

  return (
    <div className="flex gap-1 items-center select-none" aria-label={`Proficiency level: ${level}`}>
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-3 rounded-[2px] transition-all duration-300 ${
            i < barsCount ? activeBgClass : "bg-neutral-200 dark:bg-neutral-800"
          }`}
        />
      ))}
      <span className="text-[8px] font-mono text-neutral-500 ml-1.5 hidden sm:inline uppercase tracking-wider font-bold">
        {level}
      </span>
    </div>
  );
};

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "AI & Machine Learning",
    icon: <BrainCircuit className="w-5 h-5 text-neon-cyan" />,
    color: "neon-cyan",
    subGroups: [
      {
        title: "Generative AI & Agents",
        description: "Orchestrating stateful graphs, multi-agent frameworks, and vector search indices.",
        skills: [
          { name: "LangChain & LangGraph", level: "Expert", symbol: "🦜" },
          { name: "Agentic AI Workflows", level: "Expert", symbol: "🤖" },
          { name: "RAG Systems", level: "Expert", symbol: "🔍" },
          { name: "LLMs / Prompt Eng.", level: "Expert", symbol: "✍️" }
        ]
      },
      {
        title: "ML Frameworks & Libraries",
        description: "Building neural networks, modeling parameters, and writing prediction logic.",
        skills: [
          { name: "Python", level: "Expert", symbol: "🐍" },
          { name: "PyTorch", level: "Advanced", symbol: "🔥" },
          { name: "TensorFlow", level: "Advanced", symbol: "🧠" },
          { name: "Scikit-Learn", level: "Expert", symbol: "📊" },
          { name: "Hugging Face", level: "Advanced", symbol: "🤗" }
        ]
      },
      {
        title: "Vision & Natural Language",
        description: "Fine-tuning transformer models, tokenizing transcripts, and hand landmarks extraction.",
        skills: [
          { name: "Deep Learning", level: "Advanced", symbol: "🕸️" },
          { name: "Computer Vision", level: "Advanced", symbol: "👁️" },
          { name: "NLP / Semantic Web", level: "Advanced", symbol: "🗣️" }
        ]
      }
    ]
  },
  {
    title: "Web Development",
    icon: <Globe className="w-5 h-5 text-neon-purple" />,
    color: "neon-purple",
    subGroups: [
      {
        title: "Frontend Engineering",
        description: "Designing responsive user interfaces with premium interactive details.",
        skills: [
          { name: "React", level: "Expert", symbol: "⚛️" },
          { name: "Next.js 15", level: "Expert", symbol: "▲" },
          { name: "Tailwind CSS", level: "Expert", symbol: "🎨" }
        ]
      },
      {
        title: "Backend & Web APIs",
        description: "Developing high-performance microservices, REST endpoints, and WebSocket relays.",
        skills: [
          { name: "FastAPI", level: "Expert", symbol: "⚡" },
          { name: "Node.js", level: "Advanced", symbol: "🟢" },
          { name: "Express.js", level: "Advanced", symbol: "🚂" }
        ]
      },
      {
        title: "Languages",
        description: "Writing functional routines, strongly-typed variables, and asynchronous components.",
        skills: [
          { name: "TypeScript", level: "Advanced", symbol: "📘" },
          { name: "JavaScript", level: "Expert", symbol: "💛" }
        ]
      }
    ]
  },
  {
    title: "Data & DSA",
    icon: <Database className="w-5 h-5 text-neon-pink" />,
    color: "neon-pink",
    subGroups: [
      {
        title: "Core Data Structures & Algorithms",
        description: "Solving computational problems with optimal space and time complexities.",
        skills: [
          { name: "C++", level: "Expert", symbol: "💻" },
          { name: "Data Structures", level: "Expert", symbol: "☱" },
          { name: "Algorithms", level: "Expert", symbol: "🧮" }
        ]
      },
      {
        title: "Data Engineering & Analysis",
        description: "Querying structured tables, building visualizations, and charting visitor metrics.",
        skills: [
          { name: "SQL", level: "Advanced", symbol: "🗄️" },
          { name: "Pandas & NumPy", level: "Expert", symbol: "🐼" },
          { name: "Matplotlib & Seaborn", level: "Proficient", symbol: "📈" },
          { name: "Power BI", level: "Advanced", symbol: "📊" },
          { name: "Google Analytics", level: "Advanced", symbol: "📈" }
        ]
      }
    ]
  },
  {
    title: "Cloud & Tools",
    icon: <Terminal className="w-5 h-5 text-neon-cyan" />,
    color: "neon-cyan",
    subGroups: [
      {
        title: "DevOps & Deployment",
        description: "Configuring compute nodes, docker containers, CI/CD, and serverless hosting.",
        skills: [
          { name: "Google Cloud (GCP)", level: "Advanced", symbol: "☁️" },
          { name: "Oracle Cloud (OCI)", level: "Advanced", symbol: "🔴" },
          { name: "Docker", level: "Proficient", symbol: "🐳" },
          { name: "Git & GitHub", level: "Expert", symbol: "🐙" },
          { name: "Vercel", level: "Expert", symbol: "▲" },
          { name: "GitHub Actions", level: "Advanced", symbol: "⚡" }
        ]
      },
      {
        title: "Databases & Analytics Services",
        description: "Setting up database tables, authorization parameters, and analytics integrations.",
        skills: [
          { name: "Supabase & Firebase", level: "Expert", symbol: "🔥" },
          { name: "PostgreSQL", level: "Advanced", symbol: "🐘" },
          { name: "MongoDB", level: "Advanced", symbol: "🍃" },
          { name: "Vector DB (Chroma/pgvector)", level: "Advanced", symbol: "🗄️" }
        ]
      },
      {
        title: "Development Environments",
        description: "Debugging API routes, testing calls, and customizing workspace tools.",
        skills: [
          { name: "Postman", level: "Expert", symbol: "🚀" },
          { name: "VS Code", level: "Expert", symbol: "📝" }
        ]
      }
    ]
  }
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section
      id="skills"
      className="relative py-24 px-6 overflow-hidden bg-transparent"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial-glow opacity-20 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-3 font-bold"
          >
            // COMPUTATIONAL ENGINE
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Core Technical <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">Capabilities</span>
          </motion.h3>
          <div className="w-16 h-[2px] bg-neon-purple/40 mt-4 rounded-full" />
        </div>

        {/* Categories Tab selectors */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16 select-none">
          {SKILL_CATEGORIES.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer focus:outline-none uppercase ${
                activeCategory === index
                  ? "bg-neon-cyan/15 border-neon-cyan text-neon-cyan font-bold shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                  : "bg-glass-bg border-glass-border text-neutral-400 hover:text-foreground hover:border-neon-cyan/20"
              }`}
            >
              {category.icon}
              <span>{category.title}</span>
            </button>
          ))}
        </div>

        {/* Skills Sub-Groups Layout */}
        <div className="relative min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
            >
              {SKILL_CATEGORIES[activeCategory].subGroups.map((group, groupIdx) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: groupIdx * 0.05 }}
                  className="glassmorphism p-6 rounded-2xl flex flex-col justify-between hover:border-neon-cyan/25 hover:bg-glass-bg/40 transition-all duration-300 relative group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-radial-glow opacity-[0.08] pointer-events-none" />
                  
                  <div className="mb-6">
                    {/* Group Header */}
                    <div className="flex items-center gap-2 mb-3 select-none">
                      <span className={`w-1.5 h-1.5 rounded-full bg-neon-${SKILL_CATEGORIES[activeCategory].color === "neon-cyan" ? "cyan" : SKILL_CATEGORIES[activeCategory].color === "neon-purple" ? "purple" : "pink"} animate-pulse`} />
                      <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">
                        {group.title}
                      </h4>
                    </div>

                    <p className="text-xs text-neutral-400 dark:text-neutral-500 font-light leading-relaxed font-sans">
                      {group.description}
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div className="space-y-2.5 mt-auto">
                    {group.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-glass-border bg-glass-bg/30 hover:bg-glass-bg hover:border-neutral-300/40 dark:hover:border-neutral-600/40 transition-all duration-300 group/chip"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900/60 flex items-center justify-center border border-glass-border group-hover/chip:border-neon-cyan/20 transition-all shrink-0">
                            <SkillIcon name={skill.name} />
                          </div>
                          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 font-sans tracking-wide">
                            {skill.name}
                          </span>
                        </div>
                        <LevelIndicator 
                          level={skill.level} 
                          color={SKILL_CATEGORIES[activeCategory].color} 
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Graphic Footer */}
        <div className="mt-16 flex items-center justify-center gap-1.5 select-none">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
          <div className="w-12 h-[1px] bg-glass-border" />
          <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            System capabilities loaded successfully
          </div>
          <div className="w-12 h-[1px] bg-glass-border" />
          <div className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
        </div>

      </div>
    </section>
  );
}
