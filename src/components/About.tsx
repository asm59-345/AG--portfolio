"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Cpu, Code, Brain, Trophy } from "lucide-react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: 15, suffix: "+", label: "Projects Built" },
  { value: 2, suffix: "+", label: "Internships Completed" },
  { value: 8, suffix: "+", label: "Hackathons Attended" },
  { value: 20, suffix: "+", label: "Certifications Earned" }
];

export default function About() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative py-24 px-6 overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono tracking-widest text-neon-cyan uppercase mb-3"
          >
            // IDENTITY PROFILE
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase"
          >
            Passionate About Turning <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">Data Into Intelligence</span>
          </motion.h3>
          <div className="w-16 h-[2px] bg-neon-cyan/40 mt-4 rounded-full" />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Narrative bio */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0 }
              }}
              initial="hidden"
              animate={controls}
              transition={{ duration: 0.5 }}
              className="glassmorphism rounded-2xl p-6 sm:p-8 space-y-6 animate-float"
            >
              <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Brain className="w-5 h-5 text-neon-cyan" />
                B.Tech CSE (AI & ML) Student
              </h4>
              <p className="text-sm text-neutral-400 leading-relaxed font-light">
                Currently pursuing my Bachelor of Technology degree in Computer Science Engineering, specializing in **Artificial Intelligence & Machine Learning** (2023–2027) at Dr. A.P.J. Abdul Kalam Technical University.
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed font-light">
                I specialize in building intelligent applications ranging from high-accuracy **RAG (Retrieval Augmented Generation) chatbots** and **Agentic AI workflows** to production-grade computer vision models and NLP sentiment tools.
              </p>
              <p className="text-sm text-neutral-400 leading-relaxed font-light">
                Driven by curiosity, I combine advanced ML model structures with modern full-stack development. I enjoy writing performant backend code, setting up complex vector pipelines, and compiling elegant user layouts.
              </p>
            </motion.div>
          </div>

          {/* Pillars Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              initial="hidden"
              animate={controls}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glassmorphism p-5 rounded-xl hover:border-neon-cyan/20 hover:bg-neon-cyan/[0.02] transition-all group interactive-card"
            >
              <Cpu className="w-6 h-6 text-neon-cyan mb-3 group-hover:scale-110 transition-transform" />
              <h5 className="text-sm font-semibold text-foreground mb-1.5 uppercase font-mono tracking-wider">AI/ML Core</h5>
              <p className="text-xs text-neutral-400 leading-relaxed">Designing neural nets, vector databases, and deep learning pipelines in PyTorch & TensorFlow.</p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              initial="hidden"
              animate={controls}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="glassmorphism p-5 rounded-xl hover:border-neon-purple/20 hover:bg-neon-purple/[0.02] transition-all group interactive-card"
            >
              <Code className="w-6 h-6 text-neon-purple mb-3 group-hover:scale-110 transition-transform" />
              <h5 className="text-sm font-semibold text-foreground mb-1.5 uppercase font-mono tracking-wider">Full Stack</h5>
              <p className="text-xs text-neutral-400 leading-relaxed">Building fast responsive client apps in Next.js/React and high-throughput APIs in FastAPI.</p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              initial="hidden"
              animate={controls}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="glassmorphism p-5 rounded-xl hover:border-neon-pink/20 hover:bg-neon-pink/[0.02] transition-all group interactive-card"
            >
              <Brain className="w-6 h-6 text-neon-pink mb-3 group-hover:scale-110 transition-transform" />
              <h5 className="text-sm font-semibold text-foreground mb-1.5 uppercase font-mono tracking-wider">Generative AI</h5>
              <p className="text-xs text-neutral-400 leading-relaxed">Orchestrating agent frameworks, RAG workflows, LangChain, and advanced LLM systems.</p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              initial="hidden"
              animate={controls}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="glassmorphism p-5 rounded-xl hover:border-neon-cyan/20 hover:bg-neon-cyan/[0.02] transition-all group interactive-card"
            >
              <Trophy className="w-6 h-6 text-neon-cyan mb-3 group-hover:scale-110 transition-transform" />
              <h5 className="text-sm font-semibold text-foreground mb-1.5 uppercase font-mono tracking-wider">Problem Solver</h5>
              <p className="text-xs text-neutral-400 leading-relaxed">Leveraging data structures, algorithms, and SQL to optimize computational efficiency.</p>
            </motion.div>
          </div>
        </div>

        {/* Statistics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, index) => (
            <StatCounter
              key={index}
              stat={stat}
              index={index}
              isInView={isInView}
              controls={controls}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

// Inner helper component for counting up numbers when in view
function StatCounter({
  stat,
  index,
  isInView,
  controls
}: {
  stat: StatItem;
  index: number;
  isInView: boolean;
  controls: any;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = stat.value;
      if (start === end) return;

      const duration = 2000; // 2 seconds
      const incrementTime = Math.floor(duration / end);

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) {
          clearInterval(timer);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, stat.value]);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      initial="hidden"
      animate={controls}
      transition={{ delay: 0.1 * index + 0.5, duration: 0.5 }}
      className="glassmorphism rounded-2xl p-6 text-center hover:border-neon-cyan/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.05)] transition-all flex flex-col justify-center select-none"
    >
      <div className="text-3xl sm:text-5xl font-extrabold font-mono text-foreground mb-1">
        <span className="bg-gradient-to-r from-white via-neon-cyan to-neon-purple bg-clip-text text-transparent">
          {count}
        </span>
        <span className="text-neon-cyan text-glow-cyan">{stat.suffix}</span>
      </div>
      <div className="text-[10px] sm:text-xs font-mono text-neutral-500 uppercase tracking-widest mt-1">
        {stat.label}
      </div>
    </motion.div>
  );
}
