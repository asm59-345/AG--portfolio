import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
  : null;

// System context provided to Gemini
const SYSTEM_INSTRUCTIONS = `
You are "Ashmit AI", a professional chatbot assistant for Ashmit Gautam's engineering portfolio.
Your role is to answer questions from recruiters and visitors about Ashmit's projects, experience, skills, and qualifications.

PERSONAL BRIEF:
- Name: Ashmit Gautam
- Role: AI/ML Engineer | Full Stack Developer | Generative AI Builder
- Education: Bachelor of Technology (B.Tech) in Computer Science Engineering (AI & ML) at Dr. A.P.J. Abdul Kalam Technical University (2023 - 2027), Lucknow, UP, India.
- Intermediate (Science) at BSNV Inter College (2022 - 2023), Lucknow.
- Email: gautamashmit1485@gmail.com
- Phone: +91 8810954933
- GitHub: https://github.com/asm59-345
- LinkedIn: https://www.linkedin.com/in/ashmit-gautam-asar
- Location: Lucknow, Uttar Pradesh, India

CORE STATS:
- Projects: 12+
- Internships: 2+
- Hackathons: 8+
- Certifications: 15+

KEY EXPERIENCES:
1. AI & Data Analytics Intern at Skills4Future (AICTE × Shell India × Edunet) - Built ML models, feature engineering, and metrics evaluation (Oct - Nov 2025).
2. Web Developer Intern at CodeAlpha Technology - Built responsive frontends, integrated REST APIs, and managed git pipelines (Feb - Mar 2025).

FEATURED PREMIUM PROJECTS:
1. SarkarAI - Intelligent citizen assistant helping users search government schemes, check eligibility (interactive dynamic graph Q&A), analyze application documents, and submit grievances using RAG, LangChain, and Gemini API. Built with Next.js & FastAPI.
2. Agentic AI Workflow Copilot - Multi-agent graph orchestrator using LangGraph, FastAPI websockets, and React-Flow to split complex developer tasks.
3. Medical AI Chatbot (RAG) - Patient symtoms assistant querying Pinecone vector stores and citation-linking references.
4. UPI Fraud Detection - Machine learning anomaly detector handling class imbalances using SMOTE.

TECHNICAL SKILLS:
- AI/ML: Python, PyTorch, TensorFlow, LangChain, LangGraph, RAG, NLP, Computer Vision (OpenCV, MediaPipe)
- Web Dev: React, Next.js 15, TypeScript, Tailwind CSS v4, FastAPI, Node.js, Express.js
- Data & DSA: C++, SQL, Pandas, NumPy, Algorithms, Data Structures
- Cloud/Tools: Google Cloud (GCP), Oracle Cloud (OCI), Docker, Git, Firebase, MongoDB, Supabase

ACCOLADES & BADGES:
- Oracle Cloud Infrastructure 2025 Generative AI Professional Certified
- Open Source Connect India Contributor
- GenAI Exchange Hackathon Finalist
- HackFest Certificate, Hack Node India, AI Impact India Summit

GUIDELINES FOR YOUR RESPONSES:
- Be concise, professional, and friendly.
- Format lists with clear bullet points.
- Highlight Ashmit's expertise in RAG, Agentic AI, and FastAPI backends.
- If asked how to contact Ashmit, provide his email, phone number, and LinkedIn handles immediately.
- Suggest downloading his resume from the Hero section if they need a physical copy.
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. If Gemini API is available, generate dynamic response
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: SYSTEM_INSTRUCTIONS,
        });

        // Format history for Gemini chat if present
        const chat = model.startChat({
          history: history?.map((msg: any) => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          })) || [],
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        return NextResponse.json({ text: responseText });
      } catch (geminiError) {
        console.error("Gemini API call failed, using rule-based fallback:", geminiError);
      }
    }

    // 2. Local Fallback Rule-Based Responder (If Key is missing/blocked)
    const fallbackText = getLocalFallbackResponse(message);
    return NextResponse.json({ text: fallbackText });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "An unexpected server error occurred" }, { status: 500 });
  }
}

// Quick string mapping responder
function getLocalFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("who") || q.includes("about") || q.includes("bio") || q.includes("ashmit")) {
    return "Ashmit Gautam is a B.Tech CSE (AI & ML) student at AKTU (2023-2027) based in Lucknow. He is a Generative AI Builder, AI/ML Engineer, and Full Stack Developer. Key highlights: 12+ projects, 2 internships, and 8+ hackathons! 🚀";
  }
  if (q.includes("skill") || q.includes("tech") || q.includes("languages")) {
    return "Ashmit's skills include:\n\n• AI/ML: Python, PyTorch, TensorFlow, LangChain, RAG, Agentic AI, NLP, Computer Vision\n• Web Dev: React, Next.js, TypeScript, Tailwind CSS, FastAPI, Node.js\n• Data/DSA: C++, SQL, Pandas, NumPy, Data Structures & Algorithms\n• Cloud: Docker, Google Cloud (GCP), Oracle Cloud (OCI), Supabase";
  }
  if (q.includes("sarkarai") || q.includes("sarkar") || q.includes("government")) {
    return "SarkarAI is Ashmit's featured citizen assistant. It helps users discover government schemes, eligibility status, required documents, and routing grievance support using RAG and Agentic AI workflows. Built with Next.js, FastAPI, LangChain, and Gemini API!";
  }
  if (q.includes("project")) {
    return "Ashmit has built 12+ projects including:\n1. SarkarAI (AI Government Assistant)\n2. Agentic AI Workflow Copilot (LangGraph orchestration)\n3. Medical AI Chatbot (Pinecone RAG)\n4. UPI Fraud Detection (XGBoost)\n5. Sign Language Translator (OpenCV + MediaPipe)";
  }
  if (q.includes("contact") || q.includes("email") || q.includes("phone")) {
    return "You can reach Ashmit here:\n\n• Email: gautamashmit1485@gmail.com\n• Phone: +91 8810954933\n• LinkedIn: linkedin.com/in/ashmit-gautam-asar\n• GitHub: github.com/asm59-345";
  }
  if (q.includes("experience") || q.includes("work") || q.includes("intern")) {
    return "Ashmit has completed 2 internships:\n• AI & Data Analytics Intern at Skills4Future (AICTE × Shell India × Edunet) - building ML models and feature engineering.\n• Web Developer Intern at CodeAlpha Technology - React development and REST API integration.";
  }
  if (q.includes("resume") || q.includes("cv") || q.includes("download")) {
    return "You can download Ashmit's resume directly from the Hero section of the page, or ask me for contact info. Let me know how I can help!";
  }

  return "I'm Ashmit's AI assistant. I can help you with questions about his projects (like SarkarAI), internships, certifications, and programming skills! Feel free to ask.";
}
