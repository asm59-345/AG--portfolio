"use client";

import { useEffect, useState } from "react";
import { Menu, X, Search, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface NavItem {
  name: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Skills", id: "skills" },
  { name: "Projects", id: "projects" },
  { name: "Experience", id: "experience" },
  { name: "Education", id: "education" },
  { name: "Research", id: "research" },
  { name: "Certifications", id: "certifications" },
  { name: "Contact", id: "contact" }
];

export default function Navbar({ onSearchClick }: { onSearchClick: () => void }) {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Load and apply theme on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? resolvedTheme : "dark";

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Monitor scroll for nav styling, scroll progress, and active section
  useEffect(() => {
    const handleScroll = () => {
      // 1. Navbar shrink
      setScrolled(window.scrollY > 20);

      // 2. Scroll progress indicator
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // 3. Active Section tracker
      const scrollPosition = window.scrollY + 160; // offset for nav height
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for fixed nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? "py-3 bg-background/75 backdrop-blur-md border-b border-glass-border" 
            : "py-6 bg-transparent"
        }`}
      >
        {/* Scroll Progress Bar */}
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all duration-100 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <span className="text-xl font-bold tracking-widest text-foreground group-hover:text-neon-cyan transition-colors">
              ASHMIT<span className="text-neon-cyan">.</span>G
            </span>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`relative px-1 py-1.5 text-xs font-mono tracking-wider transition-colors cursor-pointer uppercase focus:outline-none ${
                  activeSection === item.id 
                    ? "text-neon-cyan text-glow-cyan" 
                    : "text-neutral-400 hover:text-foreground"
                }`}
              >
                {item.name}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-neon-cyan"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Search Shortcut & Theme Switcher & Mobile Trigger */}
          <div className="flex items-center gap-3">
            {/* Theme switcher toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-glass-border hover:border-neon-cyan/40 bg-glass-bg hover:bg-neon-cyan/5 text-neutral-400 hover:text-foreground transition-all duration-300 cursor-pointer focus:outline-none"
              title={currentTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {currentTheme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-neon-purple" />
              )}
            </button>

            {/* Command search button */}
            <button
              onClick={onSearchClick}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-glass-border hover:border-neon-cyan/40 bg-glass-bg hover:bg-neon-cyan/5 text-xs text-neutral-400 hover:text-foreground transition-all duration-300 cursor-pointer focus:outline-none"
              title="Open Command Menu (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono text-[10px] text-neutral-500">
                ⌘K
              </span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-neutral-400 hover:text-foreground hover:bg-glass-border rounded-md cursor-pointer focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[60px] z-30 bg-background/95 backdrop-blur-lg border-b border-glass-border py-6 px-6 lg:hidden flex flex-col gap-4 shadow-2xl"
          >
            {NAV_ITEMS.map((item, idx) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => scrollTo(item.id)}
                className={`py-2 text-left text-sm font-mono tracking-widest uppercase border-b border-glass-border last:border-0 cursor-pointer ${
                  activeSection === item.id 
                    ? "text-neon-cyan font-bold" 
                    : "text-neutral-400"
                }`}
              >
                {item.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
