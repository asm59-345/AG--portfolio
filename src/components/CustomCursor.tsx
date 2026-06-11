"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position of the mouse pointer
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Outer ring spring configuration for lag-free following effect
  const ringX = useSpring(cursorX, { stiffness: 250, damping: 20 });
  const ringY = useSpring(cursorY, { stiffness: 250, damping: 20 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Dynamic hover listeners for links, buttons, and custom data-hover elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.closest("[role='button']") ||
        target.closest(".interactive-card") ||
        target.getAttribute("data-hover") === "true";

      if (isInteractive) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY, isVisible]);

  if (typeof window === "undefined" || !isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-screen border border-neon-cyan/60 -translate-x-1/2 -translate-y-1/2"
        style={{
          x: ringX,
          y: ringY,
          scale: hovered ? 1.6 : clicked ? 0.8 : 1,
          borderColor: hovered ? "var(--color-neon-purple)" : "var(--color-neon-cyan)",
          boxShadow: hovered 
            ? "0 0 16px rgba(189, 0, 255, 0.4), inset 0 0 8px rgba(189, 0, 255, 0.2)" 
            : "0 0 8px rgba(0, 240, 255, 0.2)",
          backgroundColor: hovered ? "rgba(189, 0, 255, 0.05)" : "transparent"
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-50 bg-neon-cyan -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorX,
          y: cursorY,
          scale: hovered ? 0.5 : clicked ? 1.5 : 1,
          backgroundColor: hovered ? "var(--color-neon-purple)" : "var(--color-neon-cyan)",
          boxShadow: hovered 
            ? "0 0 8px var(--color-neon-purple)" 
            : "0 0 4px var(--color-neon-cyan)"
        }}
      />
    </>
  );
}
