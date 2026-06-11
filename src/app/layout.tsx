import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const lora = Lora({
  variable: "--font-heading-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ashmit Gautam | AI/ML Engineer | Full Stack Developer | Generative AI Builder",
  description: "AI/ML Engineer and Generative AI Builder specializing in RAG, Agentic Workflows, Deep Learning, and Modern Web Architectures. Explore projects, certifications, and research studies.",
  keywords: [
    "Ashmit Gautam",
    "AI Engineer",
    "Machine Learning Engineer",
    "Full Stack Developer",
    "Generative AI Developer",
    "RAG Specialist",
    "Agentic AI",
    "Next.js Developer",
    "Python Developer",
    "Lucknow"
  ],
  authors: [{ name: "Ashmit Gautam" }],
  creator: "Ashmit Gautam",
  metadataBase: new URL("https://github.com/asm59-345"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/asm59-345",
    title: "Ashmit Gautam | AI/ML Engineer & Generative AI Builder",
    description: "Building intelligent systems powered by AI, LLMs, RAG, Agentic Workflows, and modern web technologies.",
    siteName: "Ashmit Gautam Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ashmit Gautam - AI/ML Engineer & Full Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashmit Gautam | AI/ML Engineer & Generative AI Builder",
    description: "Building intelligent systems powered by AI, LLMs, RAG, Agentic Workflows, and modern web technologies.",
    images: ["/og-image.png"],
    creator: "@asm59_345",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ashmit Gautam",
    "url": "https://github.com/asm59-345",
    "image": "https://github.com/asm59-345.png",
    "jobTitle": "AI/ML Engineer & Full Stack Developer",
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Dr. A.P.J. Abdul Kalam Technical University"
    },
    "sameAs": [
      "https://www.linkedin.com/in/ashmit-gautam-asar",
      "https://github.com/asm59-345"
    ],
    "description": "AI/ML Engineer and Generative AI Builder specializing in RAG, Agentic Workflows, NLP, Computer Vision, and Next.js React applications.",
    "email": "gautamashmit1485@gmail.com",
    "telephone": "+91 8810954933",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lucknow",
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "India"
    }
  };

  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground antialiased selection:bg-neon-cyan/30 selection:text-white overflow-x-hidden min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
