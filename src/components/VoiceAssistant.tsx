"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Navigation, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceAssistantProps {
  // Optional callback to trigger navigation Confirmations
  onNavigate?: (sectionId: string) => void;
}

export default function VoiceAssistant({ onNavigate }: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [statusMessage, setStatusMessage] = useState("Click mic to start calling");
  const [supported, setSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Speech engines
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;
      
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
      if (SpeechRecognition) {
        setSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsListening(true);
          setStatusMessage("System listening...");
          setTranscript("");
        };

        rec.onresult = async (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          setIsListening(false);
          setStatusMessage("Processing transmission...");
          
          // Trigger voice assistant responses
          await processVoiceInput(text);
        };

        rec.onerror = (e: any) => {
          const errorType = e.error || "";
          
          if (errorType === "no-speech") {
            setStatusMessage("No speech detected. Click mic to speak.");
          } else if (errorType === "aborted") {
            setStatusMessage("Speech call suspended.");
          } else if (errorType === "not-allowed") {
            setStatusMessage("Mic permission denied.");
            console.warn("Speech recognition permission denied.");
          } else {
            console.warn("Speech recognition error:", errorType, e);
            setStatusMessage("Audio signal lost. Try again.");
          }
          
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Handle cleanup of speech on unmount
  useEffect(() => {
    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsSpeaking(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Recognition already active", err);
      }
    }
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsSpeaking(false);
    setStatusMessage("Voice call suspended.");
  };

  // Perform portfolio navigation triggers based on keywords
  const handlePortfolioNavigation = (text: string): boolean => {
    const q = text.toLowerCase();
    
    const sections = [
      { keys: ["project", "machine learning", "sarkar", "build"], id: "projects", label: "projects showcase" },
      { keys: ["about", "profile", "identity", "who is"], id: "about", label: "identity profile" },
      { keys: ["skill", "capability", "technology", "language"], id: "skills", label: "technical capabilities" },
      { keys: ["experience", "work history", "internship"], id: "experience", label: "work history" },
      { keys: ["education", "background", "college", "study"], id: "education", label: "educational background" },
      { keys: ["certif", "credential", "oracle"], id: "certifications", label: "verified credentials" },
      { keys: ["research", "paper", "arxiv"], id: "research", label: "cognitive research updates" },
      { keys: ["contact", "hire", "email", "message"], id: "contact", label: "telemetry gateway" },
      { keys: ["social", "linkedin", "github"], id: "social-profiles", label: "social profiles" }
    ];

    for (const sec of sections) {
      if (sec.keys.some(k => q.includes(k))) {
        scrollToSection(sec.id);
        const confirmSpeak = `Navigating system telemetry to ${sec.label}.`;
        speakResponse(confirmSpeak);
        setStatusMessage(`Auto-scrolled to ${sec.id}`);
        return true;
      }
    }
    return false;
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      if (onNavigate) onNavigate(id);
    }
  };

  // Speaks output text via SpeechSynthesis
  const speakResponse = (text: string) => {
    if (!synthesisRef.current) return;
    
    synthesisRef.current.cancel(); // Stop current speech
    
    // Clean markdown symbols from speaking text
    const cleanText = text.replace(/[*#`_\[\]()]/g, "");
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;
    
    // Select a premium English voice if available
    const voices = synthesisRef.current.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en-") && v.name.includes("Google")) || 
                         voices.find(v => v.lang.startsWith("en-"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatusMessage("Voice AI speaking...");
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setStatusMessage("Transmission complete.");
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setStatusMessage("Audio dispatch error.");
    };

    synthesisRef.current.speak(utterance);
  };

  // Queries dynamic Gemini API endpoint for response
  const processVoiceInput = async (inputText: string) => {
    // 1. Check if navigation instruction
    const isNavigation = handlePortfolioNavigation(inputText);
    if (isNavigation) return;

    // 2. Fetch from LLM Chat backend
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputText,
          history: [] // standard brief context
        })
      });

      const data = await res.json();
      const responseText = data.text || "Apologies, I could not synthesize a dynamic response.";
      setAiResponse(responseText);
      
      // Speak AI answer
      speakResponse(responseText);
      
      // Track analytics for Voice Usage
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/", event: "VOICE_CALL", target: "speech-query" })
      }).catch(console.warn);

    } catch (err) {
      console.error("Voice response loading failed:", err);
      const fallback = "System connection offline. I am unable to connect to the Gemini intelligence network.";
      setAiResponse(fallback);
      speakResponse(fallback);
    }
  };

  if (!supported) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            className="w-[calc(100vw-3rem)] sm:w-[350px] bg-background/95 border border-glass-border rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.15)] flex flex-col gap-4 mb-4 backdrop-blur-md"
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-glass-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-foreground">
                  ASHMIT VOICE AI
                </span>
              </div>
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1 rounded-md text-neutral-400 hover:text-foreground hover:bg-glass-border transition-colors focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status indicator and wave animation */}
            <div className="flex flex-col items-center justify-center py-6 bg-glass-bg border border-glass-border rounded-xl">
              {/* Dynamic Speech Waves */}
              <div className="flex items-center justify-center gap-1.5 h-10 mb-4">
                {isListening ? (
                  // Listening Wave
                  Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 32, 8] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        delay: i * 0.1,
                      }}
                      className="w-1 bg-neon-cyan rounded-full"
                    />
                  ))
                ) : isSpeaking ? (
                  // Speaking Wave
                  Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [12, 40, 12] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.5,
                        delay: i * 0.08,
                      }}
                      className="w-1 bg-neon-purple rounded-full"
                    />
                  ))
                ) : (
                  // Idle Dots
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-1 h-2 bg-neutral-600 rounded-full" />
                  ))
                )}
              </div>

              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest text-center px-4">
                {statusMessage}
              </span>
            </div>

            {/* Transcripts visual panels */}
            {transcript && (
              <div className="text-xs p-3 rounded-lg border border-glass-border bg-glass-bg max-h-[80px] overflow-y-auto no-scrollbar">
                <span className="text-[9px] font-mono text-neon-cyan uppercase tracking-widest block mb-1">
                  You Said:
                </span>
                <p className="text-foreground italic">"{transcript}"</p>
              </div>
            )}

            {aiResponse && (
              <div className="text-xs p-3 rounded-lg border border-glass-border bg-glass-bg max-h-[100px] overflow-y-auto no-scrollbar font-light">
                <span className="text-[9px] font-mono text-neon-purple uppercase tracking-widest block mb-1">
                  AI Response:
                </span>
                <p className="text-neutral-300">{aiResponse}</p>
              </div>
            )}

            {/* Calling trigger buttons */}
            <div className="flex gap-2">
              <button
                onClick={startListening}
                disabled={isListening}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-neon-cyan/20 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan text-xs font-mono font-bold tracking-wider uppercase transition-colors disabled:opacity-40"
              >
                <Mic className="w-3.5 h-3.5" /> Start Speech
              </button>
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-4 flex items-center justify-center rounded-xl border border-neon-pink/20 bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink transition-colors"
                  title="Mute Speech Output"
                >
                  <VolumeX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Help guidelines */}
            <div className="text-[9px] font-mono text-neutral-500 border-t border-glass-border pt-3">
              <span className="uppercase text-neon-cyan/80 block mb-1">Navigation Commands:</span>
              <p>"Show projects", "Explain skills", "Go to contact"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => {
          if (isOpen && isSpeaking) {
            stopSpeaking();
          }
          setIsOpen(!isOpen);
        }}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-neon-cyan via-[#00b8ff] to-neon-purple text-white shadow-[0_4px_20px_rgba(0,240,255,0.4)] flex items-center justify-center cursor-pointer border border-glass-border focus:outline-none select-none relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative flex items-center justify-center"
            >
              {isSpeaking ? (
                <Volume2 className="w-5 h-5 animate-pulse" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
              {!isSpeaking && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-neon-purple border border-background animate-pulse" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
