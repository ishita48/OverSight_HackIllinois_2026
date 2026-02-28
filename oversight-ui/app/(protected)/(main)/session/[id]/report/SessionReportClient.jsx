// session/[id]/report/SessionReportClient.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Quote,
  Share2,
  Download,
  Mic,
  ArrowLeft,
  Calendar,
  Heart,
  Lightbulb,
  Target,
  Sparkles,
  Copy,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Star,
  Flame,
  Clock,
  User,
  Zap,
  Coffee,
  Globe,
  TrendingUp,
  MessageSquare,
  Timer,
  Award,
  Eye,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { generateUUID } from "@/lib/utils";

export default function SessionReportClient({ narrative }) {
  const router = useRouter();
  const [copiedSection, setCopiedSection] = useState(null);

  // Original direct navigation handler for "next chapter" button
  const handleNewSession = () => {
    const sessionId = generateUUID();
    router.push(`/record/${sessionId}`);
  };

  const copyToClipboard = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast.success(`${section} copied!`);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const feedback = narrative.feedbackJson;
  const hasMultipleSessions = narrative.totalSessions > 1;

  // Story depth indicator
  const getStoryDepth = () => {
    const depth = Math.min(narrative.totalSessions, 5);
    return Array.from({ length: 5 }, (_, i) => (i < depth ? "🔥" : "◯")).join(
      ""
    );
  };

  // Calculate story metrics
  const getStoryMetrics = () => {
    const wordCount = feedback.sessionReflection
      ? feedback.sessionReflection.split(" ").length
      : 0;

    const insights = [
      feedback.keyQuote?.quote && "Core Truth",
      feedback.recurringThemes?.length > 0 && "Driving Themes",
      feedback.standoutMoments?.length > 0 && "Key Moments",
      feedback.founderBio && "Founder DNA",
      feedback.elevatorPitch && "Elevator Pitch",
    ].filter(Boolean).length;

    return {
      wordCount,
      insights,
      completeness: Math.round((insights / 5) * 100),
      sessionNumber: narrative.totalSessions || 1,
    };
  };

  const metrics = getStoryMetrics();

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F2] via-transparent to-[#F7F5F2] opacity-60" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-[#8B9DC3]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-20 w-96 h-96 bg-[#D4735F]/5 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative z-10 border-b border-[#F7F5F2] bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0"
          >
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/sessions")}
                className="text-[#6B6560] hover:text-[#2C2825] hover:bg-[#F7F5F2] rounded-xl shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl lg:text-3xl font-serif font-light text-[#2C2825] truncate">
                  {narrative.sessionTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B6560] mt-2">
                  <span className="flex items-center shrink-0">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {formatDate(narrative.createdAt)}
                  </span>
                  {narrative.mood && (
                    <Badge className="bg-[#D4735F]/10 text-[#D4735F] border-[#D4735F]/20 rounded-full px-3 shrink-0">
                      <Heart className="w-3 h-3 mr-1" />
                      {narrative.mood}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <Button
                onClick={handleNewSession}
                className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] text-white rounded-xl 
                         hover:from-[#B85A47] hover:to-[#A04A37] transition-all duration-300 
                         shadow-lg hover:shadow-xl flex-1 sm:flex-initial"
              >
                <Flame className="w-4 h-4 mr-2" />
                next chapter
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Story Overview Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 lg:mb-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className="bg-gradient-to-br from-[#D4735F]/10 to-[#D4735F]/5 border-[#D4735F]/20 rounded-2xl">
              <CardContent className="p-4 lg:p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-[#D4735F]/20 rounded-full mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-[#D4735F]" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-[#2C2825] mb-1">
                  {metrics.wordCount}
                </div>
                <div className="text-xs lg:text-sm text-[#6B6560] font-medium">
                  Words Captured
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#8B9DC3]/10 to-[#8B9DC3]/5 border-[#8B9DC3]/20 rounded-2xl">
              <CardContent className="p-4 lg:p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-[#8B9DC3]/20 rounded-full mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-[#8B9DC3]" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-[#2C2825] mb-1">
                  {metrics.completeness}%
                </div>
                <div className="text-xs lg:text-sm text-[#6B6560] font-medium">
                  Story Complete
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#DDB892]/10 to-[#DDB892]/5 border-[#DDB892]/20 rounded-2xl">
              <CardContent className="p-4 lg:p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-[#DDB892]/20 rounded-full mx-auto mb-3">
                  <Award className="w-6 h-6 text-[#DDB892]" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-[#2C2825] mb-1">
                  {metrics.insights}
                </div>
                <div className="text-xs lg:text-sm text-[#6B6560] font-medium">
                  Key Insights
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#6B6560]/10 to-[#6B6560]/5 border-[#6B6560]/20 rounded-2xl">
              <CardContent className="p-4 lg:p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-[#6B6560]/20 rounded-full mx-auto mb-3">
                  <Flame className="w-6 h-6 text-[#6B6560]" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-[#2C2825] mb-1">
                  {metrics.sessionNumber}
                </div>
                <div className="text-xs lg:text-sm text-[#6B6560] font-medium">
                  {metrics.sessionNumber === 1 ? "First Session" : "Sessions"}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* 1. Your Story ✨ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 lg:mb-16"
        >
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-8">
            <h2 className="text-2xl lg:text-3xl font-serif text-[#2C2825] flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-[#D4735F]" />
              Your Story
            </h2>
            {hasMultipleSessions && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-[#6B6560] bg-[#F7F5F2] px-3 py-1 rounded-full"
              >
                ✨ Refined over {narrative.totalSessions} conversations
              </motion.span>
            )}
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6 lg:p-10">
              {/* The polished narrative - this would be generated from all sessions */}
              <div className="prose prose-lg max-w-none">
                <p className="text-[#2C2825] leading-relaxed mb-6 text-base lg:text-lg font-light">
                  {feedback.sessionReflection || "Your journey begins here..."}
                </p>

                {feedback.elevatorPitch && (
                  <p className="text-[#2C2825] leading-relaxed mb-6 text-base lg:text-lg font-light">
                    {feedback.elevatorPitch}
                  </p>
                )}

                {feedback.whyNowWhyMe && (
                  <p className="text-[#2C2825] leading-relaxed text-base lg:text-lg font-light">
                    {feedback.whyNowWhyMe}
                  </p>
                )}
              </div>

              {/* Story depth indicator */}
              {hasMultipleSessions && (
                <div className="mt-8 pt-6 border-t border-[#F7F5F2]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B6560]">Story depth</span>
                    <span className="text-lg">{getStoryDepth()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* 2. The Essence 💫 */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 lg:mb-16"
        >
          <h2 className="text-2xl lg:text-3xl font-serif text-[#2C2825] mb-8 flex items-center">
            <Star className="w-6 h-6 mr-3 text-[#8B9DC3]" />
            The Essence
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Your Truth */}
            <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-lg rounded-2xl">
              <CardContent className="p-6 lg:p-8">
                <h3 className="text-lg lg:text-xl font-serif text-[#2C2825] mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-[#D4735F]" />
                  Your Truth
                </h3>
                <p className="text-[#2C2825] leading-relaxed font-light">
                  {feedback.keyQuote?.quote ||
                    feedback.oneLiner ||
                    "Your core belief emerges with each conversation..."}
                </p>
                {feedback.keyQuote?.context && (
                  <p className="text-sm text-[#6B6560] mt-3">
                    — {feedback.keyQuote.context}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* What Drives You */}
            <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-lg rounded-2xl">
              <CardContent className="p-6 lg:p-8">
                <h3 className="text-lg lg:text-xl font-serif text-[#2C2825] mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-[#8B9DC3]" />
                  What Drives You
                </h3>
                <div className="space-y-3">
                  {feedback.recurringThemes &&
                  feedback.recurringThemes.length > 0 ? (
                    feedback.recurringThemes.slice(0, 3).map((theme, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-[#8B9DC3] rounded-full mt-2 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-[#2C2825] font-medium">
                            {theme.theme}
                          </p>
                          <p className="text-[#6B6560] text-sm">
                            {theme.howItShowedUp}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#6B6560] font-light">
                      Your driving themes are still emerging...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* 3. Moments That Mattered 🔥 */}
        {feedback.standoutMoments && feedback.standoutMoments.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12 lg:mb-16"
          >
            <h2 className="text-2xl lg:text-3xl font-serif text-[#2C2825] mb-8 flex items-center">
              <Flame className="w-6 h-6 mr-3 text-[#D4735F]" />
              Moments That Mattered
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* The Turning Point */}
              <Card className="bg-gradient-to-br from-[#D4735F]/5 to-transparent border-[#F7F5F2] shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-serif text-[#2C2825] mb-3 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-[#D4735F]" />
                    The Turning Point
                  </h3>
                  <p className="text-[#2C2825] text-sm leading-relaxed font-light">
                    {feedback.standoutMoments[0] ||
                      "That moment when everything clicked..."}
                  </p>
                </CardContent>
              </Card>

              {/* The Doubt */}
              <Card className="bg-gradient-to-br from-[#8B9DC3]/5 to-transparent border-[#F7F5F2] shadow-lg rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-serif text-[#2C2825] mb-3 flex items-center">
                    <Coffee className="w-4 h-4 mr-2 text-[#8B9DC3]" />
                    The Doubt
                  </h3>
                  <p className="text-[#2C2825] text-sm leading-relaxed font-light">
                    {feedback.standoutMoments[1] ||
                      "When uncertainty crept in..."}
                  </p>
                </CardContent>
              </Card>

              {/* The Breakthrough */}
              <Card className="bg-gradient-to-br from-[#D4735F]/5 to-transparent border-[#F7F5F2] shadow-lg rounded-2xl md:col-span-2 lg:col-span-1">
                <CardContent className="p-6">
                  <h3 className="text-lg font-serif text-[#2C2825] mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-[#D4735F]" />
                    The Breakthrough
                  </h3>
                  <p className="text-[#2C2825] text-sm leading-relaxed font-light">
                    {feedback.standoutMoments[2] ||
                      "The moment clarity arrived..."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}

        {/* 4. Your Founder DNA 🧬 */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12 lg:mb-16"
        >
          <h2 className="text-2xl lg:text-3xl font-serif text-[#2C2825] mb-8 flex items-center">
            <User className="w-6 h-6 mr-3 text-[#8B9DC3]" />
            Your Founder DNA
          </h2>

          <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6 lg:p-10">
              <p className="text-[#2C2825] text-base lg:text-lg leading-relaxed font-light">
                {feedback.founderBio ||
                  "A founder still discovering their unique story..."}
              </p>

              {feedback.emotionalTone && (
                <div className="mt-6 pt-6 border-t border-[#F7F5F2]">
                  <p className="text-sm text-[#6B6560]">
                    Your energy:{" "}
                    <span className="text-[#2C2825] font-medium">
                      {feedback.emotionalTone}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Featured Quote Section */}
        {(feedback.keyQuote?.quote || feedback.oneLiner) && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-12 lg:mb-16"
          >
            <Card className="bg-gradient-to-br from-[#F7F5F2] to-white border-[#D4735F]/20 shadow-2xl rounded-3xl overflow-hidden relative">
              <div className="absolute top-6 left-8">
                <Quote className="w-8 h-8 text-[#D4735F]/30" />
              </div>
              <CardContent className="p-8 lg:p-12 text-center">
                <blockquote className="text-xl lg:text-2xl font-serif text-[#2C2825] leading-relaxed mb-6 italic">
                  "{feedback.keyQuote?.quote || feedback.oneLiner}"
                </blockquote>
                {feedback.keyQuote?.context && (
                  <p className="text-[#6B6560] font-medium">
                    — {feedback.keyQuote.context}
                  </p>
                )}
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        feedback.keyQuote?.quote || feedback.oneLiner || "",
                        "Quote"
                      )
                    }
                    className="text-[#8B9DC3] hover:text-[#D4735F] hover:bg-[#D4735F]/10 rounded-xl px-6 py-2 transition-all duration-200"
                  >
                    {copiedSection === "Quote" ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    Copy Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* 5. Tell It Your Way 📢 */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-12 lg:mb-16"
        >
          <h2 className="text-2xl lg:text-3xl font-serif text-[#2C2825] mb-8 flex items-center">
            <Globe className="w-6 h-6 mr-3 text-[#D4735F]" />
            Tell It Your Way
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Lightning Round */}
            <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-serif text-[#2C2825] mb-3 flex items-center justify-between">
                  <span className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-[#D4735F]" />
                    Lightning Round
                  </span>
                  <span className="text-xs text-[#6B6560] bg-[#F7F5F2] px-2 py-1 rounded">
                    15 words
                  </span>
                </h3>
                <p className="text-[#2C2825] font-medium mb-4 min-h-[3rem]">
                  {feedback.oneLiner?.split(" ").slice(0, 15).join(" ") ||
                    "Your story in a flash..."}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      feedback.oneLiner?.split(" ").slice(0, 15).join(" ") ||
                        "",
                      "Lightning"
                    )
                  }
                  className="text-[#8B9DC3] hover:text-[#D4735F] hover:bg-[#D4735F]/5 rounded-xl w-full transition-all duration-200"
                >
                  {copiedSection === "Lightning" ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  copy
                </Button>
              </CardContent>
            </Card>

            {/* Dinner Party */}
            <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-serif text-[#2C2825] mb-3 flex items-center justify-between">
                  <span className="flex items-center">
                    <Coffee className="w-4 h-4 mr-2 text-[#8B9DC3]" />
                    Dinner Party
                  </span>
                  <span className="text-xs text-[#6B6560] bg-[#F7F5F2] px-2 py-1 rounded">
                    2 sentences
                  </span>
                </h3>
                <p className="text-[#2C2825] text-sm leading-relaxed mb-4 min-h-[3rem]">
                  {feedback.oneLiner || "The conversation starter..."}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(feedback.oneLiner || "", "Dinner")
                  }
                  className="text-[#8B9DC3] hover:text-[#D4735F] hover:bg-[#D4735F]/5 rounded-xl w-full transition-all duration-200"
                >
                  {copiedSection === "Dinner" ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  copy
                </Button>
              </CardContent>
            </Card>

            {/* Website Bio */}
            <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-lg rounded-2xl md:col-span-2 lg:col-span-1">
              <CardContent className="p-6">
                <h3 className="text-lg font-serif text-[#2C2825] mb-3 flex items-center justify-between">
                  <span className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-[#D4735F]" />
                    Website Bio
                  </span>
                  <span className="text-xs text-[#6B6560] bg-[#F7F5F2] px-2 py-1 rounded">
                    paragraph
                  </span>
                </h3>
                <p className="text-[#2C2825] text-sm leading-relaxed mb-4 line-clamp-3 min-h-[3rem]">
                  {feedback.elevatorPitch || "Your professional story..."}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(feedback.elevatorPitch || "", "Website")
                  }
                  className="text-[#8B9DC3] hover:text-[#D4735F] hover:bg-[#D4735F]/5 rounded-xl w-full transition-all duration-200"
                >
                  {copiedSection === "Website" ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  copy
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Story Journey & Progress */}
        {hasMultipleSessions && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mb-12 lg:mb-16"
          >
            <h2 className="text-2xl lg:text-3xl font-serif text-[#2C2825] mb-8 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-[#8B9DC3]" />
              Your Story Journey
            </h2>

            <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-serif text-[#2C2825] mb-1">
                      Progress Tracker
                    </h3>
                    <p className="text-sm text-[#6B6560]">
                      Session {narrative.totalSessions} of your founder story
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#D4735F] mb-1">
                      {metrics.completeness}%
                    </div>
                    <div className="text-xs text-[#6B6560]">Complete</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-6">
                  <div className="w-full bg-[#F7F5F2] rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-[#D4735F] to-[#8B9DC3] h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metrics.completeness}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-[#6B6560] mt-2">
                    <span>Beginning</span>
                    <span>Your Story</span>
                    <span>Complete</span>
                  </div>
                </div>

                {/* Story Elements Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Core Truth",
                      completed: !!feedback.keyQuote?.quote,
                      icon: Lightbulb,
                    },
                    {
                      label: "Driving Themes",
                      completed: feedback.recurringThemes?.length > 0,
                      icon: Target,
                    },
                    {
                      label: "Key Moments",
                      completed: feedback.standoutMoments?.length > 0,
                      icon: Zap,
                    },
                    {
                      label: "Founder DNA",
                      completed: !!feedback.founderBio,
                      icon: User,
                    },
                    {
                      label: "Elevator Pitch",
                      completed: !!feedback.elevatorPitch,
                      icon: MessageSquare,
                    },
                    {
                      label: "Why Now/Why Me",
                      completed: !!feedback.whyNowWhyMe,
                      icon: Clock,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-[#F7F5F2]/50"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          item.completed
                            ? "bg-[#D4735F]/20 text-[#D4735F]"
                            : "bg-[#6B6560]/20 text-[#6B6560]"
                        }`}
                      >
                        <item.icon className="w-3 h-3" />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          item.completed ? "text-[#2C2825]" : "text-[#6B6560]"
                        }`}
                      >
                        {item.label}
                      </span>
                      <div className="ml-auto">
                        {item.completed ? (
                          <CheckCircle className="w-4 h-4 text-[#D4735F]" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-[#6B6560]/30 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Next Steps CTA */}
        {feedback.nextPrompt && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mb-12 lg:mb-16"
          >
            <Card className="bg-gradient-to-br from-[#D4735F]/5 to-[#8B9DC3]/5 border-[#D4735F]/20 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-8 lg:p-10 text-center">
                <h3 className="text-xl lg:text-2xl font-serif text-[#2C2825] mb-4">
                  Your next chapter awaits
                </h3>
                <p className="text-[#2C2825] text-base lg:text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-light">
                  {feedback.nextPrompt}
                </p>
                <Button
                  onClick={handleNewSession}
                  className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] text-white rounded-xl 
                           hover:from-[#B85A47] hover:to-[#A04A37] transition-all duration-300 
                           shadow-lg hover:shadow-xl hover:scale-105 px-6 lg:px-8 py-3"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Continue Your Story
                </Button>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Button
            variant="outline"
            className="border-[#F7F5F2] text-[#6B6560] hover:bg-[#D4735F]/10 hover:text-[#D4735F] 
                     hover:border-[#D4735F] rounded-xl transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
