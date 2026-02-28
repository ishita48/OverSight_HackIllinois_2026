"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Play,
  Pause,
  ArrowRight,
  Users,
  Sparkles,
  Heart,
  Lightbulb,
  Target,
  Share2,
  Quote,
  Brain,
  Zap,
  CheckCircle,
  Star,
  MessageSquare,
  TrendingUp,
  Book,
  Flame,
  ExternalLink,
  FileText,
  Search,       
  AlertTriangle,
  XCircle,    
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VapiWidget from "@/components/vapi";

export default function LandingPage() {
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentTruth, setCurrentTruth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveAnimation, setWaveAnimation] = useState(Array(40).fill(0));
  const [playingText, setPlayingText] = useState(0);

  const [uploadState, setUploadState] = useState({
    isUploading: false,
    isComplete: false,
    fileName: '',
  });

  const [currentConversationStep, setCurrentConversationStep] = useState(0);

  const [currentCaseStudy, setCurrentCaseStudy] = useState(0);

  // Voice demo texts that cycle through
  const voiceDemoTexts = [
    "I didn’t even understand what half of these charges meant.",
    "I assumed insurance handled it — until I saw the balance.",
    "I almost paid it without questioning anything.",
    "It felt easier to accept the bill than to challenge it.",
    "I just wanted to know if this was normal.",
  ];

  // Rotating founder truths
  const founderTruths = [
    "I was billed $1,320 above the benchmark — and I almost paid it without questioning anything.",
    "I didn’t realize insurance should have covered that entire charge.",
    "The procedure was overcoded. I saved $1,870 after reviewing the breakdown.",
    "They listed the visit as out-of-network — it wasn’t.",
    "I almost paid $980 more than I needed to. Seeing the analysis changed everything.",
  ];

  // Add this conversation data array right after your voiceDemoTexts array
const conversationSteps = [
  {
    sender: 'ai',
    text: "Hi! I'm your OverSight AI assistant. I'll ask you a few quick questions to help analyze your medical bill accurately. Ready to start?",
  },
  {
    sender: 'user',
    text: "Yes, let's do it.",
  },
  {
    sender: 'ai',
    text: "Great! First, what type of healthcare facility did you visit? (Emergency Room, Urgent Care, Hospital, Clinic, etc.)",
    analysis: "Identifying facility type for benchmarking...",
  },
  {
    sender: 'user',
    text: "It was an Emergency Room visit at St. Mary's Hospital.",
  },
  {
    sender: 'ai',
    text: "Thank you. What was the primary reason for your visit?",
    analysis: "Categorizing visit type for accurate pricing comparison...",
  },
  {
    sender: 'user',
    text: "I had severe chest pain and difficulty breathing.",
  },
  {
    sender: 'ai',
    text: "I understand. Did they perform any tests or procedures? (X-rays, CT scans, blood work, EKG, etc.)",
    analysis: "Mapping procedures to CPT codes...",
  },
  {
    sender: 'user',
    text: "Yes, they did an EKG, chest X-ray, and blood tests.",
  },
  {
    sender: 'ai',
    text: "Perfect. Last question: Were you admitted or discharged the same day?",
    analysis: "Determining billing category...",
  },
  {
    sender: 'user',
    text: "Discharged the same day after about 4 hours.",
  },
  {
    sender: 'ai',
    text: "Excellent! I have everything I need. I'm now cross-referencing your visit details with national pricing benchmarks, insurance coverage standards, and common billing errors for ER visits. Your personalized analysis will be ready in just a moment...",
    analysis: "Analysis complete • Report generated • 3 potential issues flagged",
  },
];

// Add this useEffect to animate through the conversation
useEffect(() => {
  if (!isPlaying) return;

  if (currentConversationStep < conversationSteps.length - 1) {
    const timer = setTimeout(() => {
      setCurrentConversationStep((prev) => prev + 1);
    }, 2500); // Each message appears after 2.5 seconds

    return () => clearTimeout(timer);
  }
}, [isPlaying, currentConversationStep, conversationSteps.length]);

// Modify the existing isPlaying useEffect or add a reset when playing starts
useEffect(() => {
  if (isPlaying) {
    setCurrentConversationStep(0);
  }
}, [isPlaying]);


  // Sample testimonials
  const testimonials = [
    {
      quote:
        "BackStory helped me find the words I'd been searching for. My pitch went from forgettable to unforgettable.",
      author: "Sarah Chen",
      role: "Founder, HealthTech Startup",
      sessions: 12,
    },
    {
      quote:
        "Finally, a place where my founder journey makes sense. Not just the wins, but the real story.",
      author: "Marcus Rivera",
      role: "CEO, AI Platform",
      sessions: 8,
    },
    {
      quote:
        "I thought I knew my 'why' until BackStory helped me discover my truth. Game changer.",
      author: "Priya Patel",
      role: "Founder, EdTech",
      sessions: 15,
    },
  ];

  

