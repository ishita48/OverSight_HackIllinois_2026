"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, PhoneOff, Loader2, AlertCircle } from "lucide-react";

const VAPI_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
const ASSISTANT_ID = "f69522f7-fe3b-4be7-b5de-2cdb179c1ada";

export default function VapiWidget() {
  const vapiRef = useRef(null);
  const scrollRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | connecting | connected | error
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        try { vapiRef.current.stop(); } catch (e) { /* ignore */ }
        vapiRef.current = null;
      }
    };
  }, []);

  // Lazy-init: only create SDK instance when user clicks Talk
  const getOrCreateVapi = useCallback(async () => {
    if (vapiRef.current) return vapiRef.current;

    // Dynamic import avoids SSR/Node issues
    const VapiSDK = (await import("@vapi-ai/web")).default;
    const vapi = new VapiSDK(VAPI_PUBLIC_KEY);

    vapi.on("call-start", () => {
      setStatus("connected");
      setErrorMsg("");
    });

    vapi.on("call-end", () => {
      setStatus("idle");
      setIsSpeaking(false);
      setVolumeLevel(0);
    });

    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));
    vapi.on("volume-level", (level) => setVolumeLevel(level));

    vapi.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          { role: message.role, text: message.transcript },
        ]);
      }
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setStatus("error");
      setErrorMsg(error?.message || "Connection failed. Please try again.");
      setTimeout(() => {
        setStatus("idle");
        setErrorMsg("");
      }, 4000);
    });

    vapiRef.current = vapi;
    return vapi;
  }, []);

  const startCall = useCallback(async () => {
    try {
      setStatus("connecting");
      setTranscript([]);
      setErrorMsg("");
      const vapi = await getOrCreateVapi();
      await vapi.start(ASSISTANT_ID);
    } catch (err) {
      console.error("Failed to start call:", err);
      setStatus("error");
      setErrorMsg(
        err?.message?.includes("permission")
          ? "Microphone access denied. Please allow mic access."
          : `Failed to connect: ${err?.message || "Unknown error"}`
      );
    }
  }, [getOrCreateVapi]);

  const endCall = useCallback(() => {
    if (!vapiRef.current) return;
    try { vapiRef.current.stop(); } catch (e) { /* ignore */ }
    setStatus("idle");
    setIsSpeaking(false);
  }, []);

  const isActive = status === "connected";
  const isConnecting = status === "connecting";
  const isError = status === "error";

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-[#E4B08F]/20 bg-[#FDFCFB] overflow-hidden">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E4B08F]/10 bg-white/60">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  isActive
                    ? isSpeaking ? "bg-[#D4735F]" : "bg-[#7FB069]"
                    : isConnecting ? "bg-[#E4B08F]"
                    : isError ? "bg-[#D4735F]"
                    : "bg-[#8B9DC3]"
                }`}
              />
              {(isActive || isConnecting) && (
                <div
                  className={`absolute inset-0 rounded-full animate-ping ${
                    isActive
                      ? isSpeaking ? "bg-[#D4735F]/40" : "bg-[#7FB069]/40"
                      : "bg-[#E4B08F]/40"
                  }`}
                />
              )}
            </div>
            <span className="text-sm font-medium text-[#2C2825]">
              {isActive
                ? isSpeaking ? "Stella is speaking..." : "Listening to you..."
                : isConnecting ? "Connecting..."
                : isError ? "Connection issue"
                : "Stella — OverSight Voice Assistant"}
            </span>
          </div>

          {isActive ? (
            <motion.button
              onClick={endCall}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#D4735F] text-white text-sm font-medium hover:bg-[#B85A47] transition-colors shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PhoneOff className="w-4 h-4" />
              <span>End</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={startCall}
              disabled={isConnecting}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium shadow-lg transition-all ${
                isConnecting
                  ? "bg-[#8B9DC3]/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#8B9DC3] to-[#6B7FA0] hover:from-[#7B8DB3] hover:to-[#5B6F90] hover:shadow-xl"
              }`}
              whileHover={!isConnecting ? { scale: 1.03 } : {}}
              whileTap={!isConnecting ? { scale: 0.97 } : {}}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Talk to Stella</span>
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <AnimatePresence>
            {isError && errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center space-x-3 p-3 mb-4 rounded-xl bg-[#D4735F]/10 border border-[#D4735F]/20"
              >
                <AlertCircle className="w-4 h-4 text-[#D4735F] flex-shrink-0" />
                <p className="text-sm text-[#D4735F]">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <div className="flex items-center justify-center space-x-1 h-12">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-1 rounded-full ${isSpeaking ? "bg-[#D4735F]" : "bg-[#8B9DC3]"}`}
                      animate={{
                        height: isSpeaking
                          ? `${Math.random() * 32 + 8}px`
                          : `${Math.max(4, volumeLevel * 40 + Math.random() * 8)}px`,
                      }}
                      transition={{ duration: 0.15, ease: "easeInOut" }}
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-[#8B9DC3] mt-2">
                  {isSpeaking ? "Stella is responding..." : "Speak naturally — Stella is listening"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            ref={scrollRef}
            className={`space-y-3 overflow-y-auto transition-all duration-300 ${
              transcript.length > 0 || isActive ? "max-h-64 min-h-[80px]" : "max-h-0"
            }`}
          >
            {transcript.length === 0 && isActive && (
              <p className="text-sm text-[#8B9DC3] text-center py-4 italic">
                Your conversation will appear here...
              </p>
            )}
            <AnimatePresence>
              {transcript.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-[#8B9DC3] to-[#6B7FA0] text-white rounded-br-md"
                        : "bg-[#F7F5F2] text-[#2C2825] border border-[#E4B08F]/20 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {status === "idle" && transcript.length === 0 && (
            <div className="text-center py-4 space-y-2">
              <div className="flex justify-center space-x-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-6 rounded-full bg-[#E4B08F]/30"
                    animate={{ height: [16, 24, 16] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                  />
                ))}
              </div>
              <p className="text-sm text-[#6B6560]">
                Talk to Stella about your medical bill — she&apos;ll help identify potential overcharges
              </p>
              <p className="text-xs text-[#8B9DC3]">Powered by OverSight AI</p>
            </div>
          )}

          {status === "idle" && transcript.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#E4B08F]/10">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#8B9DC3]">
                  Conversation ended — {transcript.length} messages
                </p>
                <motion.button
                  onClick={() => setTranscript([])}
                  className="text-xs text-[#D4735F] hover:text-[#B85A47] font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Clear
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
