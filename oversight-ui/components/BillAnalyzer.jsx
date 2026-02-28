"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Brain,
  AlertCircle,
  Upload,
  CheckCircle,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AnalysisResults from "@/components/AnalysisResults";

// ─── Safe Clerk import: returns null when user isn't signed in ───
let useUserSafe = () => ({ user: null });
try {
  const clerk = require("@clerk/nextjs");
  useUserSafe = clerk.useUser;
} catch {}

const ANALYSIS_STEPS = [
  "Reading PDF structure...",
  "Extracting line items and CPT codes...",
  "Benchmarking against national pricing data...",
  "Detecting billing anomalies...",
  "Generating dispute letter...",
];

export default function BillAnalyzer() {
  const { user } = useUserSafe();

  const [stage, setStage] = useState("idle"); // idle | analyzing | complete | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(
    async (file) => {
      // ── Validate ──
      const name = file.name?.toLowerCase() || "";
      if (!name.endsWith(".pdf")) {
        setError("Please upload a PDF file.");
        setStage("error");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File too large. Maximum size is 10 MB.");
        setStage("error");
        return;
      }

      // ── Start analysis ──
      setStage("analyzing");
      setError("");
      setCurrentStep(0);

      // Progress stepper (visual only)
      let step = 0;
      const stepInterval = setInterval(() => {
        step = Math.min(step + 1, ANALYSIS_STEPS.length - 1);
        setCurrentStep(step);
      }, 3000);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", user?.id ?? "anonymous");

        const res = await fetch("/api/analyze-bill", {
          method: "POST",
          body: formData,
        });

        clearInterval(stepInterval);
        setCurrentStep(ANALYSIS_STEPS.length - 1);

        const data = await res.json();

        if (!res.ok || data.status === "failed") {
          throw new Error(data.error || `Server error (${res.status})`);
        }

        // Validate response shape
        if (!data.analysis || !data.extracted_bill) {
          throw new Error("Invalid response from analysis backend.");
        }

        setResult(data);
        setStage("complete");
      } catch (err) {
        clearInterval(stepInterval);
        console.error("BillAnalyzer error:", err);
        setError(
          err?.message || "Something went wrong. Please try again."
        );
        setStage("error");
      }
    },
    [user?.id]
  );

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const reset = () => {
    setStage("idle");
    setResult(null);
    setError("");
    setCurrentStep(0);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {/* ── Upload Drop Zone ── */}
        {stage === "idle" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl shadow-xl">
              <CardContent className="p-0">
                <div className="text-center">
                  <div className="relative min-h-[280px] flex items-center justify-center p-8">
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-12 w-full transition-all duration-300 cursor-pointer group ${
                        dragOver
                          ? "border-[#D4735F] bg-[#D4735F]/5"
                          : "border-[#E4B08F]/40 bg-[#F7F5F2]/30 hover:bg-[#F7F5F2]/50"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept=".pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileInput}
                      />

                      <div className="flex flex-col items-center space-y-4">
                        <motion.div
                          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4735F] to-[#B85A47] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <FileText className="w-10 h-10 text-white" />
                        </motion.div>

                        <div className="space-y-2">
                          <h3 className="text-2xl font-serif font-medium text-[#2C2825]">
                            {dragOver ? "Drop it here!" : "Try it now — drop your medical bill"}
                          </h3>
                          <p className="text-[#6B6560]">
                            or click to browse • PDF files up to 10 MB
                          </p>
                        </div>

                        <Button className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#C66A56] hover:to-[#A5533F] text-white rounded-full px-6 shadow-lg pointer-events-none">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>

                        <div className="flex items-center space-x-2 text-sm text-[#8B9DC3]">
                          <CheckCircle className="w-4 h-4" />
                          <span>Secure • Private • No account required</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Analyzing ── */}
        {stage === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl shadow-xl">
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center space-y-6 p-12 min-h-[280px]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="w-16 h-16 text-[#8B9DC3]" />
                  </motion.div>

                  <div className="text-center space-y-3">
                    <p className="text-2xl font-serif font-medium text-[#2C2825]">
                      Analyzing your bill...
                    </p>
                    <p className="text-sm text-[#8B9DC3]">
                      This may take up to 60 seconds on first run
                    </p>

                    <div className="pt-4 space-y-2">
                      {ANALYSIS_STEPS.map((step, index) => (
                        <motion.div
                          key={index}
                          className={`flex items-center justify-center space-x-2 text-sm ${
                            index <= currentStep ? "text-[#D4735F]" : "text-[#8B9DC3]/40"
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: index <= currentStep ? 1 : 0.3,
                            x: 0,
                          }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {index < currentStep ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : index === currentStep ? (
                            <Sparkles className="w-4 h-4" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-current" />
                          )}
                          <span>{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Error ── */}
        {stage === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-red-200/40 rounded-3xl shadow-xl">
              <CardContent className="p-12 text-center space-y-6">
                <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-[#2C2825]">Analysis Failed</p>
                  <p className="text-[#6B6560]">{error}</p>
                </div>
                <Button
                  onClick={reset}
                  className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#C66A56] hover:to-[#A5533F] text-white rounded-full px-6"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Results ── */}
        {stage === "complete" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnalysisResults result={result} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
