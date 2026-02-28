"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ArrowRight,
  Shield,
  TrendingUp,
  DollarSign,
  BarChart3,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* ─────────────── Config ─────────────── */

const SEVERITY_CONFIG = {
  Critical: {
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: <XCircle className="w-5 h-5 text-red-500" />,
  },
  High: {
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
  },
  Medium: {
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  },
  Low: {
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
  },
};

const RISK_CONFIG = {
  Critical: { color: "text-red-600", bg: "from-red-500 to-red-600", bar: "bg-red-500" },
  High: { color: "text-orange-500", bg: "from-orange-500 to-orange-600", bar: "bg-orange-500" },
  Medium: { color: "text-yellow-500", bg: "from-yellow-500 to-yellow-600", bar: "bg-yellow-500" },
  Low: { color: "text-green-500", bg: "from-green-500 to-green-600", bar: "bg-green-500" },
};

const TABS = [
  { id: "issues", label: "Issues", icon: <AlertTriangle className="w-4 h-4" /> },
  { id: "breakdown", label: "Breakdown", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "letter", label: "Dispute Letter", icon: <FileText className="w-4 h-4" /> },
];

const fmt = (n) => {
  const num = Number(n);
  return isNaN(num) ? "$0.00" : `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/* ─────────────── Issue Card ─────────────── */

function IssueCard({ issue, index }) {
  const [expanded, setExpanded] = useState(index === 0);
  const config = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG.Medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-2xl border ${config.border} ${config.bg} overflow-hidden`}
    >
      <button
        className="w-full p-5 flex items-start justify-between text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="font-semibold text-[#2C2825]">{issue.type}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.color} border ${config.border}`}>
                {issue.severity}
              </span>
            </div>
            <p className="text-sm text-[#6B6560] mt-1 truncate">{issue.line_item_description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
          {issue.overcharge_amount > 0 && (
            <span className="text-sm font-bold text-[#D4735F]">+{fmt(issue.overcharge_amount)}</span>
          )}
          {expanded ? <ChevronUp className="w-5 h-5 text-[#8B9DC3]" /> : <ChevronDown className="w-5 h-5 text-[#8B9DC3]" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-inherit pt-4 mx-5">
              <p className="text-sm text-[#2C2825] leading-relaxed">{issue.explanation}</p>

              {/* Billed vs Benchmark */}
              {(issue.billed_amount > 0 || issue.benchmark_amount > 0) && (
                <div className="flex space-x-4">
                  {issue.billed_amount > 0 && (
                    <div className="flex-1 bg-white/60 rounded-xl p-3">
                      <p className="text-xs text-[#8B9DC3]">Billed</p>
                      <p className="text-lg font-bold text-[#2C2825]">{fmt(issue.billed_amount)}</p>
                    </div>
                  )}
                  {issue.benchmark_amount > 0 && (
                    <div className="flex-1 bg-white/60 rounded-xl p-3">
                      <p className="text-xs text-[#8B9DC3]">Benchmark</p>
                      <p className="text-lg font-bold text-green-600">{fmt(issue.benchmark_amount)}</p>
                    </div>
                  )}
                  {issue.overcharge_amount > 0 && (
                    <div className="flex-1 bg-white/60 rounded-xl p-3">
                      <p className="text-xs text-[#8B9DC3]">Overcharge</p>
                      <p className="text-lg font-bold text-[#D4735F]">{fmt(issue.overcharge_amount)}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-start space-x-2 bg-white/60 rounded-xl p-3">
                <ArrowRight className="w-4 h-4 text-[#D4735F] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-[#8B9DC3] mb-1">Recommended Action</p>
                  <p className="text-sm text-[#2C2825]">{issue.action}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────── Line Item Row ─────────────── */

function LineItemRow({ item, index }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.03 }}
      className="border-b border-[#F7F5F2] hover:bg-[#F7F5F2]/50 transition-colors"
    >
      <td className="py-3 pr-4">
        <p className="text-sm font-medium text-[#2C2825]">{item.description}</p>
        {item.cpt_code && (
          <p className="text-xs text-[#8B9DC3] mt-0.5">CPT: {item.cpt_code}</p>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-[#6B6560]">{item.category || "—"}</td>
      <td className="py-3 px-4 text-sm text-[#6B6560] text-center">{item.quantity || 1}</td>
      <td className="py-3 px-4 text-sm text-[#6B6560] text-right">{fmt(item.unit_price)}</td>
      <td className="py-3 pl-4 text-sm font-semibold text-[#2C2825] text-right">{fmt(item.total_price)}</td>
    </motion.tr>
  );
}

/* ─────────────── Main Component ─────────────── */

export default function AnalysisResults({ result, onReset }) {
  const [letterCopied, setLetterCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("issues");

  const { extracted_bill = {}, analysis = {}, dispute_letter } = result;
  const riskConfig = RISK_CONFIG[analysis.risk_level] || RISK_CONFIG.Medium;
  const issues = analysis.issues || [];
  const lineItems = extracted_bill.line_items || [];
  const benchmarks = analysis.benchmarks || [];
  const nextSteps = analysis.next_steps || [];

  const handleCopyLetter = () => {
    if (!dispute_letter) return;
    navigator.clipboard.writeText(dispute_letter);
    setLetterCopied(true);
    setTimeout(() => setLetterCopied(false), 2000);
  };

  const handleDownloadLetter = () => {
    if (!dispute_letter) return;
    const blob = new Blob([dispute_letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oversight-dispute-${extracted_bill.provider?.replace(/\s+/g, "-") || "letter"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-white/90 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl shadow-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className={`w-8 h-8 ${riskConfig.color}`} />
                  <div>
                    <h2 className="text-2xl font-serif font-medium text-[#2C2825]">
                      {extracted_bill.provider || "Medical Bill Analysis"}
                    </h2>
                    {extracted_bill.date_of_service && (
                      <p className="text-sm text-[#8B9DC3]">
                        {extracted_bill.facility_type} • {extracted_bill.date_of_service}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-[#6B6560] leading-relaxed">{analysis.summary}</p>
              </div>

              {/* Risk Score */}
              <div className="flex-shrink-0 text-center bg-[#F7F5F2]/50 rounded-2xl p-6 min-w-[140px]">
                <p className={`text-4xl font-bold ${riskConfig.color}`}>{analysis.risk_score ?? "—"}</p>
                <p className="text-xs text-[#8B9DC3] mt-1">Risk Score</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className={`h-2 rounded-full ${riskConfig.bar} transition-all duration-1000`}
                    style={{ width: `${Math.min(analysis.risk_score || 0, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F7F5F2]">
              <div>
                <p className="text-xs text-[#8B9DC3]">Total Bill</p>
                <p className="text-xl font-bold text-[#2C2825]">{fmt(extracted_bill.total_bill)}</p>
              </div>
              <div>
                <p className="text-xs text-[#8B9DC3]">Insurance Paid</p>
                <p className="text-xl font-bold text-[#8B9DC3]">{fmt(extracted_bill.insurance_paid)}</p>
              </div>
              <div>
                <p className="text-xs text-[#8B9DC3]">Est. Overcharge</p>
                <p className="text-xl font-bold text-[#D4735F]">{fmt(analysis.estimated_overcharge)}</p>
              </div>
              <div>
                <p className="text-xs text-[#8B9DC3]">Potential Savings</p>
                <p className="text-xl font-bold text-green-600">{fmt(analysis.estimated_savings)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Tab Navigation ── */}
      <div className="flex space-x-2 bg-[#F7F5F2] p-1.5 rounded-xl">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.id === "letter" && !dispute_letter;
          return (
            <button
              key={tab.id}
              disabled={isDisabled}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-[#2C2825] shadow-sm"
                  : isDisabled
                  ? "text-[#8B9DC3]/40 cursor-not-allowed"
                  : "text-[#6B6560] hover:text-[#2C2825] hover:bg-white/50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === "issues" && issues.length > 0 && (
                <span className="bg-[#D4735F] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {issues.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {/* Issues Tab */}
        {activeTab === "issues" && (
          <motion.div
            key="issues"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {issues.length > 0 ? (
              issues.map((issue, i) => <IssueCard key={i} issue={issue} index={i} />)
            ) : (
              <Card className="bg-green-50 border border-green-200 rounded-2xl">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                  <p className="text-lg font-medium text-green-800">No issues detected</p>
                  <p className="text-sm text-green-600">Your bill appears to be correctly priced.</p>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            {nextSteps.length > 0 && (
              <Card className="bg-[#8B9DC3]/5 border border-[#8B9DC3]/20 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-serif font-medium text-[#2C2825] mb-4">Recommended Next Steps</h3>
                  <div className="space-y-3">
                    {nextSteps.map((step, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-[#8B9DC3] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm text-[#2C2825]">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Breakdown Tab */}
        {activeTab === "breakdown" && (
          <motion.div
            key="breakdown"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Line Items Table */}
            <Card className="bg-white/90 backdrop-blur-sm border border-[#E4B08F]/20 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <DollarSign className="w-5 h-5 text-[#D4735F]" />
                  <h3 className="text-lg font-serif font-medium text-[#2C2825]">Line Items</h3>
                  <span className="text-xs text-[#8B9DC3]">({lineItems.length} charges)</span>
                </div>

                {lineItems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-[#E4B08F]/20 text-xs text-[#8B9DC3] uppercase tracking-wider">
                          <th className="text-left py-3 pr-4">Service</th>
                          <th className="text-left py-3 px-4">Category</th>
                          <th className="text-center py-3 px-4">Qty</th>
                          <th className="text-right py-3 px-4">Unit Price</th>
                          <th className="text-right py-3 pl-4">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems.map((item, i) => (
                          <LineItemRow key={i} item={item} index={i} />
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-[#E4B08F]/20">
                          <td colSpan={4} className="py-3 text-right text-sm font-bold text-[#2C2825]">
                            Total
                          </td>
                          <td className="py-3 pl-4 text-right text-lg font-bold text-[#2C2825]">
                            {fmt(extracted_bill.total_bill)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-[#8B9DC3] text-center py-8">
                    No individual line items were extracted from this bill.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Benchmark Comparison */}
            {benchmarks.length > 0 && (
              <Card className="bg-white/90 backdrop-blur-sm border border-[#E4B08F]/20 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-[#8B9DC3]" />
                    <h3 className="text-lg font-serif font-medium text-[#2C2825]">Benchmark Comparison</h3>
                  </div>
                  <div className="space-y-4">
                    {benchmarks.map((bm, i) => {
                      const billed = Number(bm.billed) || 0;
                      const natAvg = Number(bm.national_avg) || 0;
                      const maxVal = Math.max(billed, natAvg, 1);
                      const isOver = billed > natAvg * 1.1;

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-[#2C2825]">{bm.service}</p>
                            {bm.percentile && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${isOver ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                                {bm.percentile}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center space-x-3">
                              <span className="text-xs text-[#8B9DC3] w-20">Billed</span>
                              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-3 rounded-full transition-all duration-700 ${isOver ? "bg-[#D4735F]" : "bg-[#8B9DC3]"}`}
                                  style={{ width: `${(billed / maxVal) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold w-24 text-right">{fmt(billed)}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs text-[#8B9DC3] w-20">Nat. Avg</span>
                              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div
                                  className="h-3 rounded-full bg-green-400 transition-all duration-700"
                                  style={{ width: `${(natAvg / maxVal) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm w-24 text-right text-green-600">{fmt(natAvg)}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bill Info */}
            <Card className="bg-[#F7F5F2]/50 border border-[#E4B08F]/20 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-[#8B9DC3] mb-3 uppercase tracking-wider">Bill Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {[
                    ["Provider", extracted_bill.provider],
                    ["Patient", extracted_bill.patient_name],
                    ["Date of Service", extracted_bill.date_of_service],
                    ["Facility Type", extracted_bill.facility_type],
                    ["Insurance Paid", fmt(extracted_bill.insurance_paid)],
                    ["Patient Responsibility", fmt(extracted_bill.patient_responsibility)],
                  ]
                    .filter(([, v]) => v && v !== "$0.00" && v !== "null")
                    .map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs text-[#8B9DC3]">{label}</p>
                        <p className="font-medium text-[#2C2825]">{value}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Letter Tab */}
        {activeTab === "letter" && dispute_letter && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-[#E4B08F]/20 rounded-2xl shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-[#D4735F]" />
                    <h3 className="text-lg font-serif font-medium text-[#2C2825]">Dispute Letter</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLetter}
                      className="rounded-lg border-[#E4B08F]/40"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {letterCopied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleDownloadLetter}
                      className="rounded-lg bg-gradient-to-r from-[#D4735F] to-[#B85A47] text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="bg-[#F7F5F2]/50 rounded-xl p-6 border border-[#E4B08F]/10">
                  <pre className="whitespace-pre-wrap text-sm text-[#2C2825] leading-relaxed font-sans">
                    {dispute_letter}
                  </pre>
                </div>

                <p className="text-xs text-[#8B9DC3] text-center">
                  Replace [PATIENT NAME], [ADDRESS], and [DATE] with your information before sending.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Analyze Another ── */}
      <div className="text-center pt-4">
        <Button
          variant="ghost"
          onClick={onReset}
          className="text-[#8B9DC3] hover:text-[#2C2825] hover:bg-[#F7F5F2]"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Analyze Another Bill
        </Button>
      </div>
    </div>
  );
}
