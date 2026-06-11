import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface UpdateItem {
  type: "news" | "repo" | "paper";
  title: string;
  description: string;
  source: string;
  link: string;
  date: string;
  meta?: string;
}

export async function GET() {
  try {
    const updates: UpdateItem[] = [];

    // 1. Fetch Trending AI/LLM Repositories from GitHub API
    try {
      const gitRes = await fetch(
        "https://api.github.com/search/repositories?q=topic:llm+OR+topic:ai-agent+OR+topic:generative-ai&sort=stars&order=desc&per_page=4",
        {
          headers: {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "portfolio-agent"
          },
          next: { revalidate: 3600 } // Cache for 1 hour
        }
      );
      
      if (gitRes.ok) {
        const gitData = await gitRes.json();
        if (gitData.items) {
          gitData.items.forEach((repo: any) => {
            updates.push({
              type: "repo",
              title: repo.name,
              description: repo.description || "Open source repository.",
              source: `GitHub // ${repo.owner.login}`,
              link: repo.html_url,
              date: new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              meta: `★ ${repo.stargazers_count.toLocaleString()} stars`
            });
          });
        }
      }
    } catch (e) {
      console.warn("GitHub search trending fetch failed:", e);
    }

    // 2. Fetch Recent Arxiv AI Papers
    try {
      const arxivQuery = `(ti:"large language" OR ti:"retrieval-augmented" OR ti:"agentic" OR ti:"multi-agent" OR ti:"RAG")`;
      const arxivRes = await fetch(
        `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(arxivQuery)}&sortBy=submittedDate&sortOrder=descending&max_results=4`,
        { next: { revalidate: 3600 } } // Cache for 1 hour
      );

      if (arxivRes.ok) {
        const xmlText = await arxivRes.text();
        
        // Simple regex parser for arXiv xml (since DOMParser isn't built into Node.js runtime)
        const entries = xmlText.match(/<entry>[\s\S]*?<\/entry>/g) || [];
        
        entries.forEach((entry) => {
          const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
          const summaryMatch = entry.match(/<summary>([\s\S]*?)<\/summary>/);
          const publishedMatch = entry.match(/<published>([\s\S]*?)<\/published>/);
          const idMatch = entry.match(/<id>([\s\S]*?)<\/id>/);
          
          if (titleMatch && summaryMatch) {
            const title = titleMatch[1].replace(/\n/g, " ").trim();
            const summary = summaryMatch[1].replace(/\n/g, " ").trim().substring(0, 160) + "...";
            const published = publishedMatch ? new Date(publishedMatch[1]).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
            const id = idMatch ? idMatch[1].trim() : "";
            
            // Extract PDF url or use id
            const pdfMatch = entry.match(/<link[^>]*?href="([^"]*?)"[^>]*?type="application\/pdf"/);
            const pdfUrl = pdfMatch ? pdfMatch[1] : id;

            updates.push({
              type: "paper",
              title,
              description: summary,
              source: "arXiv // Research",
              link: pdfUrl,
              date: published,
              meta: "Research Paper"
            });
          }
        });
      }
    } catch (e) {
      console.warn("Arxiv trending fetch failed:", e);
    }

    // Fallbacks if lists are empty
    if (updates.length === 0) {
      updates.push(
        {
          type: "news",
          title: "LangGraph Multi-Agent Orchestration",
          description: "Developers adopt cyclic graph flows over linear pipelines for complex task decomposition and autonomous execution loops.",
          source: "Agentic AI updates",
          link: "https://github.com/langchain-ai/langgraph",
          date: "Today",
          meta: "Frameworks"
        },
        {
          type: "news",
          title: "Model Context Protocol (MCP) Standardized",
          description: "Anthropic's open-source standard for secure tool-use integration becomes widely integrated by leading developer agents.",
          source: "LLM trends",
          link: "https://modelcontextprotocol.org",
          date: "Today",
          meta: "Protocols"
        }
      );
    }

    return NextResponse.json(updates);
  } catch (error) {
    console.error("AI Updates route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
