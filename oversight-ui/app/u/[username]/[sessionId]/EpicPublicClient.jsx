"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  Share2,
  Copy,
  CheckCircle,
  Twitter,
  Linkedin,
  Sparkles,
  Heart,
  MessageCircle,
  ArrowRight,
  Target,
  Lightbulb,
  Zap,
  Calendar,
  MapPin,
  Link,
  Trophy,
  Mic,
  TrendingUp,
  Users,
  Building,
  Clock,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const moodEmojis = {
  hopeful: "🌅",
  determined: "💪",
  reflective: "🤔",
  excited: "⚡",
  grateful: "🙏",
  focused: "🎯",
  vulnerable: "💭",
  confident: "🔥",
  curious: "🔍",
  inspired: "✨",
  calm: "🧘",
  ambitious: "🚀",
};

export default function EpicPublicClient({ narrative }) {
  const [copiedItem, setCopiedItem] = useState(null);
  const [reactionCount, setReactionCount] = useState(127);
  const [hasReacted, setHasReacted] = useState(false);

  const feedback = narrative.feedbackJson;

  const copyToClipboard = async (text, item) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      toast.success(`${item} copied!`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const shareToSocial = (platform) => {
    const url = window.location.href;
    const title = `${narrative.sessionTitle} - ${narrative.projectName}`;
    const text =
      feedback.yourTruth ||
      feedback.sessionReflection ||
      "A founder's authentic journey";

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `"${text}" - ${title}`
        )}&url=${encodeURIComponent(url)}&hashtags=OverSight,FounderStory`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const handleReaction = () => {
    if (!hasReacted) {
      setReactionCount((prev) => prev + 1);
      setHasReacted(true);
      toast.success("Thanks for the inspiration!");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1A1F3A] to-[#0A0E27]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #8B9DC3 0%, transparent 50%), radial-gradient(circle at 80% 20%, #DDB892 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          {/* Founder Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="relative inline-block mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#8B9DC3] to-[#DDB892] flex items-center justify-center text-4xl font-bold text-[#0A0E27] shadow-2xl"
              >
                {narrative.founderName?.charAt(0) || "F"}
              </motion.div>

              {/* Status Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#DDB892] to-[#8B9DC3] rounded-full p-3 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-[#0A0E27]" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[#E8E3D3]">
                {narrative.founderName}
              </h1>
              <p className="text-xl text-[#8B9DC3] font-light">
                Founder of {narrative.projectName}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-[#6B6560] mt-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(narrative.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Mic className="w-4 h-4" />
                  Voice Story
                </div>
                <div className="flex items-center gap-1">
                  {moodEmojis[narrative.mood] || "💫"}
                  {narrative.mood}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <Button
              onClick={handleReaction}
              disabled={hasReacted}
              className={`${
                hasReacted
                  ? "bg-[#DDB892]/20 text-[#DDB892] border-[#DDB892]/30"
                  : "bg-[#8B9DC3]/20 hover:bg-[#8B9DC3]/30 text-[#8B9DC3] border-[#8B9DC3]/30"
              } border transition-all duration-300`}
              variant="outline"
            >
              <Heart
                className={`w-4 h-4 mr-2 ${hasReacted ? "fill-current" : ""}`}
              />
              {hasReacted ? "Inspired!" : "Inspiring"} ({reactionCount})
            </Button>

            <Button
              onClick={() => shareToSocial("linkedin")}
              className="bg-[#0077B5]/20 hover:bg-[#0077B5]/30 text-[#0077B5] border-[#0077B5]/30"
              variant="outline"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              Share on LinkedIn
            </Button>

            <Button
              onClick={() => shareToSocial("twitter")}
              className="bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] border-[#1DA1F2]/30"
              variant="outline"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Share on Twitter
            </Button>

            <Button
              onClick={() =>
                copyToClipboard(window.location.href, "Profile Link")
              }
              className="bg-[#6B6560]/20 hover:bg-[#6B6560]/30 text-[#6B6560] border-[#6B6560]/30"
              variant="outline"
            >
              {copiedItem === "Profile Link" ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              Copy Link
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Story & Insights */}
          <div className="lg:col-span-2 space-y-8">
            {/* The Story */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-[#1A1F3A]/50 border-[#2A2F4A] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-[#E8E3D3] flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#DDB892]" />
                    {narrative.sessionTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Your Truth */}
                  {feedback.yourTruth && (
                    <div className="p-6 rounded-lg bg-gradient-to-r from-[#DDB892]/10 to-[#8B9DC3]/10 border border-[#DDB892]/20">
                      <h3 className="text-[#DDB892] font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        The Truth That Drives Me
                      </h3>
                      <blockquote className="text-[#E8E3D3] text-lg font-medium italic leading-relaxed">
                        "{feedback.yourTruth}"
                      </blockquote>
                    </div>
                  )}

                  {/* The Story */}
                  {feedback.yourStory && (
                    <div className="prose prose-invert max-w-none">
                      <h3 className="text-[#8B9DC3] font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        My Founder Journey
                      </h3>
                      <div className="text-[#E8E3D3] leading-relaxed space-y-4">
                        {feedback.yourStory
                          .split("\n\n")
                          .map((paragraph, index) => (
                            <p key={index} className="text-[#E8E3D3]">
                              {paragraph}
                            </p>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Key Quote */}
                  {feedback.keyQuotes?.[0]?.quote && (
                    <div className="p-6 rounded-lg bg-[#0A0E27]/50 border border-[#2A2F4A]">
                      <div className="flex items-start gap-4">
                        <Quote className="w-8 h-8 text-[#8B9DC3] flex-shrink-0 mt-1" />
                        <div>
                          <blockquote className="text-[#E8E3D3] text-lg italic mb-2">
                            "{feedback.keyQuotes[0].quote}"
                          </blockquote>
                          {feedback.keyQuotes[0].context && (
                            <p className="text-[#8B9DC3] text-sm">
                              {feedback.keyQuotes[0].context}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Breakthrough Moment */}
            {feedback.theBreakthrough && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="bg-[#1A1F3A]/50 border-[#2A2F4A] backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-[#E8E3D3] flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#DDB892]" />
                      The Breakthrough
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-[#DDB892]/10 border border-[#DDB892]/20">
                        <h4 className="text-[#DDB892] font-medium mb-2">
                          The Moment
                        </h4>
                        <p className="text-[#E8E3D3]">
                          {feedback.theBreakthrough.moment}
                        </p>
                      </div>
                      {feedback.theBreakthrough.impact && (
                        <div className="p-4 rounded-lg bg-[#8B9DC3]/10 border border-[#8B9DC3]/20">
                          <h4 className="text-[#8B9DC3] font-medium mb-2">
                            The Impact
                          </h4>
                          <p className="text-[#E8E3D3]">
                            {feedback.theBreakthrough.impact}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* What Drives You */}
            {feedback.whatDrivesYou && feedback.whatDrivesYou.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-[#1A1F3A]/50 border-[#2A2F4A] backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-[#E8E3D3] flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#8B9DC3]" />
                      What Drives Me
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {feedback.whatDrivesYou
                        .slice(0, 3)
                        .map((driver, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg bg-[#0A0E27]/30 border border-[#2A2F4A]"
                          >
                            <h4 className="text-[#DDB892] font-medium mb-2">
                              {driver.theme}
                            </h4>
                            <p className="text-[#8B9DC3] text-sm">
                              {driver.description}
                            </p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Column: Profile Info & Actions */}
          <div className="space-y-6">
            {/* Profile Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-[#1A1F3A]/50 border-[#2A2F4A] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-[#E8E3D3] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#8B9DC3]" />
                    Story Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-[#8B9DC3]/10">
                      <div className="text-2xl font-bold text-[#8B9DC3]">
                        {reactionCount}
                      </div>
                      <div className="text-xs text-[#6B6560]">Inspired</div>
                    </div>
                    <div className="p-4 rounded-lg bg-[#DDB892]/10">
                      <div className="text-2xl font-bold text-[#DDB892]">
                        89
                      </div>
                      <div className="text-xs text-[#6B6560]">Shared</div>
                    </div>
                    <div className="p-4 rounded-lg bg-[#6B6560]/10">
                      <div className="text-2xl font-bold text-[#6B6560]">
                        1.2k
                      </div>
                      <div className="text-xs text-[#6B6560]">Views</div>
                    </div>
                    <div className="p-4 rounded-lg bg-[#8B9DC3]/10">
                      <div className="text-2xl font-bold text-[#8B9DC3]">
                        34
                      </div>
                      <div className="text-xs text-[#6B6560]">Comments</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-[#1A1F3A]/50 border-[#2A2F4A] backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-[#E8E3D3] flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#DDB892]" />
                    About This Venture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-[#E8E3D3] font-medium">
                      {narrative.projectName}
                    </h3>
                    <p className="text-[#8B9DC3] text-sm mt-1">
                      {feedback.sessionReflection?.substring(0, 100) ||
                        "Building something meaningful..."}
                      {feedback.sessionReflection?.length > 100 && "..."}
                    </p>
                  </div>

                  {narrative.tags && narrative.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {narrative.tags.slice(0, 4).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-[#8B9DC3]/10 text-[#8B9DC3] border-[#8B9DC3]/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Founder DNA */}
            {feedback.founderDNA && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-[#1A1F3A]/50 border-[#2A2F4A] backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-[#E8E3D3] flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#8B9DC3]" />
                      Founder DNA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#8B9DC3] text-sm leading-relaxed">
                      {feedback.founderDNA}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="bg-gradient-to-br from-[#8B9DC3]/20 to-[#DDB892]/20 border-[#8B9DC3]/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#8B9DC3] to-[#DDB892] flex items-center justify-center">
                      <Mic className="w-6 h-6 text-[#0A0E27]" />
                    </div>
                    <div>
                      <h3 className="text-[#E8E3D3] font-medium">
                        Start Your Story
                      </h3>
                      <p className="text-[#8B9DC3] text-sm mt-1">
                        Every founder has a unique journey. Discover your
                        narrative.
                      </p>
                    </div>
                    <Button
                      onClick={() => window.open("/", "_blank")}
                      className="w-full bg-gradient-to-r from-[#8B9DC3] to-[#DDB892] hover:from-[#8B9DC3]/80 hover:to-[#DDB892]/80 text-[#0A0E27] font-medium"
                    >
                      Create My Story
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2A2F4A] bg-[#0A0E27]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-[#6B6560]">
            <div className="flex items-center mb-4 md:mb-0">
              <Mic className="w-4 h-4 mr-2" />
              <span>
                Powered by OverSight - Voice-first founder storytelling
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>Share authentic founder stories</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
