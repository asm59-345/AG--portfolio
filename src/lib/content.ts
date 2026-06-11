import projectsData from "@/content/projects.json";
import blogsData from "@/content/blogs.json";

export interface ProjectData {
  slug: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  github: string;
  demo?: string;
  featured?: boolean;
  longDescription: string;
  challenges: string;
  learnings: string;
  architecture: string;
  metrics: {
    accuracy?: string;
    latency?: string;
    concurrency?: string;
  };
}

export interface BlogData {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  featured?: boolean;
  content: string;
}

export function getAllProjects(): ProjectData[] {
  return projectsData as ProjectData[];
}

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return (projectsData as ProjectData[]).find((p) => p.slug === slug);
}

export function getAllBlogs(): BlogData[] {
  return blogsData as BlogData[];
}

export function getBlogBySlug(slug: string): BlogData | undefined {
  return (blogsData as BlogData[]).find((b) => b.slug === slug);
}
