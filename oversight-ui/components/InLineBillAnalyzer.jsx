"use client";

// components/InlineBillAnalyzer.jsx
// Drop this where your fake PDF upload demo was in page.jsx
// It matches the existing OverSight card design exactly

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Brain,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Upload,
  TrendingUp,
  Star,
  Zap,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ArrowRight,
  Shield,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────
const ANALYSIS_STEPS = [
  "Reading PDF structure...",
  "Extracting line items and CPT codes...",
  "Benchmarking against national pricing data...",
  "Detecting billing anomalies...",
  "Generating dispute letter...",
];

const SEVERITY_CONFIG = {
  Critical: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
  High:     { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-500" },
  Medium:   { color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-500" },
  Low:      { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400" },
};

const RISK_COLORS = {
  Critical: { text: "text-red-600",    ring: "#ef4444" },
  High:     { text: "text-orange-500", ring: "#f97316" },
  Medium:   { text: "text-yellow-500", ring: "#eab308" },
  Low:      { text: "text-green-500",  ring: "#22c55e" },
};

// ─────────────────────────────────────────────
// Issue Card
// ─────────────────────────────────────────────
function IssueCard({ issue, index }) {
  const [expanded, setExpanded] = useState(index === 0);
  const cfg = SEVERITY_CONFIG[issue.severity] ?? SEVERITY_CONFIG.Medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden`}
    >
      <button
        className="w-full p-5 flex items-center justify-between text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <span className="font-semibold text-[#2C2825] text-sm">{issue.type}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                {issue.severity}
              </span>
            </div>
            <p className="text-xs text-[#6B6560] mt-0.5 truncate">{issue.line_item_description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0 ml-3">
          {issue.overcharge_amount > 0 && (
            <span className="text-sm font-bold text-[#D4735F]">
              +${issue.overcharge_amount.toLocaleString()}
            </span>
          )}
          {expanded
            ? <ChevronUp className="w-4 h-4 text-[#8B9DC3]" />
            : <ChevronDown className="w-4 h-4 text-[#8B9DC3]" />
          }
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-5 pb-5 space-y-3"
          >
            {issue.billed_amount > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Billed", value: issue.billed_amount, color: "text-[#D4735F]" },
                  { label: "Benchmark", value: issue.benchmark_amount, color: "text-[#8B9DC3]" },
                  { label: "Overcharge", value: issue.overcharge_amount, color: "text-green-600" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/70 rounded-xl p-3 text-center">
                    <p className="text-xs text-[#8B9DC3] mb-1">{stat.label}</p>
                    <p className={`font-bold text-sm ${stat.color}`}>${stat.value?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-[#2C2825] mb-1">What happened</p>
              <p className="text-sm text-[#6B6560] leading-relaxed">{issue.explanation}</p>
            </div>
            <div className="flex items-start space-x-2 bg-white/60 rounded-xl p-3">
              <ArrowRight className="w-3.5 h-3.5 text-[#D4735F] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#2C2825]">
                <span className="font-medium">Action: </span>{issue.action}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Results Panel
// ─────────────────────────────────────────────
function ResultsPanel({ result, onReset }) {
  const [activeTab, setActiveTab] = useState("issues");
  const [letterCopied, setLetterCopied] = useState(false);

  const { extracted_bill, analysis, dispute_letter } = result;
  const riskCfg = RISK_COLORS[analysis?.risk_level] ?? RISK_COLORS.Medium;

  const copyLetter = () => {
    navigator.clipboard.writeText(dispute_letter ?? "");
    setLetterCopied(true);
    setTimeout(() => setLetterCopied(false), 2000);
  };

  const downloadLetter = () => {
    const blob = new Blob([dispute_letter ?? ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oversight-dispute-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* ── Summary Header ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-white rounded-2xl border border-[#E4B08F]/20 overflow-hidden shadow-md">
          <div
            className="h-1.5"
            style={{
              background: `linear-gradient(to right, ${riskCfg.ring}, ${riskCfg.ring}88)`
            }}
          />
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Shield className={`w-4 h-4 ${riskCfg.text}`} />
                  <span className={`text-xs font-semibold ${riskCfg.text}`}>
                    {analysis?.risk_level} Risk
                  </span>
                </div>
                <h3 className="text-xl font-serif font-medium text-[#2C2825] mb-2">
                  {extracted_bill?.provider || "Your Medical Bill"}
                </h3>
                <p className="text-sm text-[#6B6560] leading-relaxed">{analysis?.summary}</p>
              </div>

              {/* Risk Ring */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#F7F5F2" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="38" fill="none"
                      stroke={riskCfg.ring}
                      strokeWidth="10"
                      strokeDasharray={`${(analysis?.risk_score / 100) * 239} 239`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xl font-bold ${riskCfg.text}`}>{analysis?.risk_score}</span>
                  </div>
                </div>
                <p className="text-xs text-[#8B9DC3] mt-1">Risk Score</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#F7F5F2]">
              <div className="text-center">
                <p className="text-xl font-bold text-[#D4735F]">
                  ${analysis?.estimated_overcharge?.toLocaleString()}
                </p>
                <p className="text-xs text-[#8B9DC3] mt-0.5">Overcharge</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#8B9DC3]">
                  {analysis?.issues?.length}
                </p>
                <p className="text-xs text-[#8B9DC3] mt-0.5">Issues</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-600">
                  ${analysis?.estimated_savings?.toLocaleString()}
                </p>
                <p className="text-xs text-[#8B9DC3] mt-0.5">Potential Savings</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex space-x-1.5 bg-[#F7F5F2] rounded-xl p-1">
        {[
          { key: "issues", label: `Issues (${analysis?.issues?.length ?? 0})` },
          { key: "breakdown", label: "Line Items" },
          { key: "letter", label: "Dispute Letter" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-white text-[#2C2825] shadow-sm"
                : "text-[#6B6560] hover:text-[#2C2825]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">

        {/* Issues */}
        {activeTab === "issues" && (
          <motion.div key="issues" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {analysis?.issues?.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-green-700">No major issues detected</p>
                <p className="text-sm text-green-600 mt-1">Your bill appears within normal ranges.</p>
              </div>
            ) : (
              analysis.issues.map((issue, i) => <IssueCard key={i} issue={issue} index={i} />)
            )}

            {analysis?.next_steps?.length > 0 && (
              <div className="bg-white border border-[#E4B08F]/20 rounded-2xl p-5">
                <h4 className="font-semibold text-[#2C2825] text-sm mb-3 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#D4735F]" />
                  <span>Your Next Steps</span>
                </h4>
                <div className="space-y-2">
                  {analysis.next_steps.map((step, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <span className="w-5 h-5 rounded-full bg-[#D4735F]/10 text-[#D4735F] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-[#6B6560]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Line Items */}
        {activeTab === "breakdown" && (
          <motion.div key="breakdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-white border border-[#E4B08F]/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#F7F5F2]">
                      <th className="text-left p-3 text-[#6B6560] font-medium">Service</th>
                      <th className="text-left p-3 text-[#6B6560] font-medium hidden sm:table-cell">CPT</th>
                      <th className="text-right p-3 text-[#6B6560] font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extracted_bill?.line_items?.map((item, i) => (
                      <tr key={i} className="border-t border-[#F7F5F2] hover:bg-[#FDFCFB]">
                        <td className="p-3 text-[#2C2825]">{item.description}</td>
                        <td className="p-3 text-[#8B9DC3] hidden sm:table-cell">{item.cpt_code ?? "—"}</td>
                        <td className="p-3 text-right font-medium text-[#2C2825]">
                          ${item.total_price?.toLocaleString() ?? "—"}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-[#E4B08F]/30 bg-[#F7F5F2]">
                      <td colSpan={2} className="p-3 font-semibold text-[#2C2825]">Total</td>
                      <td className="p-3 text-right font-bold text-[#2C2825]">
                        ${extracted_bill?.total_bill?.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dispute Letter */}
        {activeTab === "letter" && (
          <motion.div key="letter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {dispute_letter ? (
              <div className="bg-white border border-[#E4B08F]/20 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[#F7F5F2] bg-[#FDFCFB]">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#D4735F]" />
                    <span className="text-sm font-medium text-[#2C2825]">Dispute Letter</span>
                    <span className="text-xs text-[#8B9DC3]">— fill in placeholders before sending</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={copyLetter} className="text-xs h-7 px-2">
                      <Copy className="w-3 h-3 mr-1" />
                      {letterCopied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={downloadLetter}
                      className="text-xs h-7 px-2 bg-gradient-to-r from-[#D4735F] to-[#B85A47] text-white"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <pre className="whitespace-pre-wrap text-xs text-[#2C2825] font-mono leading-relaxed bg-[#F7F5F2] rounded-xl p-4 max-h-80 overflow-y-auto">
                    {dispute_letter}
                  </pre>
                </div>
                <div className="p-3 bg-[#E4B08F]/5 border-t border-[#E4B08F]/20">
                  <p className="text-xs text-[#8B9DC3]">
                    ⚠️ Replace [DATE], [PATIENT NAME], and [ADDRESS] before sending.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#F7F5F2] border border-[#E4B08F]/20 rounded-2xl p-6 text-center">
                <p className="text-sm text-[#6B6560]">No dispute letter needed — no significant issues detected.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset */}
      <div className="text-center pt-2">
        <button
          onClick={onReset}
          className="text-sm text-[#8B9DC3] hover:text-[#D4735F] transition-colors underline underline-offset-2"
        >
          ← Analyze another bill
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Export — drop this into page.jsx
// ─────────────────────────────────────────────
export default function InlineBillAnalyzer() {
  const [stage, setStage] = useState("idle"); // idle | analyzing | complete | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(async (file) => {
    if (!file?.name?.endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      setStage("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum 10MB.");
      setStage("error");
      return;
    }

    setStage("analyzing");
    setError("");
    setCurrentStep(0);

    // Animate steps while waiting
    let step = 0;
    const stepInterval = setInterval(() => {
      step = Math.min(step + 1, ANALYSIS_STEPS.length - 1);
      setCurrentStep(step);
    }, 3000);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", "anonymous");

      const res = await fetch("/api/analyze-bill", {
        method: "POST",
        body: formData,
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Analysis failed");
      }

      const data = await res.json();
      setResult(data);
      setStage("complete");
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message || "Something went wrong. Please try again.");
      setStage("error");
    }
  }, []);

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
    <Card className="bg-white/90 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl p-8 shadow-xl">
      <CardContent className="p-0">
        <AnimatePresence mode="wait">

          {/* ── Idle: Drop Zone ── */}
          {stage === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center space-y-6">
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer ${
                    dragOver
                      ? "border-[#D4735F] bg-[#D4735F]/5 scale-[1.01]"
                      : "border-[#E4B08F]/40 bg-[#F7F5F2]/30 hover:bg-[#F7F5F2]/50"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileInput}
                  />
                  <div className="flex flex-col items-center space-y-4 pointer-events-none">
                    <motion.div
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4735F] to-[#B85A47] flex items-center justify-center shadow-lg"
                      animate={{ y: dragOver ? 0 : [0, -8, 0] }}
                      transition={{ duration: 2, repeat: dragOver ? 0 : Infinity, ease: "easeInOut" }}
                    >
                      <FileText className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-serif font-medium text-[#2C2825]">
                        {dragOver ? "Drop it here!" : "Drop your medical bill here"}
                      </h3>
                      <p className="text-[#6B6560]">or click to browse • PDF files only</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-[#8B9DC3]">
                      <CheckCircle className="w-4 h-4" />
                      <span>Secure • Private • No account required</span>
                    </div>
                  </div>
                </div>

                {/* Sample bills */}
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-sm text-[#6B6560]">Try a sample:</span>
                  {[
                    { label: "Emergency Room Bill", name: "emergency-room-bill.pdf" },
                    { label: "Surgery Invoice", name: "surgery-invoice.pdf" },
                  ].map((sample) => (
                    <React.Fragment key={sample.name}>
                      <button
                        onClick={() => {
                          // Create a dummy file to show the analyzing state
                          // In production these would be real sample PDFs from your public folder
                          const dummyFile = new File(
                            [new Uint8Array(100)],
                            sample.name,
                            { type: "application/pdf" }
                          );
                          processFile(dummyFile);
                        }}
                        className="text-sm text-[#D4735F] hover:text-[#B85A47] underline underline-offset-2 transition-colors"
                      >
                        {sample.label}
                      </button>
                      {sample.name === "emergency-room-bill.pdf" && (
                        <span className="text-[#E4B08F]">•</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Analyzing ── */}
          {stage === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-16 h-16 text-[#8B9DC3]" />
              </motion.div>

              <div className="text-center space-y-2">
                <p className="text-2xl font-serif font-medium text-[#2C2825]">
                  Analyzing your bill...
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentStep}
                    className="text-[#6B6560]"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {ANALYSIS_STEPS[currentStep]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Progress dots */}
              <div className="flex space-x-2">
                {ANALYSIS_STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`rounded-full transition-all duration-500 ${
                      i <= currentStep ? "w-8 h-2.5 bg-[#D4735F]" : "w-2.5 h-2.5 bg-[#E4B08F]/30"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-[#8B9DC3]">Powered by Modal + GPT-4 · typically 20–40 sec</p>
            </motion.div>
          )}

          {/* ── Error ── */}
          {stage === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-4"
            >
              <AlertCircle className="w-14 h-14 text-red-400" />
              <div className="text-center">
                <p className="text-lg font-serif font-medium text-red-700 mb-1">Analysis Failed</p>
                <p className="text-sm text-red-600 max-w-sm">{error}</p>
              </div>
              <Button
                onClick={reset}
                className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] text-white"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {/* ── Results ── */}
          {stage === "complete" && result && (
            <motion.div key="complete" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <ResultsPanel result={result} onReset={reset} />
            </motion.div>
          )}

        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
