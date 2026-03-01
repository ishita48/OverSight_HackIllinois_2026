// project/[projectId]/ProjectPublicClient.jsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Share2,
  Download,
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
  Quote,
  Play,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProjectPublicClient({ project }) {
  const [copiedSection, setCopiedSection] = useState(null);

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

  const shareProject = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${project.name} - Founder Story`,
          text:
            project.description ||
            `Check out the founder story behind ${project.name}`,
          url: window.location.href,
        });
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Project URL copied to clipboard!");
      }
    } catch (error) {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Project URL copied to clipboard!");
      } catch (err) {
        toast.error("Failed to share project");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "same day";
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""}`;
    }
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""}`;
  };

  // Extract key insights from sessions
  const getProjectInsights = () => {
    const allQuotes = project.sessions
      .map((s) => s.feedbackJson.keyQuote?.quote || s.quote)
      .filter(Boolean);

    const allThemes = project.sessions
      .flatMap((s) => s.feedbackJson.recurringThemes || [])
      .map((t) => (typeof t === "string" ? t : t.theme))
      .filter(Boolean);

    const uniqueThemes = [...new Set(allThemes)].slice(0, 5);

    const founderBio = project.sessions
      .map((s) => s.feedbackJson.founderBio)
      .filter(Boolean)[0];

    const elevatorPitch = project.sessions
      .map((s) => s.feedbackJson.elevatorPitch)
      .filter(Boolean)[0];

    return {
      quotes: allQuotes.slice(0, 3),
      themes: uniqueThemes,
      founderBio,
      elevatorPitch,
    };
  };

  const insights = getProjectInsights();

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
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4735F] to-[#B85A47] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {project.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl lg:text-3xl font-serif font-light text-[#2C2825] truncate">
                  {project.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B6560] mt-2">
                  <span className="flex items-center shrink-0">
                    <User className="w-4 h-4 mr-1.5" />
                    by {project.ownerName}
                  </span>
                  <span className="flex items-center shrink-0">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    started {formatDate(project.createdAt)}
                  </span>
                  <Badge className="bg-[#8B9DC3]/10 text-[#8B9DC3] border-[#8B9DC3]/20 rounded-full px-3 shrink-0">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {project.currentStage}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={shareProject}
                className="border-[#F7F5F2] text-[#6B6560] hover:bg-[#8B9DC3]/10 hover:text-[#8B9DC3] 
                         hover:border-[#8B9DC3] rounded-xl transition-all duration-200 flex-1 sm:flex-initial"
              >
                <Share2 className="w-4 h-4 mr-2" />
                share story
              </Button>
              <Button
                onClick={() => window.open("https://OverSight.com", "_blank")}
                className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] text-white rounded-xl 
                         hover:from-[#B85A47] hover:to-[#A04A37] transition-all duration-300 
                         shadow-lg hover:shadow-xl flex-1 sm:flex-initial"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                create your story
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Project Overview Stats */}
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
                  {project.stats.totalSessions}
                </div>
                <div className="text-xs lg:text-sm text-[#6B6560] font-medium">
                  Story Sessions
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#8B9DC3]/10 to-[#8B9DC3]/5 border-[#8B9DC3]/20 rounded-2xl">
              <CardContent className="p-4 lg:p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-[#8B9DC3]/20 rounded-full mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-[#8B9DC3]" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-[#2C2825] mb-1">
                  {project.stats.totalWords}
                </div>
                <div className="text-xs lg:text-sm text-[#6B6560] font-medium">
                  Words Captured
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#6B6560]/10 to-[#6B6560]/5 border-[#6B6560]/20 rounded-2xl">
              <CardContent className="p-4 lg:p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-[#6B6560]/20 rounded-full mx-auto mb-3">
                  <Target className="w-6 h-6 text-[#6B6560]" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-[#2C2825] mb-1">
                  {insights.themes.length}
                </div>
                <div className="text-xs lg:text-sm text-[#6B6560] font-medium">
                  Core Themes
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#DDB892]/10 to-[#DDB892]/5 border-[#DDB892]/20 rounded-2xl">
              <CardContent className="p-4 lg:p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-[#DDB892]/20 rounded-full mx-auto mb-3">
                  <Clock className="w-6 h-6 text-[#DDB892]" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-[#2C2825] mb-1">
                  {project.stats.timeSpan.start === project.stats.timeSpan.end
                    ? "1"
                    : formatDuration(
                        project.stats.timeSpan.start,
                        project.stats.timeSpan.end
                      ).split(" ")[0]}
                </div>
                <div className="text-xs lg:text-sm text-[#6B6560] font-medium">
                  {project.stats.timeSpan.start === project.stats.timeSpan.end
                    ? "Day"
                    : formatDuration(
                        project.stats.timeSpan.start,
                        project.stats.timeSpan.end
                      ).includes("day")
                    ? "Days"
                    : formatDuration(
                        project.stats.timeSpan.start,
                        project.stats.timeSpan.end
                      ).includes("week")
                    ? "Weeks"
                    : "Months"}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Project Description */}
        {project.description && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-12 lg:mb-16"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-6 lg:p-10">
                <h2 className="text-xl lg:text-2xl font-serif text-[#2C2825] mb-4 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-[#D4735F]" />
                  The Vision
                </h2>
                <p className="text-[#2C2825] leading-relaxed font-light text-base lg:text-lg">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Founder Bio */}
        {insights.founderBio && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 lg:mb-16"
          >
            <h2 className="text-2xl lg:text-3xl font-serif text-[#2C2825] mb-8 flex items-center">
              <User className="w-6 h-6 mr-3 text-[#8B9DC3]" />
              About the Founder
            </h2>

            <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-6 lg:p-10">
                <p className="text-[#2C2825] text-base lg:text-lg leading-relaxed font-light">
                  {insights.founderBio}
                </p>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Key Quotes */}
        {insights.quotes.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12 lg:mb-16"
          >
            <h2 className="text-2xl lg:text-3xl font-serif text-[#2C2825] mb-8 flex items-center">
              <Quote className="w-6 h-6 mr-3 text-[#D4735F]" />
              Key Insights
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {insights.quotes.map((quote, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-[#F7F5F2] to-white border-[#D4735F]/20 shadow-lg rounded-2xl overflow-hidden"
                >
                  <CardContent className="p-6">
                    <Quote className="w-6 h-6 text-[#D4735F]/30 mb-3" />
                    <blockquote className="text-[#2C2825] leading-relaxed italic mb-4">
                      "{quote}"
                    </blockquote>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(quote, `Quote ${index + 1}`)
                      }
                      className="text-[#8B9DC3] hover:text-[#D4735F] hover:bg-[#D4735F]/5 rounded-xl transition-all duration-200"
                    >
                      {copiedSection === `Quote ${index + 1}` ? (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      copy
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Core Themes */}
        {insights.themes.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12 lg:mb-16"
          >
            <h2 className="text-2xl lg:text-3xl font-serif text-[#2C2825] mb-8 flex items-center">
              <Target className="w-6 h-6 mr-3 text-[#8B9DC3]" />
              Core Themes
            </h2>

            <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-lg rounded-2xl">
              <CardContent className="p-6 lg:p-8">
                <div className="grid gap-4 md:grid-cols-2">
                  {insights.themes.map((theme, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-[#F7F5F2]/50"
                    >
                      <div className="w-3 h-3 bg-[#8B9DC3] rounded-full flex-shrink-0" />
                      <span className="text-[#2C2825] font-medium">
                        {theme}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Elevator Pitch */}
        {insights.elevatorPitch && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-12 lg:mb-16"
          >
            <h2 className="text-2xl lg:text-3xl font-serif text-[#2C2825] mb-8 flex items-center">
              <Zap className="w-6 h-6 mr-3 text-[#D4735F]" />
              The Pitch
            </h2>

            <Card className="bg-gradient-to-br from-[#8B9DC3]/5 to-white border-[#8B9DC3]/20 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-6 lg:p-10">
                <p className="text-[#2C2825] text-base lg:text-lg leading-relaxed font-light mb-6">
                  {insights.elevatorPitch}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(insights.elevatorPitch, "Elevator Pitch")
                  }
                  className="text-[#8B9DC3] hover:text-[#D4735F] hover:bg-[#D4735F]/5 rounded-xl transition-all duration-200"
                >
                  {copiedSection === "Elevator Pitch" ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  copy pitch
                </Button>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Story Journey Summary */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12 lg:mb-16"
        >
          <h2 className="text-2xl lg:text-3xl font-serif text-[#2C2825] mb-8 flex items-center">
            <Activity className="w-6 h-6 mr-3 text-[#8B9DC3]" />
            Story Journey
          </h2>

          <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-lg rounded-2xl">
            <CardContent className="p-6 lg:p-8">
              <div className="text-center">
                <p className="text-[#6B6560] text-base leading-relaxed mb-6">
                  This founder story was crafted over{" "}
                  <span className="font-semibold text-[#2C2825]">
                    {project.stats.totalSessions} thoughtful sessions
                  </span>
                  , capturing{" "}
                  <span className="font-semibold text-[#2C2825]">
                    {project.stats.totalWords} words
                  </span>{" "}
                  of authentic narrative
                  {project.stats.timeSpan.start !==
                    project.stats.timeSpan.end && (
                    <span>
                      {" "}
                      spanning{" "}
                      {formatDuration(
                        project.stats.timeSpan.start,
                        project.stats.timeSpan.end
                      )}
                    </span>
                  )}
                  .
                </p>

                <Button
                  onClick={() => window.open("https://OverSight.com", "_blank")}
                  className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] text-white rounded-xl 
                           hover:from-[#B85A47] hover:to-[#A04A37] transition-all duration-300 
                           shadow-lg hover:shadow-xl"
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Start Your Own Story
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center py-8 border-t border-[#F7F5F2]"
        >
          <p className="text-[#6B6560] text-sm">
            Powered by{" "}
            <a
              href="https://OverSight.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4735F] hover:text-[#B85A47] transition-colors font-medium"
            >
              OverSight
            </a>{" "}
            — Where authentic founder narratives come to life
          </p>
        </motion.div>
      </div>
    </div>
  );
}
