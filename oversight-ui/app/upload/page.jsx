"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Brain,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AnalysisResults from "@/components/AnalysisResults";
import { useUser } from "@clerk/nextjs"; // remove if not using Clerk

const ANALYSIS_STEPS = [
  "Reading PDF structure...",
  "Extracting line items and CPT codes...",
  "Benchmarking against national pricing data...",
  "Detecting billing anomalies...",
  "Generating dispute letter...",
];

export default function UploadPage() {
  const { user } = useUser(); // remove if not using Clerk

  const [stage, setStage] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(
    async (file) => {
      if (!file.name.endsWith(".pdf")) {
        setError("Please upload a PDF file.");
        setStage("error");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("File too large. Maximum size is 10MB.");
        setStage("error");
        return;
      }

      setStage("uploading");
      setError("");

      let step = 0;
      const stepInterval = setInterval(() => {
        step = Math.min(step + 1, ANALYSIS_STEPS.length - 1);
        setCurrentStep(step);
      }, 2500);

      setStage("analyzing");

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", user?.id ?? "anonymous");

        const res = await fetch("/api/analyze-bill", {
          method: "POST",
          body: formData,
        });

        clearInterval(stepInterval);

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Analysis failed");
        }

        const data = await res.json();

        setResult(data);
        setStage("complete");
      } catch (err) {
        clearInterval(stepInterval);
        setError(
          err?.message ||
            "Something went wrong. Please try again."
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
    <div className="min-h-screen bg-[#FDFCFB] pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">

        {stage !== "complete" && (
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-serif font-light text-[#2C2825] mb-3">
              Analyze Your Medical Bill
            </h1>
            <p className="text-[#6B6560] text-lg">
              Upload your PDF — results in under 60 seconds
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">

          {/* Upload */}
          {stage === "idle" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card
                className={`bg-white border-2 border-dashed rounded-3xl shadow-lg transition-all ${
                  dragOver
                    ? "border-[#D4735F] bg-[#D4735F]/5"
                    : "border-[#E4B08F]/40"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <CardContent className="p-16 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileInput}
                  />

                  <motion.div
                    className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#D4735F] to-[#B85A47] flex items-center justify-center mx-auto mb-6"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                    }}
                  >
                    <FileText className="w-12 h-12 text-white" />
                  </motion.div>

                  <h2 className="text-2xl mb-2">
                    {dragOver
                      ? "Drop it here!"
                      : "Drop your medical bill"}
                  </h2>

                  <Button className="bg-[#D4735F] text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Analyzing */}
          {(stage === "uploading" ||
            stage === "analyzing") && (
            <Card>
              <CardContent className="p-16 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Brain className="w-20 h-20 mx-auto mb-6" />
                </motion.div>

                <p>{ANALYSIS_STEPS[currentStep]}</p>
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {stage === "error" && (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <p>{error}</p>
                <Button onClick={reset}>Try Again</Button>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {stage === "complete" && result && (
            <AnalysisResults
              result={result}
              onReset={reset}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}