const caseStudies = [
    {
      title: "Emergency Room Visit",
      location: "St. Mary's Medical Center, Los Angeles",
      icon: <Heart className="w-8 h-8 text-white" />,
      color1: "#D4735F",
      color2: "#B85A47",
      totalBill: 4820,
      overcharge: 980,
      savingsPercent: 20,
      issuesFound: 3,
      issue: "CPT code 99285 (Level 5 ER visit) was upcoded...",
      details: [
        "Visit duration and complexity did not support Level 5 coding",
        "National benchmark for similar ER visits: $3,840 ± $200",
        "Provider's charge is 25% above regional average",
        "Two duplicate facility fees were also identified"
      ]
    },
    {
      title: "Outpatient Surgery",
      location: "Regional Surgical Center, Chicago",
      icon: <Zap className="w-8 h-8 text-white" />,
      color1: "#8B9DC3",
      color2: "#6B7FA0",
      totalBill: 12350,
      overcharge: 2870,
      savingsPercent: 23,
      issuesFound: 4,
      issue: "Anesthesia time was billed for 4.5 hours when the actual procedure lasted 2 hours. Additionally, 'operating room time' included 90 minutes of pre-op preparation that should not be separately billable.",
      details: [
        "Anesthesia overcoded by 2.5 hours at $450/hour",
        "Operating room charges inflated by including non-billable prep time",
        "Surgical assistant fee charged despite in-network coverage exclusion",
        "Benchmark comparison shows 23% above typical pricing"
      ]
    },
    {
      title: "Diagnostic Lab Tests",
      location: "Memorial Hospital Lab, Boston",
      icon: <Target className="w-8 h-8 text-white" />,
      color1: "#E4B08F",
      color2: "#D49C6B",
      totalBill: 1870,
      overcharge: 640,
      savingsPercent: 34,
      issuesFound: 2,
      issue: "Multiple tests were billed individually when they should have been billed as a bundled panel, resulting in significant overcharges. The Comprehensive Metabolic Panel was unbundled into 14 separate line items.",
      details: [
        "CMP panel should cost ~$45, but unbundled charges totaled $280",
        "Lipid panel similarly unbundled: $180 vs standard $35",
        "Both tests covered at 100% under preventive care but billed as diagnostic",
        "Insurance should have been billed as in-network, not out-of-network"
      ]
    },
    {
      title: "Urgent Care Visit",
      location: "QuickCare Clinic, Houston",
      icon: <Sparkles className="w-8 h-8 text-white" />,
      color1: "#D4735F",
      color2: "#E4B08F",
      totalBill: 1320,
      overcharge: 485,
      savingsPercent: 37,
      issuesFound: 3,
      issue: "Visit coded as 'High Complexity' (99214) when documentation shows it was a straightforward case requiring only a basic examination and prescription. Should have been coded as 99213.",
      details: [
        "Medical decision-making was low complexity, not high",
        "No diagnostic testing or specialist consultation performed",
        "X-ray charge included but no X-ray was actually taken (clerical error)",
        "Benchmark for similar urgent care visits: $835 maximum"
      ]
    }
  ];

  // Rotate truths every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTruth((prev) => (prev + 1) % founderTruths.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [founderTruths.length]);

  // Rotate testimonials every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Wave animation for voice player
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setWaveAnimation((prev) => prev.map(() => Math.random() * 60 + 10));
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Cycle through voice demo texts when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPlayingText((prev) => (prev + 1) % voiceDemoTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, voiceDemoTexts.length]);

    useEffect(() => {
    if (!isPlaying) return;

    if (currentConversationStep < conversationSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentConversationStep((prev) => prev + 1);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentConversationStep, conversationSteps.length]);

  useEffect(() => {
    if (isPlaying) {
      setCurrentConversationStep(0);
    }
  }, [isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCaseStudy((prev) => (prev + 1) % caseStudies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [caseStudies.length]);

  const handleStartSession = () => {
    router.push("/sign-up");
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F2] via-transparent to-[#F7F5F2] opacity-60" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#E4B08F]/8 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#8B9DC3]/6 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#D4735F]/4 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 border-b border-[#F7F5F2] bg-[#FDFCFB]/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4735F] to-[#B85A47] flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-logo text-[#2C2825]">
                OverSight
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#how-it-works"
                className="text-[#6B6560] hover:text-[#2C2825] transition-colors"
              >
                How it works
              </a>
              <a
                href="#stories"
                className="text-[#6B6560] hover:text-[#2C2825] transition-colors"
              >
                Past Analysis
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleSignIn}
                className="text-[#6B6560] hover:text-[#2C2825] hover:bg-[#F7F5F2]"
              >
                Sign In
              </Button>
              <Button
                onClick={handleStartSession}
                className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#C66A56] hover:to-[#A5533F] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Upload Your Bill
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h1
                className="text-5xl lg:text-7xl font-serif font-light text-[#2C2825] leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Clarity
                <br />
                <span className="bg-gradient-to-r from-[#D4735F] via-[#E4B08F] to-[#8B9DC3] bg-clip-text text-transparent">
                  beyond the bill
                </span>
              </motion.h1>

              <motion.p
                className="text-xl lg:text-2xl text-[#6B6560] leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                When healthcare pricing feels confusing, clarity matters.
                OverSight turns complex medical bills into clear, structured insight 
                revealing potential overcharges and opportunities to save
              </motion.p>

              <motion.p
                className="text-lg text-[#8B9DC3] italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Built for transparency. Designed for protection. 
              </motion.p>
            </div>

            {/* CTA */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                onClick={handleStartSession}
                className="group relative bg-gradient-to-r from-[#D4735F] to-[#B85A47] 
                          hover:from-[#C66A56] hover:to-[#A5533F] text-white 
                          px-8 py-6 text-lg font-medium rounded-2xl 
                          transition-all duration-300 ease-out
                          hover:scale-105 hover:shadow-2xl hover:shadow-[#D4735F]/30"
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >

                  </motion.div>
                  <span>Run OverSight</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              className="flex items-center space-x-8 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4735F] to-[#8B9DC3] border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-[#6B6560] ml-3">
                  See how others are saving on thier medical bills
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Rotating Quote */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl p-8 shadow-xl">
              <CardContent className="p-0">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Quote className="w-8 h-8 text-[#D4735F]" />
                    <span className="text-lg font-serif font-medium text-[#2C2825]">
                      Real patients. Real savings.
                    </span>
                  </div>

                  <div className="min-h-[120px] flex items-center">
                    <AnimatePresence mode="wait"> 
                      <motion.p
                        key={currentTruth}
                        className="text-xl font-light text-[#2C2825] leading-relaxed italic"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8 }}
                      >
                        &ldquo;{founderTruths[currentTruth]}&rdquo;
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between text-sm text-[#8B9DC3]">
                    <span>— Anonymous patients via OverSight</span>
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Session logs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        className="py-20 px-6 relative z-10"
        style={{ backgroundColor: "#F7F5F2" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-light text-[#2C2825] mb-6">
              How it works
            </h2>
            <p className="text-xl text-[#6B6560] max-w-3xl mx-auto leading-relaxed">
              Four simple steps to transform your confusing medical bill into 
              clear, actionable insights
            </p>
          </motion.div>
          
                    {/* Interactive PDF Upload Demo */}
          <motion.div
            className="max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl p-8 shadow-xl">
              <CardContent className="p-0">
                <div className="text-center space-y-6">
                  {/* Upload Area */}
                  <div className="relative min-h-[280px] flex items-center justify-center">
                    {/* Initial Upload State */}
                    {!uploadState.isUploading && !uploadState.isComplete && (
                      <motion.div
                        className="border-2 border-dashed border-[#E4B08F]/40 rounded-2xl p-12 bg-[#F7F5F2]/30 hover:bg-[#F7F5F2]/50 transition-all duration-300 cursor-pointer group w-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <input
                          type="file"
                          accept=".pdf"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const file = e.target.files[0];
                              setUploadState({ 
                                isUploading: true, 
                                isComplete: false,
                                fileName: file.name 
                              });
                              
                              // Simulate processing time
                              setTimeout(() => {
                                setUploadState({ 
                                  isUploading: false, 
                                  isComplete: true,
                                  fileName: file.name 
                                });
                              }, 3000);
                            }
                          }}
                        />
                        
                        <div className="flex flex-col items-center space-y-4">
                          <motion.div
                            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4735F] to-[#B85A47] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                            animate={{
                              y: [0, -8, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <FileText className="w-10 h-10 text-white" />
                          </motion.div>

                          <div className="space-y-2">
                            <h3 className="text-2xl font-serif font-medium text-[#2C2825]">
                              Drop your medical bill here
                            </h3>
                            <p className="text-[#6B6560]">
                              or click to browse • PDF files only
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 text-sm text-[#8B9DC3]">
                            <CheckCircle className="w-4 h-4" />
                            <span>Secure • Private • No account required</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Processing Animation */}
                    {uploadState.isUploading && (
                      <motion.div
                        className="flex flex-col items-center justify-center space-y-6 w-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Brain className="w-16 h-16 text-[#8B9DC3]" />
                        </motion.div>
                        
                        <div className="text-center space-y-3">
                          <p className="text-2xl font-serif font-medium text-[#2C2825]">
                            Analyzing your bill...
                          </p>
                          <p className="text-[#6B6560]">
                            Extracting CPT codes and pricing data
                          </p>
                          
                          {/* Progress Steps */}
                          <div className="pt-4 space-y-2">
                            {[
                              "Reading PDF structure",
                              "Extracting line items",
                              "Benchmarking prices",
                            ].map((step, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center justify-center space-x-2 text-sm text-[#8B9DC3]"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.8 }}
                              >
                                <Sparkles className="w-4 h-4" />
                                <span>{step}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Success State */}
                    {uploadState.isComplete && (
                      <motion.div
                        className="flex flex-col items-center justify-center space-y-6 w-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 200, 
                            damping: 15 
                          }}
                        >
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4735F] to-[#B85A47] flex items-center justify-center shadow-xl">
                            <CheckCircle className="w-12 h-12 text-white" />
                          </div>
                        </motion.div>

                        <div className="text-center space-y-3">
                          <p className="text-2xl font-serif font-medium text-[#2C2825]">
                            Analysis Complete!
                          </p>
                          <p className="text-[#6B6560]">
                            {uploadState.fileName}
                          </p>
                          
                          <div className="pt-4 space-y-2">
                            <div className="flex items-center justify-center space-x-2 text-sm">
                              <div className="px-4 py-2 rounded-lg bg-[#D4735F]/10 text-[#D4735F] font-medium">
                                3 potential overcharges detected
                              </div>
                            </div>
                            <div className="flex items-center justify-center space-x-2 text-sm">
                              <div className="px-4 py-2 rounded-lg bg-[#8B9DC3]/10 text-[#8B9DC3] font-medium">
                                Estimated savings: $847
                              </div>
                            </div>
                          </div>

                          <div className="pt-4">
                            <Button
                              onClick={() => {
                                setUploadState({ 
                                  isUploading: false, 
                                  isComplete: false,
                                  fileName: '' 
                                });
                              }}
                              className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#C66A56] hover:to-[#A5533F] text-white"
                            >
                              Try Another Bill
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Sample Files - Only show in initial state */}
                  {!uploadState.isUploading && !uploadState.isComplete && (
                    <div className="flex items-center justify-center space-x-4 pt-4">
                      <span className="text-sm text-[#6B6560]">Try a sample:</span>
                      <button 
                        onClick={() => {
                          setUploadState({ 
                            isUploading: true, 
                            isComplete: false,
                            fileName: 'emergency-room-bill.pdf' 
                          });
                          setTimeout(() => {
                            setUploadState({ 
                              isUploading: false, 
                              isComplete: true,
                              fileName: 'emergency-room-bill.pdf' 
                            });
                          }, 3000);
                        }}
                        className="text-sm text-[#D4735F] hover:text-[#B85A47] underline underline-offset-2 transition-colors"
                      >
                        Emergency Room Bill
                      </button>
                      <span className="text-[#E4B08F]">•</span>
                      <button 
                        onClick={() => {
                          setUploadState({ 
                            isUploading: true, 
                            isComplete: false,
                            fileName: 'surgery-invoice.pdf' 
                          });
                          setTimeout(() => {
                            setUploadState({ 
                              isUploading: false, 
                              isComplete: true,
                              fileName: 'surgery-invoice.pdf' 
                            });
                          }, 3000);
                        }}
                        className="text-sm text-[#D4735F] hover:text-[#B85A47] underline underline-offset-2 transition-colors"
                      >
                        Surgery Invoice
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>


          {/* Interactive AI Voice Assistant */}
          <motion.div
            className="max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl p-8 shadow-xl">
              <CardContent className="p-0">
                <div className="space-y-6">
                  {/* Section Header */}
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-serif font-medium text-[#2C2825]">
                      Talk to Stella
                    </h3>
                    <p className="text-[#6B6560] max-w-lg mx-auto">
                      Our AI voice assistant can walk you through your medical bill
                      and help identify potential overcharges in real time.
                    </p>
                  </div>

                  {/* Vapi Voice Widget */}
                  <VapiWidget />

                  {/* Trust indicators */}
                  <div className="flex items-center justify-center space-x-6 text-xs text-[#8B9DC3]">
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>HIPAA compliant</span>
                    </div>
                    <span className="text-[#E4B08F]">•</span>
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>No recordings stored</span>
                    </div>
                    <span className="text-[#E4B08F]">•</span>
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>End-to-end encrypted</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>


                              <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Upload Your Bill",
                description:
                  "Simply upload your medical bill PDF. No account needed. Our AI instantly begins extracting CPT codes, line items, and pricing data.",
                icon: <FileText className="w-8 h-8" />,
                color: "from-[#D4735F] to-[#B85A47]",
              },
              {
                step: "02",
                title: "Talk Through It",
                description:
                  "Our custom AI bot asks targeted questions about your healthcare visit, procedures, and concerns. Your answers help us build the most accurate and personalized report.",
                icon: <Mic className="w-8 h-8" />,
                color: "from-[#E4B08F] to-[#D49C6B]",
              },
              {
                step: "03",
                title: "AI Analyzes Everything",
                description:
                  "Our multi-stage inference pipeline benchmarks each charge against national pricing data, detects anomalies, and calculates your risk index.",
                icon: <Brain className="w-8 h-8" />,
                color: "from-[#8B9DC3] to-[#6B7FA0]",
              },
              {
                step: "04",
                title: "Get Your Report",
                description:
                  "Receive a clear breakdown of potential overcharges, estimated savings, and a dispute-ready letter you can send immediately.",
                icon: <CheckCircle className="w-8 h-8" />,
                color: "from-[#D4735F] to-[#B85A47]",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 + 0.4 }}
              >
                <Card className="bg-white/60 backdrop-blur-sm border border-[#F7F5F2] hover:border-[#E4B08F]/30 rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-xl group">
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-serif font-light text-[#8B9DC3]">
                        {item.step}
                      </span>
                      <div
                        className={`p-2.5 rounded-xl bg-gradient-to-r ${item.color} text-white group-hover:scale-110 transition-transform duration-300`}
                      >
                        {item.icon}
                      </div>
                    </div>

                    <h3 className="text-xl font-serif font-medium text-[#2C2825]">
                      {item.title}
                    </h3>

                    <p className="text-[#6B6560] leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>


        </div>
      </motion.section>


      {/* Real Bills, Real Savings Section */}
      <motion.section
        id="stories"
        className="py-20 px-6 bg-gradient-to-r from-[#F7F5F2] to-[#FDFCFB] relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-light text-[#2C2825] mb-6">
              Real Bills. Real Savings.
            </h2>
            <p className="text-xl text-[#6B6560] leading-relaxed">
              See how OverSight uncovered hidden overcharges in real medical bills
            </p>
          </motion.div>

          {/* Case Study Carousel */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl overflow-hidden shadow-xl">
              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCaseStudy}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="p-12"
                  >
                    {/* Case Study Header */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${caseStudies[currentCaseStudy].color1}, ${caseStudies[currentCaseStudy].color2})`
                          }}
                        >
                          {caseStudies[currentCaseStudy].icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-serif font-medium text-[#2C2825]">
                            {caseStudies[currentCaseStudy].title}
                          </h3>
                          <p className="text-sm text-[#8B9DC3]">
                            {caseStudies[currentCaseStudy].location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-[#6B6560] mb-1">Total Bill</p>
                        <p className="text-3xl font-serif font-medium text-[#2C2825]">
                          ${caseStudies[currentCaseStudy].totalBill.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Key Findings Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      {/* Overcharge Amount */}
                      <div className="bg-gradient-to-br from-[#D4735F]/10 to-[#B85A47]/10 rounded-2xl p-6 border border-[#D4735F]/20">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-[#D4735F]/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-[#D4735F]" />
                          </div>
                          <p className="text-sm font-medium text-[#6B6560]">Potential Overcharge</p>
                        </div>
                        <p className="text-3xl font-bold text-[#D4735F]">
                          ${caseStudies[currentCaseStudy].overcharge.toLocaleString()}
                        </p>
                      </div>

                      {/* Savings Percentage */}
                      <div className="bg-gradient-to-br from-[#8B9DC3]/10 to-[#6B7FA0]/10 rounded-2xl p-6 border border-[#8B9DC3]/20">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-[#8B9DC3]/20 flex items-center justify-center">
                            <Star className="w-4 h-4 text-[#8B9DC3]" />
                          </div>
                          <p className="text-sm font-medium text-[#6B6560]">Savings Opportunity</p>
                        </div>
                        <p className="text-3xl font-bold text-[#8B9DC3]">
                          {caseStudies[currentCaseStudy].savingsPercent}%
                        </p>
                      </div>

                      {/* Issues Found */}
                      <div className="bg-gradient-to-br from-[#E4B08F]/10 to-[#D49C6B]/10 rounded-2xl p-6 border border-[#E4B08F]/20">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-[#E4B08F]/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-[#E4B08F]" />
                          </div>
                          <p className="text-sm font-medium text-[#6B6560]">Issues Detected</p>
                        </div>
                        <p className="text-3xl font-bold text-[#E4B08F]">
                          {caseStudies[currentCaseStudy].issuesFound}
                        </p>
                      </div>
                    </div>

                    {/* Primary Issue */}
                    <div className="bg-[#F7F5F2]/50 rounded-2xl p-6 mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-[#D4735F] flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#8B9DC3] mb-2">Primary Issue Identified</p>
                          <p className="text-lg text-[#2C2825] leading-relaxed">
                            {caseStudies[currentCaseStudy].issue}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Details List */}
                    <div className="space-y-3 mb-8">
                      {caseStudies[currentCaseStudy].details.map((detail, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3"
                        >
                          <CheckCircle className="w-5 h-5 text-[#8B9DC3] flex-shrink-0 mt-0.5" />
                          <p className="text-[#6B6560] leading-relaxed">{detail}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* View Breakdown Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#C66A56] hover:to-[#A5533F] text-white rounded-xl py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <ExternalLink className="w-5 h-5" />
                        <span>View Full Breakdown</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Button>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="border-t border-[#F7F5F2] px-12 py-6 bg-[#FDFCFB]/50">
                  <div className="flex items-center justify-between">
                    {/* Case Indicators */}
                    <div className="flex items-center space-x-2">
                      {caseStudies.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentCaseStudy(index)}
                          className={`transition-all duration-300 rounded-full ${
                            index === currentCaseStudy
                              ? "w-8 h-3 bg-[#D4735F]"
                              : "w-3 h-3 bg-[#E4B08F]/30 hover:bg-[#E4B08F]/50"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Arrow Navigation */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentCaseStudy((prev) => (prev - 1 + caseStudies.length) % caseStudies.length)}
                        className="w-10 h-10 rounded-full bg-white border border-[#E4B08F]/20 flex items-center justify-center hover:bg-[#F7F5F2] transition-colors"
                      >
                        <ArrowRight className="w-5 h-5 text-[#6B6560] rotate-180" />
                      </button>
                      <button
                        onClick={() => setCurrentCaseStudy((prev) => (prev + 1) % caseStudies.length)}
                        className="w-10 h-10 rounded-full bg-white border border-[#E4B08F]/20 flex items-center justify-center hover:bg-[#F7F5F2] transition-colors"
                      >
                        <ArrowRight className="w-5 h-5 text-[#6B6560]" />
                      </button>
                    </div>

                    {/* Counter */}
                    <div className="text-sm text-[#8B9DC3] font-medium">
                      {currentCaseStudy + 1} / {caseStudies.length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* What OverSight Detects Section */}
      <motion.section
        className="py-20 px-6 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-light text-[#2C2825] mb-6">
              What OverSight Detects
            </h2>
            <p className="text-xl text-[#6B6560] leading-relaxed max-w-3xl mx-auto">
              Our AI scans for common billing errors and overcharges that cost patients thousands
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1: Upcoding */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl p-8 h-full hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-0 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4735F] to-[#B85A47] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Search className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-serif font-medium text-[#2C2825]">
                          Upcoding
                        </h3>
                        <p className="text-sm text-[#8B9DC3]">Most Common Issue</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#D4735F]/10 text-[#D4735F] text-xs font-medium">
                      High Priority
                    </div>
                  </div>

                  <p className="text-[#6B6560] leading-relaxed">
                    When providers bill for a higher-level service than what was actually performed. For example, coding an emergency room visit as "Level 5" (most severe) when it should be "Level 4."
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-4 bg-[#F7F5F2]/50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-[#8B9DC3] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#2C2825] text-sm">Real Example</p>
                        <p className="text-sm text-[#6B6560]">Level 5 ER visit billed at $4,820 instead of Level 4 at $3,840</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6560]">Average overcharge</span>
                      <span className="font-bold text-[#D4735F]">$800 - $1,200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2: Above National Average */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl p-8 h-full hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-0 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B9DC3] to-[#6B7FA0] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-serif font-medium text-[#2C2825]">
                          Above Benchmark
                        </h3>
                        <p className="text-sm text-[#8B9DC3]">Regional Pricing</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#8B9DC3]/10 text-[#8B9DC3] text-xs font-medium">
                      Negotiable
                    </div>
                  </div>

                  <p className="text-[#6B6560] leading-relaxed">
                    Charges significantly above national or regional averages for the same procedure. We compare your bill against thousands of data points to identify inflated pricing.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-4 bg-[#F7F5F2]/50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-[#8B9DC3] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#2C2825] text-sm">Real Example</p>
                        <p className="text-sm text-[#6B6560]">MRI scan charged at $3,200 vs. regional average of $2,100</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6560]">Typical markup detected</span>
                      <span className="font-bold text-[#8B9DC3]">20% - 35%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 3: Duplicate Line Items */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl p-8 h-full hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-0 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E4B08F] to-[#D49C6B] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-serif font-medium text-[#2C2825]">
                          Duplicate Charges
                        </h3>
                        <p className="text-sm text-[#8B9DC3]">Billing Errors</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#E4B08F]/10 text-[#E4B08F] text-xs font-medium">
                      Easy Fix
                    </div>
                  </div>

                  <p className="text-[#6B6560] leading-relaxed">
                    The same service or supply billed multiple times on a single bill. Often happens with facility fees, medication doses, or diagnostic tests that appear twice.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-4 bg-[#F7F5F2]/50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-[#8B9DC3] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#2C2825] text-sm">Real Example</p>
                        <p className="text-sm text-[#6B6560]">Two "facility fees" of $450 each for the same visit</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6560]">Found in</span>
                      <span className="font-bold text-[#E4B08F]">~15% of bills</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 4: Out-of-Network Misclassification */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-[#E4B08F]/20 rounded-3xl p-8 h-full hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-0 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4735F] to-[#E4B08F] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <XCircle className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-serif font-medium text-[#2C2825]">
                          Network Errors
                        </h3>
                        <p className="text-sm text-[#8B9DC3]">Insurance Issues</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#D4735F]/10 text-[#D4735F] text-xs font-medium">
                      Critical
                    </div>
                  </div>

                  <p className="text-[#6B6560] leading-relaxed">
                    Services incorrectly billed as out-of-network when the provider or facility is actually in your insurance network. This can dramatically increase your out-of-pocket costs.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-4 bg-[#F7F5F2]/50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-[#8B9DC3] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[#2C2825] text-sm">Real Example</p>
                        <p className="text-sm text-[#6B6560]">Lab tests billed out-of-network increased cost by $640</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6560]">Average savings when corrected</span>
                      <span className="font-bold text-[#D4735F]">$500 - $2,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-[#D4735F]/5 to-[#8B9DC3]/5 border border-[#E4B08F]/20 rounded-2xl p-8">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                  <div className="text-left">
                    <p className="text-lg font-medium text-[#2C2825] mb-2">
                      Don't leave money on the table
                    </p>
                    <p className="text-[#6B6560]">
                      Upload your bill now and see what we find in under 60 seconds
                    </p>
                  </div>
                  <Button
                    onClick={handleStartSession}
                    className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#C66A56] hover:to-[#A5533F] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Analyze My Bill</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        className="py-20 px-6 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-white via-[#F7F5F2]/30 to-white border-2 border-[#E4B08F]/30 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#D4735F]/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#8B9DC3]/20 to-transparent rounded-full blur-3xl" />
              </div>

              <CardContent className="relative p-12 lg:p-16 space-y-10">
                {/* Header */}
                <div className="space-y-5">
                  <motion.h2 
                    className="text-4xl lg:text-6xl font-serif font-light text-[#2C2825] leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    Ready to see what your<br />bill is hiding?
                  </motion.h2>
                  <motion.p 
                    className="text-xl lg:text-2xl text-[#6B6560] leading-relaxed font-light max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    Medical billing is confusing by design.<br />
                    <span className="text-[#2C2825] font-medium">OverSight makes it transparent in seconds.</span>
                  </motion.p>
                </div>

                {/* Feature Pills - Enhanced */}
                <motion.div 
                  className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="group bg-gradient-to-br from-white to-[#F7F5F2]/50 rounded-2xl p-5 border border-[#E4B08F]/20 hover:border-[#8B9DC3]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B9DC3] to-[#6B7FA0] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-[#2C2825] leading-snug">AI-powered<br />charge analysis</p>
                    </div>
                  </div>

                  <div className="group bg-gradient-to-br from-white to-[#F7F5F2]/50 rounded-2xl p-5 border border-[#E4B08F]/20 hover:border-[#8B9DC3]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B9DC3] to-[#6B7FA0] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-[#2C2825] leading-snug">National pricing<br />benchmarks</p>
                    </div>
                  </div>

                  <div className="group bg-gradient-to-br from-white to-[#F7F5F2]/50 rounded-2xl p-5 border border-[#E4B08F]/20 hover:border-[#8B9DC3]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B9DC3] to-[#6B7FA0] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-[#2C2825] leading-snug">Dispute-ready letter<br />generated instantly</p>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div 
                  className="flex flex-col items-center space-y-4 pt-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={handleStartSession}
                    className="group bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#C66A56] hover:to-[#A5533F] text-white px-14 py-7 text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Sparkles className="w-6 h-6" />
                      </motion.div>
                      <span>Analyze My Bill</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Button>
                  
                  <div className="flex items-center space-x-4 text-sm text-[#8B9DC3]">
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>No signup required</span>
                    </div>
                    <span className="text-[#E4B08F]">•</span>
                    <div className="flex items-center space-x-1.5">
                      <Zap className="w-4 h-4" />
                      <span>Results in under 60 seconds</span>
                    </div>
                  </div>
                </motion.div>

                {/* Trust Badge */}
                <motion.div
                  className="pt-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8B9DC3]/10 to-[#D4735F]/10 rounded-full border border-[#E4B08F]/30">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4735F] to-[#8B9DC3] border-2 border-white"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-[#6B6560] pl-2">
                      Join thousands finding hidden overcharges
                    </span>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>



            {/* Footer */}
      <footer className="border-t border-[#F7F5F2] py-16 px-6 relative z-10 bg-gradient-to-b from-[#FDFCFB] to-[#F7F5F2]">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4735F] to-[#B85A47] flex items-center justify-center shadow-lg">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold font-logo text-[#2C2825]">
                  OverSight
                </span>
              </div>
              <p className="text-[#6B6560] leading-relaxed max-w-md">
                AI-powered medical bill analysis that helps patients identify overcharges and save money. 
                Bringing transparency to healthcare pricing, one bill at a time.
              </p>
              <div className="flex items-center space-x-4 pt-2">
                <a 
                  href="mailto:hello@oversight.com" 
                  className="text-sm text-[#8B9DC3] hover:text-[#D4735F] transition-colors flex items-center space-x-2"
                >
                  <span>hello@oversight.com</span>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#2C2825] text-sm uppercase tracking-wider">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#how-it-works" className="text-[#6B6560] hover:text-[#D4735F] transition-colors text-sm">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#stories" className="text-[#6B6560] hover:text-[#D4735F] transition-colors text-sm">
                    Case Studies
                  </a>
                </li>
                <li>
                  <button className="text-[#6B6560] hover:text-[#D4735F] transition-colors text-sm">
                    Pricing
                  </button>
                </li>
                <li>
                  <button className="text-[#6B6560] hover:text-[#D4735F] transition-colors text-sm">
                    API Access
                  </button>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#2C2825] text-sm uppercase tracking-wider">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <button className="text-[#6B6560] hover:text-[#D4735F] transition-colors text-sm">
                    About
                  </button>
                </li>
                <li>
                  <button className="text-[#6B6560] hover:text-[#D4735F] transition-colors text-sm">
                    Blog
                  </button>
                </li>
                <li>
                  <button className="text-[#6B6560] hover:text-[#D4735F] transition-colors text-sm">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="text-[#6B6560] hover:text-[#D4735F] transition-colors text-sm">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E4B08F]/20 pt-8">
            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-2 text-sm text-[#8B9DC3]">
                <span>© 2025 OverSight</span>
                <span>•</span>
                <span>Built with ❤️ by Sudarshan & Ishita</span>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-xs text-[#8B9DC3]">
                  <CheckCircle className="w-4 h-4 text-[#8B9DC3]" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-[#8B9DC3]">
                  <CheckCircle className="w-4 h-4 text-[#8B9DC3]" />
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-[#8B9DC3]">
                  <CheckCircle className="w-4 h-4 text-[#8B9DC3]" />
                  <span>SOC 2 Certified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 pt-6 border-t border-[#E4B08F]/10">
            <p className="text-xs text-[#8B9DC3] text-center leading-relaxed max-w-4xl mx-auto">
              <strong>Disclaimer:</strong> OverSight provides educational information and analysis tools. 
              Results are estimates based on national pricing data and should not be considered medical or legal advice. 
              Always consult with your healthcare provider and insurance company regarding billing questions.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}