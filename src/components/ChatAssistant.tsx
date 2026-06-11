"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { text: "Who is Ashmit?", keywords: ["who", "ashmit", "about"] },
  { text: "Core technical skills?", keywords: ["skills", "languages"] },
  { text: "Describe SarkarAI", keywords: ["sarkarai", "sarkar"] },
  { text: "Internship background?", keywords: ["internship", "experience"] },
];

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hi! I'm Ashmit's Gemini Copilot. Ask me anything about his technical projects, certifications, internships, or open source connect journey! 🚀",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Stream user query and chat history to dynamic API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.text || "I apologize, my neural connections are currently offline. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.warn("Dynamic chat failed, using local fallback responder:", err);
      // Local keyword checker fallback
      const fallbackText = getLocalFallback(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: fallbackText,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const getLocalFallback = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("who") || q.includes("about") || q.includes("bio") || q.includes("ashmit")) {
      return "Ashmit Gautam is a B.Tech CSE (AI & ML) student at AKTU (2023-2027) based in Lucknow. He is a Generative AI Builder, AI/ML Engineer, and Full Stack Developer. Key highlights: 12+ projects, 2 internships, and 8+ hackathons! 🚀";
    }
    if (q.includes("skill") || q.includes("tech") || q.includes("languages")) {
      return "Ashmit's skills include:\n\n• AI/ML: Python, PyTorch, TensorFlow, LangChain, RAG, Agentic AI, NLP, Computer Vision\n• Web Dev: React, Next.js, TypeScript, Tailwind CSS, FastAPI, Node.js\n• Data/DSA: C++, SQL, Pandas, NumPy, Data Structures & Algorithms\n• Cloud: Docker, Google Cloud (GCP), Oracle Cloud (OCI), Supabase";
    }
    if (q.includes("sarkarai") || q.includes("sarkar") || q.includes("government")) {
      return "SarkarAI is Ashmit's featured citizen assistant. It helps users discover government schemes, eligibility status, required documents, and routing grievance support using RAG and Agentic AI workflows. Built with Next.js, FastAPI, LangChain, and Gemini API!";
    }
    return "I'm Ashmit's AI assistant. I can help you with questions about his projects (like SarkarAI), internships, certifications, and programming skills! Feel free to ask.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[calc(100vw-3rem)] sm:w-[380px] h-[480px] bg-background/95 border border-glass-border rounded-2xl flex flex-col shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden mb-4 backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border bg-glass-bg select-none">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-neon-cyan/10 border border-neon-cyan/40 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-neon-cyan" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-glass-border animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-foreground">
                    ASHMIT AI
                  </h3>
                  <span className="text-[9px] font-mono text-neutral-500">
                    Grounded Recruiter Copilot
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-foreground hover:bg-glass-border transition-colors focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-grid-pattern bg-[size:30px_30px] bg-opacity-[0.03]"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] ${
                    msg.sender === "user" 
                      ? "bg-neon-purple/20 border border-neon-purple/40 text-neon-purple" 
                      : "bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan"
                  }`}>
                    {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-neon-purple/10 border border-neon-purple/20 text-foreground rounded-tr-none"
                      : "bg-glass-bg border border-glass-border text-foreground rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-neon-cyan/10 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-glass-bg border border-glass-border rounded-2xl rounded-tl-none px-4 py-3 text-xs text-neutral-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-glass-border bg-glass-bg flex flex-wrap gap-1.5 select-none">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt.text)}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-glass-border bg-glass-bg hover:bg-neon-cyan/5 hover:border-neon-cyan/30 text-neutral-500 hover:text-neon-cyan transition-all cursor-pointer focus:outline-none"
                >
                  {prompt.text}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-background border-t border-glass-border flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Ashmit AI..."
                className="flex-1 text-xs text-foreground placeholder-neutral-500 bg-glass-bg border border-glass-border hover:border-glass-border/80 focus:border-neon-cyan/40 rounded-xl px-3 py-2 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/20 disabled:opacity-40 disabled:pointer-events-none text-neon-cyan cursor-pointer transition-colors focus:outline-none"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-neon-purple via-[#6b0df2] to-neon-cyan text-white shadow-[0_4px_20px_rgba(189,0,255,0.4)] flex items-center justify-center cursor-pointer border border-glass-border focus:outline-none select-none relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-neon-cyan border border-background animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
