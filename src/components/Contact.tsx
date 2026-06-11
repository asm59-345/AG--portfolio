"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import { Github, Linkedin } from "@/components/SocialIcons";
import confetti from "canvas-confetti";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    if (!form.name.trim()) tempErrors.name = "Name is required";
    
    if (!form.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = "Email is invalid";
    }
    
    if (!form.message.trim()) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setSubmitted(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#00f0ff", "#bd00ff", "#ffffff"]
        });

        // Log click telemetry
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: window.location.pathname, event: "CLICK", target: "contact-submit" })
        }).catch(console.warn);

        setTimeout(() => {
          setForm({ name: "", email: "", message: "" });
          setSubmitted(false);
        }, 4000);
      } else {
        alert(resData.error || "Failed to process transmission. Please try again.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("System connection offline. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 px-6 overflow-hidden bg-transparent"
    >
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-radial-glow opacity-30 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-3"
          >
            // TELEMETRY GATEWAY
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Initiate <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Transmission</span>
          </motion.h3>
          <div className="w-16 h-[2px] bg-neon-cyan/40 mt-4 rounded-full" />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto">
          
          {/* Left panel: Info cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-foreground uppercase tracking-wider font-mono">
                Get in Touch
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Have an interesting multi-agent project, a complex retrieval dataset pipeline, or a full-stack website requirement? Drop me a line, and let's configure solutions.
              </p>
            </div>

            {/* Coordinates and Social blocks */}
            <div className="space-y-4 my-8">
              
              {/* Email */}
              <a
                href="mailto:gautamashmit1485@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl border border-glass-border bg-glass-bg hover:border-neon-cyan/30 hover:bg-neon-cyan/[0.01] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-background border border-glass-border flex items-center justify-center text-neutral-400 group-hover:text-neon-cyan group-hover:border-neon-cyan/30 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Email Address</div>
                  <div className="text-xs font-mono text-neutral-400 group-hover:text-foreground transition-colors">gautamashmit1485@gmail.com</div>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+918810954933"
                className="flex items-center gap-4 p-4 rounded-xl border border-glass-border bg-glass-bg hover:border-neon-purple/30 hover:bg-neon-purple/[0.01] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-background border border-glass-border flex items-center justify-center text-neutral-400 group-hover:text-neon-purple group-hover:border-neon-purple/30 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Mobile Number</div>
                  <div className="text-xs font-mono text-neutral-400 group-hover:text-foreground transition-colors">+91 8810954933</div>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-glass-border bg-glass-bg group">
                <div className="w-9 h-9 rounded-lg bg-background border border-glass-border flex items-center justify-center text-neutral-400 group-hover:text-neon-cyan transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Base Operations</div>
                  <div className="text-xs font-mono text-neutral-400">Lucknow, Uttar Pradesh, India</div>
                </div>
              </div>

            </div>

            {/* Direct profile icons links */}
            <div className="flex items-center gap-4 border-t border-glass-border pt-6 select-none">
              <a
                href="https://github.com/asm59-345"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border border-glass-border bg-glass-bg hover:bg-neon-cyan/10 hover:border-neon-cyan/30 text-neutral-400 hover:text-neon-cyan transition-all"
              >
                <Github className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/ashmit-gautam-asar"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border border-glass-border bg-glass-bg hover:bg-neon-purple/10 hover:border-neon-purple/30 text-neutral-400 hover:text-neon-purple transition-all"
              >
                <Linkedin className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Right panel: Glass form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glassmorphism p-6 sm:p-8 rounded-2xl h-full flex flex-col justify-between"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="form-name" className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    Name
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="Enter your name"
                    className="w-full text-xs text-foreground placeholder-neutral-500 bg-background border border-glass-border hover:border-glass-border/80 focus:border-neon-cyan/40 rounded-xl px-4 py-3 outline-none transition-colors"
                  />
                  {errors.name && (
                    <span className="text-[10px] font-mono text-neon-pink mt-1 block">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="form-email" className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="name@example.com"
                    className="w-full text-xs text-foreground placeholder-neutral-500 bg-background border border-glass-border hover:border-glass-border/80 focus:border-neon-cyan/40 rounded-xl px-4 py-3 outline-none transition-colors"
                  />
                  {errors.email && (
                    <span className="text-[10px] font-mono text-neon-pink mt-1 block">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="form-message" className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    Message
                  </label>
                  <textarea
                    id="form-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    placeholder="How can I help you?"
                    className="w-full text-xs text-foreground placeholder-neutral-500 bg-background border border-glass-border hover:border-glass-border/80 focus:border-neon-cyan/40 rounded-xl px-4 py-3 outline-none transition-colors resize-none"
                  />
                  {errors.message && (
                    <span className="text-[10px] font-mono text-neon-pink mt-1 block">
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Action CTA */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || submitted}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold tracking-widest uppercase cursor-pointer select-none focus:outline-none transition-all duration-300 ${
                      submitted
                        ? "bg-green-500/10 border border-green-500/40 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                        : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white hover:shadow-lg dark:bg-neon-cyan/10 dark:hover:bg-neon-cyan/20 dark:border dark:border-neon-cyan/20 dark:text-neon-cyan dark:hover:shadow-[0_0_15px_rgba(0,240,255,0.05)] disabled:opacity-40"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" /> Synchronizing...
                      </span>
                    ) : submitted ? (
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Message Synced
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5" /> Transmit Message
                      </span>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
