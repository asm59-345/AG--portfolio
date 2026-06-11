"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Compass, FileText, Share2, CornerDownLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandItem {
  category: string;
  name: string;
  action: () => void;
  icon: React.ReactNode;
  shortcut?: string;
}

export default function CommandMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemsContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = (id: string) => {
    onClose();
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

  const openLink = (url: string) => {
    onClose();
    window.open(url, "_blank");
  };

  const commandList: CommandItem[] = [
    // Navigation
    { category: "Navigation", name: "Scroll to Home", action: () => scrollTo("home"), icon: <Compass className="w-4 h-4" /> },
    { category: "Navigation", name: "Scroll to About Me", action: () => scrollTo("about"), icon: <Compass className="w-4 h-4" /> },
    { category: "Navigation", name: "Scroll to Core Skills", action: () => scrollTo("skills"), icon: <Compass className="w-4 h-4" /> },
    { category: "Navigation", name: "Scroll to Projects", action: () => scrollTo("projects"), icon: <Compass className="w-4 h-4" /> },
    { category: "Navigation", name: "Scroll to Work Experience", action: () => scrollTo("experience"), icon: <Compass className="w-4 h-4" /> },
    { category: "Navigation", name: "Scroll to Education", action: () => scrollTo("education"), icon: <Compass className="w-4 h-4" /> },
    { category: "Navigation", name: "Scroll to Research & Papers", action: () => scrollTo("research"), icon: <Compass className="w-4 h-4" /> },
    { category: "Navigation", name: "Scroll to Certifications", action: () => scrollTo("certifications"), icon: <Compass className="w-4 h-4" /> },
    { category: "Navigation", name: "Scroll to Contact Form", action: () => scrollTo("contact"), icon: <Compass className="w-4 h-4" /> },

    // Files
    { category: "Resources", name: "Download Resume / CV (PDF)", action: () => openLink("/resume.pdf"), icon: <FileText className="w-4 h-4" />, shortcut: "DL" },

    // Social Links
    { category: "Social Connect", name: "Open LinkedIn Profile", action: () => openLink("https://www.linkedin.com/in/ashmit-gautam-asar"), icon: <Share2 className="w-4 h-4" /> },
    { category: "Social Connect", name: "Open GitHub Profile", action: () => openLink("https://github.com/asm59-345"), icon: <Share2 className="w-4 h-4" /> },
    { category: "Social Connect", name: "Send Direct Email", action: () => openLink("mailto:gautamashmit1485@gmail.com"), icon: <Share2 className="w-4 h-4" /> },
  ];

  // Filter commands
  const filteredList = commandList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Command keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle menu with Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }

      if (!isOpen) return;

      // Handle Arrow keys and Enter
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredList.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredList[selectedIndex]) {
          filteredList[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredList, onClose]);

  // Adjust scroll of container to keep active index in view
  useEffect(() => {
    if (itemsContainerRef.current) {
      const activeEl = itemsContainerRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        const container = itemsContainerRef.current;
        const activeTop = activeEl.offsetTop;
        const activeBottom = activeTop + activeEl.offsetHeight;
        const containerScrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;

        if (activeBottom > containerScrollTop + containerHeight) {
          container.scrollTop = activeBottom - containerHeight;
        } else if (activeTop < containerScrollTop) {
          container.scrollTop = activeTop;
        }
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 sm:px-6">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-neutral-950 border border-glass-border rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[420px]"
          >
            {/* Command search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-glass-border bg-neutral-900/40">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search..."
                className="w-full text-sm text-neutral-200 placeholder-neutral-500 bg-transparent outline-none focus:ring-0"
              />
              <button
                onClick={onClose}
                className="p-1 text-neutral-400 hover:text-foreground rounded hover:bg-glass-border focus:outline-none"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Command results list */}
            <div 
              ref={itemsContainerRef}
              className="flex-1 overflow-y-auto p-2 no-scrollbar"
            >
              {filteredList.length > 0 ? (
                (() => {
                  let lastCategory = "";
                  return filteredList.map((item, idx) => {
                    const showCategory = item.category !== lastCategory;
                    lastCategory = item.category;

                    return (
                      <div key={idx}>
                        {showCategory && (
                          <div className="px-3 py-1.5 text-[10px] font-mono font-semibold tracking-widest text-neon-cyan uppercase mt-2 first:mt-0">
                            {item.category}
                          </div>
                        )}
                        <button
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-medium cursor-pointer transition-colors focus:outline-none ${
                            idx === selectedIndex
                              ? "bg-neutral-800 text-foreground"
                              : "text-neutral-400 hover:bg-glass-border/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={idx === selectedIndex ? "text-neon-cyan" : "text-neutral-500"}>
                              {item.icon}
                            </span>
                            <span>{item.name}</span>
                          </div>

                          {/* Action indicator */}
                          <div className="flex items-center gap-1.5">
                            {item.shortcut && (
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-glass-border bg-neutral-900 text-neutral-500">
                                {item.shortcut}
                              </span>
                            )}
                            {idx === selectedIndex && (
                              <span className="flex items-center gap-0.5 font-mono text-[9px] text-neutral-400 bg-neutral-900 px-1 py-0.5 rounded">
                                <span>Enter</span>
                                <CornerDownLeft className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  });
                })()
              ) : (
                <div className="text-center py-8 text-xs text-neutral-500 font-mono">
                  No commands found matching "{search}"
                </div>
              )}
            </div>

            {/* Bottom guide info */}
            <div className="px-4 py-2 border-t border-glass-border bg-neutral-950 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>Enter Select</span>
              </div>
              <div>ESC Close</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
