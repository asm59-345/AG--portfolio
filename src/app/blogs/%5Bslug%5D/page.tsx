import { getBlogBySlug, BlogData } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, BookOpen, Tag } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import CustomCursor from "@/components/CustomCursor";
import { supabase } from "@/lib/supabase";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  // Await params as required by Next.js 15
  const { slug } = await params;
  
  let blog: BlogData | undefined;

  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      blog = {
        slug: data.slug,
        title: data.title,
        description: data.description,
        category: data.category,
        tags: Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags || "[]"),
        date: data.date,
        readTime: data.read_time || data.readTime || "5 min read",
        content: data.content
      };
    }
  } catch (err) {
    console.warn("Supabase single blog load failed:", err);
  }

  // Fallback
  if (!blog) {
    blog = getBlogBySlug(slug);
  }

  if (!blog) {
    notFound();
  }

  // Format paragraphs containing bolding and code blocks into basic styled HTML blocks
  // to avoid bringing in a heavy markdown parser
  const renderContent = (content: string) => {
    return content.split("\n\n").map((paragraph, index) => {
      if (paragraph.startsWith("###")) {
        return (
          <h3 key={index} className="text-lg font-bold text-foreground uppercase tracking-wider mt-8 mb-4 border-l-2 border-neon-cyan pl-3">
            {paragraph.replace("###", "").trim()}
          </h3>
        );
      }
      if (paragraph.startsWith("##")) {
        return (
          <h2 key={index} className="text-xl font-bold text-foreground uppercase tracking-widest mt-10 mb-5 border-l-3 border-neon-purple pl-4 text-glow-purple">
            {paragraph.replace("##", "").trim()}
          </h2>
        );
      }
      if (paragraph.startsWith("-") || paragraph.startsWith("*")) {
        return (
          <ul key={index} className="space-y-2 my-4 pl-5 list-disc text-neutral-400 font-light text-sm">
            {paragraph.split("\n").map((li, i) => (
              <li key={i}>{li.replace(/^[-*]\s*/, "")}</li>
            ))}
          </ul>
        );
      }
      if (paragraph.startsWith("1.")) {
        return (
          <ol key={index} className="space-y-2 my-4 pl-5 list-decimal text-neutral-400 font-light text-sm">
            {paragraph.split("\n").map((li, i) => (
              <li key={i}>{li.replace(/^\d+\.\s*/, "")}</li>
            ))}
          </ol>
        );
      }
      // Simple code block detector
      if (paragraph.startsWith("```")) {
        const lines = paragraph.split("\n");
        const code = lines.slice(1, -1).join("\n");
        return (
          <pre key={index} className="w-full overflow-x-auto p-4 rounded-xl border border-glass-border bg-glass-bg font-mono text-xs text-neutral-300 my-6">
            <code>{code}</code>
          </pre>
        );
      }
      
      // Inline formatting helper (for bolding and inline code)
      return (
        <p 
          key={index} 
          className="text-neutral-400 font-light leading-relaxed text-sm mb-6"
          dangerouslySetInnerHTML={{
            __html: paragraph
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
              .replace(/`(.*?)`/g, '<code class="font-mono text-xs bg-glass-bg border border-glass-border px-1.5 py-0.5 rounded text-neon-cyan">$1</code>')
          }}
        />
      );
    });
  };

  return (
    <>
      <CustomCursor />
      <ParticleBackground />

      <article className="min-h-screen py-16 px-6 relative z-10 max-w-3xl mx-auto">
        {/* Navigation back */}
        <div className="mb-10 select-none">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 hover:text-neon-cyan transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO DIRECTORY
          </Link>
        </div>

        {/* Title Meta block */}
        <div className="border-b border-glass-border pb-8 mb-10">
          <span className="text-[10px] font-mono tracking-[0.25em] text-neon-cyan uppercase block mb-3">
            {blog.category} // RESEARCH_LOG
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight uppercase mb-6">
            {blog.title}
          </h1>

          {/* Time, Read Time */}
          <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono text-neutral-500 select-none">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-neutral-600" /> {blog.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-neutral-600" /> {blog.readTime}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-neutral-600" /> Grounded Context
            </span>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none">
          {renderContent(blog.content)}
        </div>

        {/* Article Tags Footer */}
        <div className="border-t border-glass-border pt-8 mt-12 select-none">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mr-2">Tags:</span>
            {blog.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono border border-glass-border bg-glass-bg text-neutral-400 px-3 py-1 rounded-full hover:border-neon-cyan/20 transition-colors"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
