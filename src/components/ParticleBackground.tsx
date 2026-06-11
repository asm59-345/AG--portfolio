"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface FloatingLabel {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
}

const LABELS = [
  "Python", "TensorFlow", "PyTorch", "RAG", "LLMs",
  "LangChain", "FastAPI", "React", "Next.js", "MLOps", "OpenCV"
];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let floatingLabels: FloatingLabel[] = [];

    // Track theme state dynamically
    let isDark = document.documentElement.classList.contains("dark");
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
      initLabels();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 100);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    const initLabels = () => {
      floatingLabels = [];
      LABELS.forEach((label) => {
        // Measure text size mock
        const textWidth = label.length * 8 + 24;
        floatingLabels.push({
          text: label,
          x: Math.random() * (canvas.width - 150) + 75,
          y: Math.random() * (canvas.height - 80) + 40,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          width: textWidth,
          height: 28,
        });
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const maxDistance = 120;
      const mouseRadius = 180;

      // Theme-dependent colors
      const particleColor = isDark ? "rgba(0, 240, 255, 0.4)" : "rgba(37, 99, 235, 0.25)";
      const connectionColorStart = isDark ? "rgba(0, 240, 255, " : "rgba(37, 99, 235, ";
      const connectionColorEnd = isDark ? "rgba(189, 0, 255, " : "rgba(124, 58, 237, ";
      const cardBg = isDark ? "rgba(10, 10, 15, 0.55)" : "rgba(240, 244, 248, 0.65)";
      const cardBorder = isDark ? "rgba(0, 240, 255, 0.12)" : "rgba(37, 99, 235, 0.1)";
      const dotColor = isDark ? "rgba(189, 0, 255, 0.5)" : "rgba(124, 58, 237, 0.4)";
      const textColor = isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(17, 24, 39, 0.65)";

      // 1. Draw neural network particle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Move particle
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce on borders
        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        // Mouse repelling interaction
        if (mouse.active) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            p1.x += Math.cos(angle) * force * 1.5;
            p1.y += Math.sin(angle) * force * 1.5;
          }
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Neon gradient connection
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, `${connectionColorStart}${opacity})`);
            grad.addColorStop(1, `${connectionColorEnd}${opacity * 0.8})`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 2. Draw Floating HUD Label Cards
      floatingLabels.forEach((label) => {
        label.x += label.vx;
        label.y += label.vy;

        // Bounce borders
        if (label.x < 10 || label.x + label.width > canvas.width - 10) label.vx *= -1;
        if (label.y < 10 || label.y + label.height > canvas.height - 10) label.vy *= -1;

        // Mouse displacement
        if (mouse.active) {
          const dx = (label.x + label.width / 2) - mouse.x;
          const dy = (label.y + label.height / 2) - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            label.x += Math.cos(angle) * force * 0.8;
            label.y += Math.sin(angle) * force * 0.8;
          }
        }

        // Draw glass card container
        ctx.beginPath();
        const radius = 6;
        ctx.roundRect?.(label.x, label.y, label.width, label.height, radius);
        ctx.fillStyle = cardBg;
        ctx.fill();
        
        ctx.strokeStyle = cardBorder;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw card glowing corner dots
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(label.x, label.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw Text inside card
        ctx.font = "11px monospace";
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label.text, label.x + label.width / 2, label.y + label.height / 2 + 0.5);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    draw();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-transparent"
    />
  );
}
