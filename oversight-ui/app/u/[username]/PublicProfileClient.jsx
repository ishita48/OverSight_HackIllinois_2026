// app/u/[username]/PublicProfileClient.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Sparkles,
  TrendingUp,
  Calendar,
  Heart,
  Quote,
  Target,
  Brain,
  Flame,
  Share2,
  ExternalLink,
  Clock,
  Globe,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PublicProfileClient({ username, userId, userProfile }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicProfile();
  }, [userId]);

  const fetchPublicProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/public?userId=${userId}`);

      if (!response.ok) {
        throw new Error("Failed to load public profile");
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error("Public profile fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getFounderType = () => {
    if (profileData?.founderDNA && profileData.founderDNA.length > 0) {
      const traits = profileData.founderDNA.map((dna) =>
        typeof dna === "string" ? dna : dna.trait || dna.name
      );

      if (traits.some((t) => t.toLowerCase().includes("vision")))
        return "The Visionary Builder";
      if (traits.some((t) => t.toLowerCase().includes("resilient")))
        return "The Resilient Thinker";
      if (traits.some((t) => t.toLowerCase().includes("empathy")))
        return "The Empathetic Creator";
      if (traits.some((t) => t.toLowerCase().includes("system")))
        return "The Systems Thinker";

      return "The Thoughtful Builder";
    }
    return "The Emerging Founder";
  };

  const shareProfile = async () => {
    const shareText = `Check out ${
      userProfile.name || username
    }'s founder journey on OverSight: "${profileData.headlineTruth}"`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userProfile.name || username}'s Founder Journey`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
        copyToClipboard();
      }
    } else {
      // Fallback to LinkedIn sharing
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`;
      window.open(linkedInUrl, "_blank", "width=600,height=400");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast here if available
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4735F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B6560] text-lg">Loading founder journey...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="text-center max-w-md">
          <Brain className="w-16 h-16 text-[#6B6560] mx-auto mb-4" />
          <h2 className="text-xl font-serif text-[#2C2825] mb-2">
            Profile not available
          </h2>
          <p className="text-[#6B6560] mb-6">
            This founder profile is not publicly accessible or doesn't exist.
          </p>
          <Link href="/">
            <Button
              variant="outline"
              className="border-[#D4735F] text-[#D4735F] hover:bg-[#D4735F]/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to OverSight
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFCFB] via-[#FAF9F7] to-[#F7F5F2] relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F2]/80 via-transparent to-[#F7F5F2]/60" />

      {/* Floating orbs with animation */}
      <div className="absolute top-20 right-32 w-96 h-96 bg-gradient-to-br from-[#8B9DC3]/8 to-[#D4735F]/6 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-tr from-[#D4735F]/6 to-[#DDB892]/8 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Public Profile Badge */}
      <div className="absolute top-6 left-6 z-20">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#D4735F]/20 rounded-full text-sm text-[#6B6560] shadow-lg">
          <Globe className="w-4 h-4 text-[#8B9DC3]" />
          Public Profile
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <Button
          onClick={shareProfile}
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm border-[#8B9DC3]/20 text-[#6B6560] hover:bg-[#8B9DC3]/5 hover:text-[#8B9DC3] rounded-full"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/80 backdrop-blur-sm border-[#D4735F]/20 text-[#6B6560] hover:bg-[#D4735F]/5 hover:text-[#D4735F] rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to OverSight
          </Button>
        </Link>
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #2C2825 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Public Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          {/* Enhanced Avatar */}
          <motion.div
            className="relative w-32 h-32 mx-auto mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4735F] to-[#8B9DC3] rounded-full blur-xl opacity-40 animate-pulse" />
            <div className="relative w-full h-full rounded-full shadow-2xl border-4 border-white/20 overflow-hidden">
              {userProfile?.imageUrl ? (
                <img
                  src={userProfile.imageUrl}
                  alt={`${userProfile.name || username}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#D4735F] to-[#8B9DC3] flex items-center justify-center">
                  <User className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
              )}
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl lg:text-7xl font-serif text-[#2C2825] mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-[#2C2825] via-[#2C2825] to-[#D4735F] bg-clip-text text-transparent">
              {userProfile?.name || username}
            </span>
          </motion.h1>

          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D4735F]/10 to-[#8B9DC3]/10 backdrop-blur-sm border border-[#D4735F]/20 rounded-full text-xl lg:text-2xl text-[#D4735F] font-medium mb-8 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Sparkles className="w-5 h-5 mr-2 text-[#D4735F]" />
            {getFounderType()}
          </motion.div>

          <motion.blockquote
            className="text-3xl lg:text-5xl font-serif text-[#2C2825] leading-relaxed mb-10 italic max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="relative">
              <span className="absolute -left-4 -top-2 text-6xl text-[#D4735F]/20 font-serif">
                "
              </span>
              {profileData.headlineTruth}
              <span className="absolute -bottom-8 -right-2 text-6xl text-[#D4735F]/20 font-serif">
                "
              </span>
            </span>
          </motion.blockquote>

          <motion.div
            className="text-[#6B6560] text-xl lg:text-2xl font-light mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-[#D4735F]/20 shadow-sm">
                <MessageCircle className="w-5 h-5 text-[#D4735F]" />
                <span className="text-[#D4735F] font-semibold text-lg">
                  {profileData.metadata?.totalSessions || 0}
                </span>
                <span className="text-[#6B6560]">sessions</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-[#8B9DC3]/20 shadow-sm">
                <Target className="w-5 h-5 text-[#8B9DC3]" />
                <span className="text-[#8B9DC3] font-semibold text-lg">
                  {profileData.metadata?.totalProjects || 0}
                </span>
                <span className="text-[#6B6560]">projects</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-[#DDB892]/20 shadow-sm">
                <Sparkles className="w-5 h-5 text-[#DDB892]" />
                <span className="text-[#DDB892] font-semibold">
                  One inspiring story
                </span>
              </div>
            </div>
          </motion.div>

          {profileData.generatedAt && (
            <motion.div
              className="flex items-center justify-center gap-2 text-sm text-[#6B6560]/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Clock className="w-4 h-4 text-[#8B9DC3]" />
              <span>Last updated: {formatDate(profileData.generatedAt)}</span>
            </motion.div>
          )}
        </motion.section>

        {/* Your Driving Truth */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-20"
        >
          <Card className="relative bg-gradient-to-br from-[#D4735F]/5 via-white/80 to-[#8B9DC3]/5 border-[#D4735F]/20 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#D4735F] via-[#8B9DC3] to-[#DDB892]" />
            <CardContent className="relative p-12 lg:p-20 text-center">
              <motion.h2
                className="text-3xl lg:text-4xl font-serif text-[#2C2825] mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Their Driving Truth
              </motion.h2>

              <motion.blockquote
                className="text-2xl lg:text-4xl font-serif text-[#2C2825] leading-relaxed italic relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Heart className="w-8 h-8 text-[#D4735F]/30 mx-auto mb-6" />"
                {profileData.yourTruth}"
              </motion.blockquote>
            </CardContent>
          </Card>
        </motion.section>

        {/* Internal Monologue - Public Version */}
        {profileData.honestQuotes && profileData.honestQuotes.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-20"
          >
            <motion.h2
              className="text-3xl lg:text-5xl font-serif text-[#2C2825] mb-16 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Quote className="w-10 h-10 mr-4 text-[#8B9DC3]" />
              Their Reflections
            </motion.h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {profileData.honestQuotes.slice(0, 3).map((quote, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, rotateY: -15 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 0.8 }}
                  whileHover={{ y: -8, rotateY: 5 }}
                >
                  <Card className="relative group bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border-[#F7F5F2] shadow-lg hover:shadow-2xl rounded-2xl h-full transition-all duration-300 overflow-hidden">
                    <CardContent className="relative p-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#D4735F]/20 to-[#8B9DC3]/20 rounded-xl flex items-center justify-center mb-6">
                        <Quote className="w-6 h-6 text-[#D4735F]" />
                      </div>
                      <p className="text-[#2C2825] font-serif italic leading-relaxed text-lg">
                        "{quote}"
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Founder DNA */}
        {profileData.founderDNA && profileData.founderDNA.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-20"
          >
            <motion.h2
              className="text-3xl lg:text-5xl font-serif text-[#2C2825] mb-16 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Brain className="w-10 h-10 mr-4 text-[#D4735F]" />
              Their Founder DNA
            </motion.h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {profileData.founderDNA.map((trait, index) => {
                const traitData =
                  typeof trait === "string"
                    ? { trait, description: "" }
                    : trait;
                const colors = [
                  "from-[#D4735F]/10 to-[#D4735F]/5 border-[#D4735F]/20",
                  "from-[#8B9DC3]/10 to-[#8B9DC3]/5 border-[#8B9DC3]/20",
                  "from-[#DDB892]/10 to-[#DDB892]/5 border-[#DDB892]/20",
                ];
                const textColors = [
                  "text-[#D4735F]",
                  "text-[#8B9DC3]",
                  "text-[#DDB892]",
                ];

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.8 + index * 0.15, duration: 0.8 }}
                    whileHover={{ scale: 1.05, rotateY: 10 }}
                  >
                    <Card
                      className={`relative group bg-gradient-to-br ${
                        colors[index % 3]
                      } backdrop-blur-sm shadow-lg hover:shadow-2xl rounded-3xl h-full transition-all duration-500 overflow-hidden`}
                    >
                      <CardContent className="relative p-8">
                        <Badge
                          className={`bg-gradient-to-r ${colors[index % 3]} ${
                            textColors[index % 3]
                          } border-current/30 rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg mb-6`}
                        >
                          {traitData.trait || traitData.name || traitData}
                        </Badge>

                        {traitData.description && (
                          <p className="text-[#2C2825] text-sm leading-relaxed">
                            {traitData.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Projects Showcase */}
        {profileData.metadata?.projects &&
          profileData.metadata.projects.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mb-20"
            >
              <motion.h2
                className="text-3xl lg:text-5xl font-serif text-[#2C2825] mb-16 flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <Target className="w-10 h-10 mr-4 text-[#8B9DC3]" />
                Their Projects
              </motion.h2>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {profileData.metadata.projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + index * 0.1, duration: 0.8 }}
                    whileHover={{ y: -10, rotateY: 5 }}
                  >
                    <Card className="relative group bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-sm border-[#F7F5F2] shadow-lg hover:shadow-2xl rounded-3xl transition-all duration-500 h-full overflow-hidden">
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4735F]/5 via-transparent to-[#8B9DC3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Top accent line */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4735F] via-[#8B9DC3] to-[#DDB892] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                      <CardContent className="relative p-8">
                        {/* Enhanced project icon */}
                        <motion.div
                          className="relative w-16 h-16 mb-6"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.8 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[#D4735F] to-[#8B9DC3] rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                          <div className="relative w-full h-16 bg-gradient-to-br from-[#D4735F] to-[#8B9DC3] rounded-2xl flex items-center justify-center shadow-lg">
                            <Target className="w-8 h-8 text-white" />
                          </div>
                        </motion.div>

                        <h3 className="text-xl font-serif text-[#2C2825] mb-6 group-hover:text-[#D4735F] transition-colors duration-300">
                          {project.title}
                        </h3>

                        <div className="flex items-center gap-3">
                          <Badge className="bg-[#8B9DC3]/10 text-[#8B9DC3] border-[#8B9DC3]/20 rounded-full text-xs px-3 py-1 font-medium">
                            {project.sessionCount} sessions
                          </Badge>
                          <Badge className="bg-[#DDB892]/10 text-[#DDB892] border-[#DDB892]/20 rounded-full text-xs px-3 py-1 font-medium">
                            {project.stage}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

        {/* Full Narrative */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-20"
        >
          <h2 className="text-3xl lg:text-4xl font-serif text-[#2C2825] mb-12 flex items-center justify-center">
            <Sparkles className="w-8 h-8 mr-4 text-[#D4735F]" />
            Their Story
          </h2>

          <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-2xl rounded-3xl">
            <CardContent className="p-8 lg:p-16">
              <div className="prose prose-xl max-w-none">
                <p className="text-[#2C2825] leading-relaxed text-lg lg:text-xl font-light">
                  {profileData.emotionalBio}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center mb-20"
        >
          <Card className="bg-gradient-to-r from-[#D4735F]/5 to-[#8B9DC3]/5 border-[#D4735F]/20 shadow-lg rounded-3xl">
            <CardContent className="p-12">
              <h3 className="text-2xl font-serif text-[#2C2825] mb-4">
                Inspired by this journey?
              </h3>
              <p className="text-[#6B6560] mb-8 text-lg leading-relaxed">
                Start capturing your own founder story with OverSight
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/">
                  <Button
                    className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] text-white rounded-2xl 
                             hover:from-[#B85A47] hover:to-[#A04A37] transition-all duration-300 
                             shadow-xl hover:shadow-2xl px-10 py-4 text-lg font-medium"
                  >
                    <Sparkles className="w-5 h-5 mr-3" />
                    Start Your Journey
                  </Button>
                </Link>
                <Button
                  onClick={shareProfile}
                  variant="outline"
                  className="border-2 border-[#8B9DC3]/30 text-[#6B6560] hover:bg-[#8B9DC3]/5 hover:text-[#8B9DC3] 
                           hover:border-[#8B9DC3] rounded-2xl transition-all duration-300 px-10 py-4 text-lg font-medium
                           bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
                >
                  <Share2 className="w-5 h-5 mr-3" />
                  Share This Story
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-center py-12 border-t border-[#F7F5F2]"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#D4735F] to-[#8B9DC3] rounded-lg flex items-center justify-center mr-3">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-logo text-[#2C2825]">OverSight</span>
          </div>
          <p className="text-[#6B6560] text-sm mb-2">
            Where founder journeys come to life
          </p>
          <p className="text-[#6B6560]/60 text-xs">
            Profile last updated:{" "}
            {profileData.generatedAt && formatDate(profileData.generatedAt)}
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
