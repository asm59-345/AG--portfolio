"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_STEPS = [
  "Initializing neural networks...",
  "Loading vector embeddings...",
  "Synthesizing knowledge graph...",
  "Aligning multi-agent swarm...",
  "Running inference pipeline...",
  "System fully operational."
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Increment progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Speed up at the beginning, slow down at the end
        const increment = prev < 30 ? 4 : prev < 70 ? 3 : prev < 90 ? 2 : 1;
        return Math.min(prev + increment, 100);
      });
    }, 30);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    // Map progress to steps
    const currentStep = Math.min(
      Math.floor((progress / 100) * LOADING_STEPS.length),
      LOADING_STEPS.length - 1
    );
    setStepIndex(currentStep);

    if (progress === 100) {
      const timeout = setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 800); // Allow fadeout to finish
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030303] select-none"
        >
          {/* Cyberpunk background grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial-glow opacity-50 blur-[80px]" />

          <div className="relative flex flex-col items-center max-w-md w-full px-8 text-center">
            {/* Logo/Icon animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-20 h-20 mb-8 flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border border-neon-cyan/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-neon-cyan/40 animate-spin" style={{ animationDuration: "10s" }} />
              <div className="absolute inset-4 rounded-full border border-neon-purple/40 animate-pulse" />
              
              {/* Inner glowing core */}
              <span className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                AG
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg tracking-[0.2em] font-medium text-white mb-2 uppercase"
            >
              Ashmit Gautam
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xs tracking-wider text-neutral-400 mb-8"
            >
              AI ENGINE & FULL STACK DEVELOPER
            </motion.p>

            {/* Percentage Indicator */}
            <div className="relative w-full flex flex-col items-center">
              <div className="text-5xl font-mono font-light text-white tracking-widest mb-4">
                <span className="bg-gradient-to-r from-neon-cyan to-white bg-clip-text text-transparent">
                  {progress}
                </span>
                <span className="text-xs text-neon-cyan ml-1">%</span>
              </div>

              {/* Progress bar container */}
              <div className="w-full h-[2px] bg-neutral-900 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink shadow-[0_0_8px_rgba(0,240,255,0.7)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Glowing bar shadow */}
              <div
                className="absolute h-[10px] w-full bg-neon-cyan/10 blur-[6px] top-[42px] transition-all duration-300"
                style={{ width: `${progress}%`, opacity: progress > 10 ? 1 : 0 }}
              />
            </div>

            {/* Stepper Status messages */}
            <div className="h-6 mt-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stepIndex}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.7 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs font-mono tracking-wide text-neon-cyan text-glow-cyan"
                >
                  {LOADING_STEPS[stepIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Sci-fi corners */}
          <div className="absolute top-8 left-8 border-t-2 border-l-2 border-neon-cyan/20 w-4 h-4" />
          <div className="absolute top-8 right-8 border-t-2 border-r-2 border-neon-cyan/20 w-4 h-4" />
          <div className="absolute bottom-8 left-8 border-b-2 border-l-2 border-neon-cyan/20 w-4 h-4" />
          <div className="absolute bottom-8 right-8 border-b-2 border-r-2 border-neon-cyan/20 w-4 h-4" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
