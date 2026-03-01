// app/record/[id]/page.js
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Mic, Square, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Vapi from "@vapi-ai/web";
import { useUser } from "@clerk/nextjs";
import { generatePrompt, analyzeTranscriptMood } from "@/utils/generatePrompt";
import { motion, AnimatePresence } from "framer-motion";
import { chatSession } from "@/utils/GeminiAIModel";
import { generateFounderNarrativePrompt } from "@/utils/GeminiPrompt";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);

const CONNECTION_STATES = {
  DISCONNECTED: "disconnected",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  ERROR: "error",
};

const RecordSession = () => {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Get projectId from URL if it exists
  const projectId = searchParams.get("projectId");
  const [projectContext, setProjectContext] = useState(null);
  const [richContext, setRichContext] = useState(null);

  // Core session states
  const [callEnded, setCallEnded] = useState(false);
  const [activeUser, setActiveUser] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");

  // Enhanced UI states
  const [isInitializing, setIsInitializing] = useState(true);
  const [connectionState, setConnectionState] = useState(
    CONNECTION_STATES.DISCONNECTED
  );
  const [error, setError] = useState(null);
  const [savingFeedback, setSavingFeedback] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);

  // Refs for cleanup and persistence
  const conversationRef = useRef([]);
  const timerRef = useRef(null);
  const backupIntervalRef = useRef(null);

  // Utility function to format elapsed time
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Fetch project context (basic for VAPI)
  const fetchProjectContext = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/context`);
      if (!response.ok) {
        throw new Error("Failed to fetch project context");
      }
      const context = await response.json();
      setProjectContext(context);
      return context;
    } catch (error) {
      console.error("Error fetching project context:", error);
      toast.error("Could not load project context");
      return null;
    }
  };

  // Fetch rich context (for Gemini)
  const fetchRichContext = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/rich-context`);
      if (!response.ok) {
        console.warn(
          "Rich context not available, falling back to basic context"
        );
        return null;
      }
      const data = await response.json();
      setRichContext(data.context);
      console.log("Fetched rich context:", data.context);
      return data.context;
    } catch (error) {
      console.error("Error fetching rich context:", error);
      return null;
    }
  };

  // Local storage backup for session data
  const backupSession = useCallback(() => {
    if (conversation.length > 0 && params?.id) {
      try {
        localStorage.setItem(
          `session-${params.id}`,
          JSON.stringify({
            conversation,
            timestamp: Date.now(),
            elapsedTime,
            currentQuestion,
            projectId,
            projectContext,
            richContext,
          })
        );
      } catch (err) {
        console.warn("Failed to backup session:", err);
      }
    }
  }, [
    conversation,
    elapsedTime,
    currentQuestion,
    params?.id,
    projectId,
    projectContext,
    richContext,
  ]);

  // Restore session from backup if available
  const restoreSession = useCallback(() => {
    if (!params?.id) return;

    try {
      const backup = localStorage.getItem(`session-${params.id}`);
      if (backup) {
        const data = JSON.parse(backup);
        // Only restore if backup is less than 24 hours old
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          setConversation(data.conversation || []);
          setElapsedTime(data.elapsedTime || 0);
          setCurrentQuestion(data.currentQuestion || "");
          conversationRef.current = data.conversation || [];
          if (data.projectContext) {
            setProjectContext(data.projectContext);
          }
          if (data.richContext) {
            setRichContext(data.richContext);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to restore session:", err);
    }
  }, [params?.id]);

  // Timer management for session duration
  useEffect(() => {
    if (!callEnded && connectionState === CONNECTION_STATES.CONNECTED) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [callEnded, connectionState]);

  // Auto-backup every 30 seconds
  useEffect(() => {
    backupIntervalRef.current = setInterval(backupSession, 30000);
    return () => clearInterval(backupIntervalRef.current);
  }, [backupSession]);

  // Start Vapi call with enhanced error handling
  const startCall = useCallback(
    async (systemPrompt, firstMessage, isRetry = false) => {
      try {
        setConnectionState(CONNECTION_STATES.CONNECTING);
        setError(null);
        setCurrentQuestion(firstMessage);

        const assistantOptions = {
          name: "OverSight Coach",
          firstMessage,
          transcriber: {
            provider: "deepgram",
            model: "nova-3",
            language: "en-US",
          },
          voice: {
            provider: "11labs",
            voiceId: "UgBBYS2sOqTuMpoF3BR0",
          },
          model: {
            provider: "openai",
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
            ],
          },
        };

        await vapi.start(assistantOptions);
        setConnectionState(CONNECTION_STATES.CONNECTED);

        if (isRetry) {
          toast.success("Successfully reconnected!");
          setRetryCount(0);
        }
      } catch (err) {
        console.error("Failed to start call:", err);
        setConnectionState(CONNECTION_STATES.ERROR);
        setError(err.message || "Failed to connect to voice service");

        // Auto-retry up to 3 times with exponential backoff
        if (!isRetry && retryCount < 3) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            startCall(systemPrompt, firstMessage, true);
          }, 2000 * (retryCount + 1));
        } else {
          toast.error("Failed to start session. Please try again.");
        }
      }
    },
    [retryCount]
  );

  // Initialize session on component mount
  useEffect(() => {
    if (!user) return;

    const initializeSession = async () => {
      try {
        setIsInitializing(true);
        restoreSession();

        // If we have projectId, get both contexts
        let context = null;
        let rich = null;
        if (projectId) {
          // Fetch both contexts in parallel
          const [basicContext, richContextData] = await Promise.all([
            fetchProjectContext(projectId),
            fetchRichContext(projectId),
          ]);
          context = basicContext;
          rich = richContextData;
        }

        const { systemPrompt, firstMessage } = await generatePrompt(
          user.firstName,
          context,
          rich
        );

        await startCall(systemPrompt, firstMessage);
        console.log("systemPrompt:", systemPrompt);
      } catch (err) {
        console.error("Session initialization failed:", err);
        setError("Failed to initialize session");
        toast.error("Failed to initialize session");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
  }, [user, startCall, restoreSession, projectId]);

  // End session handlers
  const handleEndSession = useCallback(() => {
    setShowEndConfirmation(true);
  }, []);

  const confirmEndSession = useCallback(async () => {
    setIsEndingSession(true);
    setShowEndConfirmation(false);

    // Add slight delay for better UX
    setTimeout(() => {
      try {
        vapi.stop();
        clearInterval(timerRef.current);
        clearInterval(backupIntervalRef.current);
      } catch (err) {
        console.error("Failed to stop call:", err);
      }
    }, 500);
  }, []);

  const cancelEndSession = useCallback(() => {
    setShowEndConfirmation(false);
  }, []);

  // Retry connection after error
  const retryConnection = useCallback(async () => {
    if (!user) return;

    try {
      let context = null;
      if (projectId) {
        context = await fetchProjectContext(projectId);
      }
      const { systemPrompt, firstMessage } = await generatePrompt(
        user.firstName,
        context
      );
      await startCall(systemPrompt, firstMessage, true);
    } catch (err) {
      toast.error("Retry failed. Please refresh the page.");
    }
  }, [user, startCall, projectId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        showEndConfirmation
      ) {
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        handleEndSession();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showEndConfirmation, handleEndSession]);

  // Vapi event handlers
  useEffect(() => {
    const handleStart = () => {
      setConnectionState(CONNECTION_STATES.CONNECTED);
      toast.success("OverSight session started");
    };

    const handleSpeechStart = () => {
      setActiveUser(false);
      setIsProcessing(false);
    };

    const handleSpeechEnd = () => {
      setActiveUser(true);
      setIsProcessing(true);
    };

    const handleCallEnd = async () => {
      setCallEnded(true);
      setIsProcessing(false);
      setIsEndingSession(false);
      toast("Session ended");

      const finalConversation = conversationRef.current;

      if (!finalConversation || finalConversation.length === 0) {
        console.warn("No conversation history available for feedback.");
        router.push("/home");
        return;
      }

      // Create transcript from conversation
      const transcript = finalConversation
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .map((msg) => {
          const speaker = msg.role === "assistant" ? "AI" : "User";
          return `${speaker}: ${msg.content}`;
        })
        .join("\n");

      if (!user?.id) {
        toast.error("User not identified. Unable to save session.");
        console.warn("Missing user ID");
        return;
      }

      try {
        setSavingFeedback(true);

        // Generate AI feedback using Gemini with rich context
        const prompt = generateFounderNarrativePrompt(transcript, richContext);
        const result = await chatSession.sendMessage(prompt);
        const responseText = (await result.response.text())
          .replace("```json", "")
          .replace("```", "");
        console.log("responseText:", responseText);

        const feedbackJson = JSON.parse(responseText);
        console.log("feedbackJson:", feedbackJson);

        if (!feedbackJson || typeof feedbackJson !== "object") {
          toast.error("Invalid feedback generated.");
          console.warn("Gemini response parsing failed:", responseText);
          return;
        }

        // Analyze mood from transcript if not provided
        if (!feedbackJson.mood) {
          feedbackJson.mood = analyzeTranscriptMood(transcript);
        }

        // Save to database using API
        try {
          const response = await fetch("/api/save-narrative", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              sessionId: params?.id,
              transcript,
              feedbackJson: JSON.stringify(feedbackJson),
              projectId: projectId,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to save narrative");
          }

          // Clear backup after successful save
          if (params?.id) {
            localStorage.removeItem(`session-${params.id}`);
          }

          toast.success("Story analysis complete! ✅");
          router.push(`/session/${params.id}/report`);
        } catch (dbErr) {
          console.error("Database save failed:", dbErr);
          toast.error("Failed to save session ❌");
          toast.info("Session data backed up locally");
        }
      } catch (err) {
        console.error("Post-call processing error:", err);
        toast.error("Failed to generate story analysis ❌");
        toast.info("Session data backed up locally");
      } finally {
        setSavingFeedback(false);
      }
    };

    const handleMessage = (message) => {
      if (message?.conversation) {
        const lastMessage = message.conversation.at(-1)?.message;
        if (lastMessage) setCurrentQuestion(lastMessage);
        conversationRef.current = message.conversation;
        setConversation(message.conversation);
      }
    };

    const handleError = (error) => {
      console.error("Vapi error:", error);
      setConnectionState(CONNECTION_STATES.ERROR);
      setError(error.message || "Connection error occurred");
      toast.error(`Connection error: ${error.message || "Unknown error"}`);
    };

    const handleVolume = (volume) => {
      setAudioLevel(Math.min(volume * 2, 1));
    };

    // Register all event listeners
    vapi.on("call-start", handleStart);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
    vapi.on("error", handleError);
    vapi.on("volume-level", handleVolume);

    // Cleanup listeners
    return () => {
      vapi.off("call-start", handleStart);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("call-end", handleCallEnd);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
      vapi.off("volume-level", handleVolume);
    };
  }, [user, params, router, projectId, projectContext, richContext]);

  // Loading screen during initialization
  if (isInitializing) {
    return (
      <main className="flex flex-col items-center justify-center h-screen bg-[#FDFCFB] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F2] via-transparent to-[#F7F5F2] opacity-60" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#8B9DC3]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-[#D4735F]/5 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-8 relative z-10"
        >
          <div className="relative">
            <motion.div
              className="w-16 h-16 border-4 border-[#D4735F]/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 bg-[#D4735F] rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-serif font-light text-[#2C2825] mb-4">
              {projectContext
                ? `preparing ${projectContext.projectName} session...`
                : "igniting your story session"}
            </h2>
            <p className="text-[#6B6560] font-light leading-relaxed">
              {projectContext && projectContext.sessionNumber > 1
                ? `weaving session ${projectContext.sessionNumber} into your narrative tapestry...`
                : "your personalized AI interviewer is warming up, ready to help you discover the depths of your founder journey..."}
            </p>
          </div>
        </motion.div>
      </main>
    );
  }

  // Error screen with retry options
  if (connectionState === CONNECTION_STATES.ERROR && !isInitializing) {
    return (
      <main className="flex flex-col items-center justify-center h-screen bg-[#FDFCFB] relative overflow-hidden px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F2] via-transparent to-[#F7F5F2] opacity-60" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#8B9DC3]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-[#D4735F]/5 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-8 max-w-lg text-center relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 bg-[#D4735F]/10 rounded-full flex items-center justify-center"
          >
            <AlertCircle className="w-10 h-10 text-[#D4735F]" />
          </motion.div>

          <div>
            <h2 className="text-3xl font-serif font-light text-[#2C2825] mb-4">
              connection interrupted
            </h2>
            <p className="text-[#6B6560] font-light leading-relaxed mb-2">
              {error ||
                "we couldn't establish a connection to the voice service. let's try to reconnect your story session."}
            </p>
            {retryCount > 0 && (
              <p className="text-[#D4735F] text-sm font-medium">
                attempt {retryCount}/3
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <motion.button
              onClick={retryConnection}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#B85A47] hover:to-[#A04A37]
                       text-white py-3 px-6 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
            >
              reconnect
            </motion.button>
            <motion.button
              onClick={() => router.push("/home")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 border border-[#F7F5F2] text-[#6B6560] hover:bg-[#F7F5F2] hover:text-[#2C2825]
                       py-3 px-6 rounded-xl transition-colors font-medium"
            >
              return home
            </motion.button>
          </div>
        </motion.div>
      </main>
    );
  }

  // Main session interface
  return (
    <main className="relative flex flex-col items-center justify-center h-screen bg-[#FDFCFB] overflow-hidden px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F2] via-transparent to-[#F7F5F2] opacity-60" />
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#8B9DC3]/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D4735F]/5 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <div className="absolute top-6 left-6 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-2xl font-serif font-light text-[#2C2825] tracking-tight">
            🔥 OverSight session
          </h1>
          <p className="text-[#6B6560] text-sm font-light">
            {projectContext
              ? `continuing ${projectContext.projectName} • chapter ${projectContext.sessionNumber}`
              : "weaving your founder narrative"}
          </p>
        </motion.div>
      </div>

      {/* Timer and Connection Status */}
      <div className="absolute top-6 right-6 text-right z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="text-[#2C2825] text-lg font-mono font-medium">
            {formatTime(elapsedTime)}
          </div>
          <div
            className={`text-xs flex items-center justify-end space-x-2 font-medium ${
              connectionState === CONNECTION_STATES.CONNECTED
                ? "text-[#D4735F]"
                : connectionState === CONNECTION_STATES.CONNECTING
                ? "text-[#8B9DC3]"
                : "text-[#D4735F]"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>
              {connectionState === CONNECTION_STATES.CONNECTED
                ? "recording"
                : connectionState === CONNECTION_STATES.CONNECTING
                ? "connecting..."
                : "disconnected"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Interface */}
      <div className="flex flex-col items-center justify-center z-10">
        {/* Enhanced Microphone */}
        <div className="relative mb-8">
          <motion.div
            className={`w-36 h-36 rounded-full flex items-center justify-center shadow-2xl relative ${
              activeUser
                ? "bg-gradient-to-br from-[#D4735F] to-[#B85A47]"
                : "bg-gradient-to-br from-[#8B9DC3] to-[#6B8BB3]"
            }`}
            animate={{
              scale: activeUser ? [1, 1.05, 1] : 1,
              boxShadow: activeUser
                ? [
                    "0 0 40px rgba(212, 115, 95, 0.4)",
                    "0 0 60px rgba(212, 115, 95, 0.6)",
                    "0 0 40px rgba(212, 115, 95, 0.4)",
                  ]
                : "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
            transition={{
              duration: 2,
              repeat: activeUser ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <Mic className="w-14 h-14 text-white drop-shadow-lg" />

            {/* Pulse rings for active state */}
            {activeUser && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#D4735F]/60"
                  animate={{
                    scale: [1, 1.4],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#D4735F]/40"
                  animate={{
                    scale: [1, 1.6],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5,
                  }}
                />
              </>
            )}

            {/* Audio level visualization */}
            {activeUser && (
              <motion.div
                className="absolute inset-3 rounded-full bg-white/20"
                animate={{
                  scale: [1, 1 + audioLevel * 0.2],
                  opacity: [0.3, 0.7],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Current Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            className="text-center max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl md:text-2xl font-serif font-light leading-relaxed text-[#2C2825]">
              {currentQuestion || "preparing your personalized conversation..."}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Processing Indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-4"
          >
            {/* Enhanced Waveform Animation */}
            <div className="flex items-end justify-center space-x-1.5 h-20">
              {[...Array(18)].map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-gradient-to-t from-[#8B9DC3] to-[#D4735F] rounded-full shadow-lg"
                  style={{
                    width: "4px",
                    minHeight: "6px",
                  }}
                  animate={{
                    height: [
                      Math.random() * 30 + 10,
                      Math.random() * 60 + 20,
                      Math.random() * 40 + 12,
                      Math.random() * 70 + 25,
                    ],
                    opacity: [0.5, 1, 0.7, 0.9],
                    boxShadow: [
                      "0 0 5px rgba(139, 157, 195, 0.3)",
                      "0 0 20px rgba(212, 115, 95, 0.7)",
                      "0 0 10px rgba(139, 157, 195, 0.5)",
                      "0 0 15px rgba(212, 115, 95, 0.6)",
                    ],
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
            <motion.span
              className="text-sm text-[#6B6560] font-light"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              weaving your words into story...
            </motion.span>
          </motion.div>
        )}
      </div>

      {/* User Status */}
      <div className="absolute bottom-6 left-6 text-sm text-[#6B6560] z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                activeUser ? "bg-[#D4735F] animate-pulse" : "bg-[#8B9DC3]"
              }`}
            />
            <span className="font-medium text-[#2C2825]">
              {user?.firstName || "you"}
            </span>
          </div>
          <div className="text-xs font-light">
            {activeUser ? "sharing your story..." : "listening intently..."}
          </div>
        </motion.div>
      </div>

      {/* Enhanced End Session Button */}
      <div className="absolute bottom-6 right-6 z-10">
        <motion.button
          onClick={handleEndSession}
          disabled={isEndingSession}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            group relative bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#B85A47] hover:to-[#A04A37]
            text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 
            shadow-lg hover:shadow-xl flex items-center space-x-2 min-w-[140px] justify-center
            ${isEndingSession ? "opacity-50 cursor-not-allowed" : ""}
          `}
          title="End Session (Escape)"
        >
          {isEndingSession ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>ending...</span>
            </>
          ) : (
            <>
              <Square className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>complete story</span>
            </>
          )}

          {/* Animated border */}
          {!isEndingSession && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-[#D4735F]/30"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.button>
      </div>

      {/* End Session Confirmation Modal */}
      <AnimatePresence>
        {showEndConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={cancelEndSession}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FDFCFB]/95 backdrop-blur border border-[#F7F5F2] rounded-2xl p-8 text-center space-y-6 max-w-md mx-4 shadow-2xl"
            >
              <div className="w-16 h-16 bg-[#D4735F]/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-[#D4735F]" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-light text-[#2C2825] mb-3">
                  complete your story session?
                </h3>
                <p className="text-[#6B6560] font-light leading-relaxed">
                  your conversation will be woven into a personalized narrative
                  analysis. you'll be guided to your story report to explore the
                  insights discovered.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={cancelEndSession}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 border border-[#F7F5F2] text-[#6B6560] hover:bg-[#F7F5F2] hover:text-[#2C2825] py-3 px-6 rounded-xl transition-colors font-medium"
                >
                  continue session
                </motion.button>
                <motion.button
                  onClick={confirmEndSession}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#B85A47] hover:to-[#A04A37] text-white py-3 px-6 rounded-xl transition-all font-medium shadow-lg"
                >
                  complete & analyze
                </motion.button>
              </div>

              <p className="text-xs text-[#8B9DC3] font-light">
                session duration: {formatTime(elapsedTime)}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saving Feedback Overlay */}
      <AnimatePresence>
        {savingFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#FDFCFB]/95 backdrop-blur border border-[#F7F5F2] rounded-2xl p-8 text-center space-y-6 max-w-md mx-4 shadow-2xl"
            >
              <div className="relative">
                <motion.div
                  className="w-16 h-16 border-4 border-[#D4735F]/20 rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-2 bg-[#D4735F] rounded-full mx-auto"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 border-4 border-[#8B9DC3]/30 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-light text-[#2C2825] mb-3">
                  {richContext && richContext.totalSessions > 0
                    ? `weaving chapter ${richContext.currentSessionNumber}...`
                    : "crafting your story tapestry..."}
                </h3>
                <p className="text-[#6B6560] font-light leading-relaxed">
                  {richContext && richContext.totalSessions > 0
                    ? `threading session ${richContext.currentSessionNumber} into your evolving narrative arc, discovering new patterns and insights...`
                    : "our AI is carefully analyzing your conversation, extracting meaningful insights and weaving them into a personalized story analysis..."}
                </p>
              </div>

              <div className="w-full bg-[#F7F5F2] rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#8B9DC3] to-[#D4735F] rounded-full"
                  animate={{ x: [-100, 300] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <p className="text-xs text-[#8B9DC3] font-light">
                weaving insights typically takes 10-15 seconds...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Context Indicator */}
      {projectContext && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="bg-[#FDFCFB]/80 backdrop-blur border border-[#F7F5F2] rounded-xl px-4 py-2 text-sm shadow-lg">
            <span className="text-[#6B6560] font-light">continuing from: </span>
            <span className="text-[#8B9DC3] font-medium">
              "{projectContext.lastSessionSummary?.slice(0, 50)}..."
            </span>
          </div>
        </motion.div>
      )}

      {/* Session Progress Indicator (for continuing sessions) */}
      {richContext && richContext.totalSessions > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute top-20 left-6 z-10"
        >
          <div className="bg-[#FDFCFB]/80 backdrop-blur border border-[#F7F5F2] rounded-xl px-4 py-2 shadow-lg">
            <div className="text-xs text-[#6B6560] font-light mb-1">
              journey progress
            </div>
            <div className="flex items-center space-x-2">
              {[...Array(Math.min(richContext.totalSessions + 1, 10))].map(
                (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < richContext.totalSessions
                        ? "bg-[#8B9DC3]"
                        : i === richContext.totalSessions
                        ? "bg-[#D4735F] animate-pulse"
                        : "bg-[#F7F5F2]"
                    }`}
                  />
                )
              )}
              {richContext.totalSessions > 10 && (
                <span className="text-xs text-[#6B6560] font-light">
                  +{richContext.totalSessions - 10}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-20 left-6 text-xs text-[#8B9DC3] font-light z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          press escape to complete session
        </motion.div>
      </div>

      {/* Session Stage Indicator (for continuing sessions) */}
      {projectContext && projectContext.currentStage && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute top-20 right-6 z-10"
        >
          <Badge className="bg-[#8B9DC3]/20 text-[#8B9DC3] border-[#8B9DC3]/30 font-light">
            stage: {projectContext.currentStage}
          </Badge>
        </motion.div>
      )}

      {/* Narrative Evolution Indicator */}
      {richContext &&
        richContext.bioEvolution &&
        richContext.bioEvolution.hasEvolved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-20 right-6 text-xs text-[#6B6560] font-light z-10"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#D4735F] rounded-full animate-pulse" />
              <span>your story is evolving...</span>
            </div>
          </motion.div>
        )}

      {/* Floating particles for ambiance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#8B9DC3]/30 rounded-full"
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1200),
              y:
                Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, -30, null],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`terracotta-${i}`}
            className="absolute w-0.5 h-0.5 bg-[#D4735F]/20 rounded-full"
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1200),
              y:
                Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              x: [null, Math.random() * 40 - 20, null],
              y: [null, -40, null],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 12 + 8,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </main>
  );
};

export default RecordSession;
