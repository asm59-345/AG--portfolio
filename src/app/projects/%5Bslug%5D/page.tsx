import { getProjectBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Code, Server, Cpu, Layers } from "lucide-react";
import { Github } from "@/components/SocialIcons";
import ParticleBackground from "@/components/ParticleBackground";
import CustomCursor from "@/components/CustomCursor";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <CustomCursor />
      <ParticleBackground />

      <div className="min-h-screen py-16 px-6 relative z-10 max-w-4xl mx-auto">
        {/* Navigation back */}
        <div className="mb-10 select-none">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 hover:text-neon-cyan transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO SYSTEM_BASE
          </Link>
        </div>

        {/* Hero Meta Header */}
        <div className="border-b border-glass-border pb-8 mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-neon-cyan uppercase">
              {project.category} // PROJECT_LOG
            </span>
            {project.featured && (
              <span className="text-[9px] font-mono bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan px-2 py-0.5 rounded uppercase tracking-wider text-glow-cyan">
                Featured Build
              </span>
            )}
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-none uppercase mb-6">
            {project.title}
          </h1>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-glass-border hover:border-neon-cyan/20 bg-glass-bg hover:bg-neon-cyan/5 text-xs font-mono text-neutral-300 hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub Repository
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-neon-cyan to-[#00b8ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] text-xs font-semibold text-black transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Live Demonstration
              </a>
            )}
          </div>
        </div>

        {/* Content Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Area: Overview & Challenges */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview */}
            <div className="glassmorphism p-6 sm:p-8 rounded-2xl">
              <h4 className="text-sm font-bold font-mono tracking-widest text-foreground uppercase border-b border-glass-border pb-3 mb-4 flex items-center gap-2">
                <Server className="w-4.5 h-4.5 text-neon-cyan" /> Project Overview
              </h4>
              <p className="text-neutral-400 font-light leading-relaxed text-sm">
                {project.longDescription}
              </p>
            </div>

            {/* Architecture Diagram Outline */}
            <div className="glassmorphism p-6 sm:p-8 rounded-2xl">
              <h4 className="text-sm font-bold font-mono tracking-widest text-foreground uppercase border-b border-glass-border pb-3 mb-4 flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-neon-purple" /> System Pipeline Architecture
              </h4>
              <p className="text-neutral-400 font-light leading-relaxed text-sm mb-6">
                {project.architecture}
              </p>
              
              {/* Visual diagram flowchart nodes */}
              <div className="p-4 rounded-xl border border-glass-border bg-glass-bg font-mono text-[10px] text-neutral-400 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-glass-bg border border-glass-border text-foreground font-bold text-glow-cyan shrink-0">Client UI</span>
                  <span className="text-neutral-600">▬▬▬▶</span>
                  <span className="px-2 py-0.5 rounded bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan shrink-0">Next.js API Gateway</span>
                </div>
                <div className="flex items-center gap-3 pl-8">
                  <span className="text-neutral-600">│</span>
                  <span className="text-neutral-600">▼</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-neon-purple/5 border border-neon-purple/20 text-neon-purple shrink-0">FastAPI Agent Executor</span>
                  <span className="text-neutral-600">◀▬▬▶</span>
                  <span className="px-2 py-0.5 rounded bg-glass-bg border border-glass-border text-neutral-400 shrink-0">Vector Store DB</span>
                </div>
              </div>
            </div>

            {/* Challenges Faced */}
            <div className="p-6 sm:p-8 rounded-2xl border border-neon-purple/15 bg-neon-purple/[0.02]">
              <h4 className="text-sm font-bold font-mono tracking-widest text-neon-purple uppercase border-b border-neon-purple/10 pb-3 mb-4 flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5" /> Engineering Obstacle & Solution
              </h4>
              <p className="text-neutral-400 font-light leading-relaxed text-xs">
                {project.challenges}
              </p>
            </div>

            {/* Learnings */}
            <div className="glassmorphism p-6 sm:p-8 rounded-2xl">
              <h4 className="text-sm font-bold font-mono tracking-widest text-foreground uppercase border-b border-glass-border pb-3 mb-4 flex items-center gap-2">
                <Code className="w-4.5 h-4.5 text-neon-cyan" /> Learnings & Insights
              </h4>
              <p className="text-neutral-400 font-light leading-relaxed text-xs">
                {project.learnings}
              </p>
            </div>
          </div>

          {/* Right Area: Sidebar metrics & tech stack */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tech Stack Box */}
            <div className="glassmorphism p-6 rounded-2xl">
              <h5 className="text-xs font-bold font-mono tracking-widest text-neutral-400 uppercase mb-4">
                Core Stack
              </h5>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono bg-glass-bg border border-glass-border text-neutral-400 px-3 py-1 rounded-full animate-float"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance KPIs metrics */}
            <div className="glassmorphism p-6 rounded-2xl space-y-6 select-none">
              <h5 className="text-xs font-bold font-mono tracking-widest text-neutral-400 uppercase">
                Telemetry KPIs
              </h5>
              
              {/* Metric 1 */}
              {project.metrics.accuracy && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-neutral-500 font-mono">Accuracy / F1</span>
                    <span className="text-neon-cyan font-bold font-mono">{project.metrics.accuracy}</span>
                  </div>
                  <div className="w-full h-1 bg-glass-border rounded-full overflow-hidden">
                    <div className="h-full bg-neon-cyan" style={{ width: "94%" }} />
                  </div>
                </div>
              )}

              {/* Metric 2 */}
              {project.metrics.latency && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-neutral-500 font-mono">Inference Latency</span>
                    <span className="text-neon-purple font-bold font-mono">{project.metrics.latency}</span>
                  </div>
                  <div className="w-full h-1 bg-glass-border rounded-full overflow-hidden">
                    <div className="h-full bg-neon-purple" style={{ width: "88%" }} />
                  </div>
                </div>
              )}

              {/* Metric 3 */}
              {project.metrics.concurrency && (
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-mono">Concurrency Limit</span>
                    <span className="text-foreground font-semibold font-mono text-[11px]">{project.metrics.concurrency}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </>
  );
}
