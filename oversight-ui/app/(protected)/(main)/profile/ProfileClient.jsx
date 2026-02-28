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
  Download,
  Share2,
  Play,
  Mic,
  BarChart3,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import StartSessionModal from "@/components/home/StartSessionModal";
import { exportProfileToPDF } from "@/utils/pdfExport";
import { toast } from "sonner";
import { getUsername } from "@/utils/usernameHelper";

export default function ProfileClient() {
  const { user } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStartSessionModalOpen, setIsStartSessionModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profile");

      if (!response.ok) {
        if (response.status === 404) {
          const data = await response.json();
          if (data.isEmpty) {
            setError("empty");
            return;
          }
        }
        throw new Error("Failed to load profile");
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
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

  const handleExportProfile = async () => {
    if (!profileData || !user) {
      toast.error("Profile data not available for export");
      return;
    }

    try {
      setIsExporting(true);
      toast.loading("Generating your profile PDF...", { id: "export-toast" });

      await exportProfileToPDF(profileData, user);

      toast.success("Profile exported successfully! Check your downloads.", {
        id: "export-toast",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error exporting profile:", error);
      toast.error("Failed to export profile. Please try again.", {
        id: "export-toast",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePublicProfile = async () => {
    if (!user) {
      toast.error("User information not available");
      return;
    }

    try {
      toast.loading("Setting up your public profile...", {
        id: "public-profile-toast",
      });

      // Get username from email (simple approach)
      const username = getUsername(user);

      if (!username) {
        toast.error("Unable to generate username from email", {
          id: "public-profile-toast",
        });
        return;
      }

      // Build public profile URL
      const publicUrl = `${window.location.origin}/u/${username}`;

      // Open in new tab
      window.open(publicUrl, "_blank");

      toast.success("Public profile opened! Share this link anywhere.", {
        id: "public-profile-toast",
        duration: 4000,
        action: {
          label: "Copy Link",
          onClick: () => {
            navigator.clipboard.writeText(publicUrl);
            toast.success("Link copied to clipboard!");
          },
        },
      });
    } catch (error) {
      console.error("Error accessing public profile:", error);
      toast.error("Failed to access public profile. Please try again.", {
        id: "public-profile-toast",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4735F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B6560] text-lg">
            Analyzing your founder journey...
          </p>
          <p className="text-[#6B6560]/60 text-sm mt-2">
            Weaving together your story...
          </p>
        </div>
      </div>
    );
  }

  if (error === "empty") {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="text-center max-w-md">
          <Brain className="w-20 h-20 text-[#6B6560]/30 mx-auto mb-6" />
          <h2 className="text-2xl font-serif text-[#2C2825] mb-3">
            Your story is still unfolding
          </h2>
          <p className="text-[#6B6560] mb-8 leading-relaxed">
            Complete a few sessions to unlock your founder profile. Every great
            story starts with a single chapter.
          </p>
          <Button
            onClick={() => setIsStartSessionModalOpen(true)}
            className="bg-[#D4735F] hover:bg-[#B85A47] text-white rounded-xl px-8 py-3"
          >
            <Mic className="w-4 h-4 mr-2" />
            Start Your First Session
          </Button>
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
            Something went wrong
          </h2>
          <p className="text-[#6B6560] mb-6">
            We couldn't load your profile right now. Please try again.
          </p>
          <Button
            onClick={fetchProfile}
            variant="outline"
            className="border-[#D4735F] text-[#D4735F] hover:bg-[#D4735F]/5"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const getFounderType = () => {
    if (profileData.founderDNA && profileData.founderDNA.length > 0) {
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
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#8B9DC3]/4 to-[#D4735F]/4 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "4s" }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #2C2825 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* 1. Founder Hero Section - Enhanced */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          {/* Enhanced Avatar with glow effect */}
          <motion.div
            className="relative w-32 h-32 mx-auto mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4735F] to-[#8B9DC3] rounded-full blur-xl opacity-40 animate-pulse" />
            <div className="relative w-full h-full rounded-full shadow-2xl border-4 border-white/20 overflow-hidden">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
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
              {user?.firstName} {user?.lastName}
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
            <span className="text-[#D4735F] font-semibold">
              {profileData.metadata.totalSessions}
            </span>{" "}
            sessions.
            <span className="text-[#8B9DC3] font-semibold mx-2">
              {profileData.metadata.totalProjects}
            </span>{" "}
            projects.
            <span className="text-[#DDB892] font-semibold">
              One unfolding story.
            </span>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-8 text-sm text-[#6B6560]/80"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-[#F7F5F2] shadow-sm">
              <Calendar className="w-4 h-4 text-[#8B9DC3]" />
              <span>
                Since {formatDate(profileData.metadata.dateRange.first)}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-[#F7F5F2] shadow-sm">
              <Clock className="w-4 h-4 text-[#DDB892]" />
              <span>
                Latest: {formatDate(profileData.metadata.dateRange.latest)}
              </span>
            </div>
          </motion.div>
        </motion.section>

        {/* 2. Your Driving Truth - Enhanced */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-20"
        >
          <Card className="relative bg-gradient-to-br from-[#D4735F]/5 via-white/80 to-[#8B9DC3]/5 border-[#D4735F]/20 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#D4735F] via-[#8B9DC3] to-[#DDB892]" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4735F]/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#8B9DC3]/10 rounded-full blur-2xl" />

            <CardContent className="relative p-12 lg:p-20 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute top-8 left-8"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4735F] to-[#8B9DC3] rounded-2xl flex items-center justify-center shadow-lg">
                  <Flame className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <motion.h2
                className="text-3xl lg:text-4xl font-serif text-[#2C2825] mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Your Driving Truth
              </motion.h2>

              <motion.blockquote
                className="text-2xl lg:text-4xl font-serif text-[#2C2825] leading-relaxed italic relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Heart className="w-8 h-8 text-[#D4735F]/30 mx-auto mb-6" />"
                {profileData.yourTruth}"
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#D4735F]/50 to-transparent rounded-full" />
              </motion.blockquote>
            </CardContent>
          </Card>
        </motion.section>

        {/* 3. Your Internal Monologue - Enhanced */}
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
              Your Internal Monologue
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
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4735F]/5 to-[#8B9DC3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <CardContent className="relative p-8">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-br from-[#D4735F]/20 to-[#8B9DC3]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Quote className="w-6 h-6 text-[#D4735F]" />
                      </motion.div>

                      <p className="text-[#2C2825] font-serif italic leading-relaxed text-lg group-hover:text-[#2C2825]/90 transition-colors duration-300">
                        "{quote}"
                      </p>

                      {/* Decorative bottom accent */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4735F]/30 via-[#8B9DC3]/30 to-[#DDB892]/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 4. The Growth Arc */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-serif text-[#2C2825] mb-12 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 mr-4 text-[#8B9DC3]" />
            The Growth Arc
          </h2>

          <Card className="bg-white/90 backdrop-blur-sm border-[#F7F5F2] shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="space-y-12">
                <div className="relative">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#D4735F] rounded-full mr-6 mt-1 shadow-lg"></div>
                    <div>
                      <h3 className="text-xl font-serif text-[#D4735F] mb-4">
                        Early
                      </h3>
                      <p className="text-[#2C2825] leading-relaxed text-lg">
                        {profileData.growthArc?.early ||
                          "Starting the journey with curiosity and questions."}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-3 top-8 w-px h-16 bg-gradient-to-b from-[#D4735F] to-[#8B9DC3]"></div>
                </div>

                <div className="relative">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#8B9DC3] rounded-full mr-6 mt-1 shadow-lg"></div>
                    <div>
                      <h3 className="text-xl font-serif text-[#8B9DC3] mb-4">
                        Middle
                      </h3>
                      <p className="text-[#2C2825] leading-relaxed text-lg">
                        {profileData.growthArc?.middle ||
                          "Navigating challenges and discovering deeper truths."}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-3 top-8 w-px h-16 bg-gradient-to-b from-[#8B9DC3] to-[#DDB892]"></div>
                </div>

                <div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#DDB892] rounded-full mr-6 mt-1 shadow-lg"></div>
                    <div>
                      <h3 className="text-xl font-serif text-[#DDB892] mb-4">
                        Now
                      </h3>
                      <p className="text-[#2C2825] leading-relaxed text-lg">
                        {profileData.growthArc?.now ||
                          "Building with clarity and conviction."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* 5. Your Founder DNA - Enhanced */}
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
              Your Founder DNA
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
                      {/* Floating particles effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div
                          className="absolute top-4 right-4 w-2 h-2 bg-current rounded-full animate-pulse"
                          style={{ animationDelay: "0s" }}
                        />
                        <div
                          className="absolute top-12 right-8 w-1 h-1 bg-current rounded-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        />
                        <div
                          className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-current rounded-full animate-pulse"
                          style={{ animationDelay: "1s" }}
                        />
                      </div>

                      <CardContent className="relative p-8">
                        <motion.div
                          className="relative mb-6"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.6 }}
                        >
                          <Badge
                            className={`bg-gradient-to-r ${colors[index % 3]} ${
                              textColors[index % 3]
                            } border-current/30 rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg`}
                          >
                            {traitData.trait || traitData.name || traitData}
                          </Badge>
                        </motion.div>

                        {traitData.description && (
                          <motion.p
                            className="text-[#2C2825] text-sm leading-relaxed group-hover:text-[#2C2825]/80 transition-colors duration-300"
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1 }}
                          >
                            {traitData.description}
                          </motion.p>
                        )}

                        {/* Bottom glow effect */}
                        <div
                          className={`absolute bottom-0 left-0 w-full h-px bg-gradient-to-r ${
                            colors[index % 3]
                          } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center`}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* 6. Projects You've Built - Enhanced */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-20"
        >
          <motion.h2
            className="text-3xl lg:text-5xl font-serif text-[#2C2825] mb-16 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Target className="w-10 h-10 mr-4 text-[#8B9DC3]" />
            Projects You've Built
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {profileData.metadata.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1, duration: 0.8 }}
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

                    <div className="flex items-center gap-3 mb-8">
                      <Badge className="bg-[#8B9DC3]/10 text-[#8B9DC3] border-[#8B9DC3]/20 rounded-full text-xs px-3 py-1 font-medium">
                        {project.sessionCount} sessions
                      </Badge>
                      <Badge className="bg-[#DDB892]/10 text-[#DDB892] border-[#DDB892]/20 rounded-full text-xs px-3 py-1 font-medium">
                        {project.stage}
                      </Badge>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        (window.location.href = `/projects/${project.id}`)
                      }
                      className="relative text-[#D4735F] hover:bg-[#D4735F]/5 w-full group/btn rounded-xl py-3 font-medium transition-all duration-300 overflow-hidden"
                    >
                      {/* Button background animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#D4735F]/10 to-[#8B9DC3]/10 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left rounded-xl" />

                      <div className="relative flex items-center justify-center">
                        View Project
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 7. Your Full Narrative */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-serif text-[#2C2825] mb-12 flex items-center justify-center">
            <Sparkles className="w-8 h-8 mr-4 text-[#D4735F]" />
            Your Full Narrative
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

        {/* 8. Mood Summary */}
        {profileData.moodSummary && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-[#8B9DC3]/5 to-[#DDB892]/5 border-[#8B9DC3]/20 shadow-lg rounded-2xl">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-8 h-8 text-[#8B9DC3] mx-auto mb-4" />
                <h3 className="text-xl font-serif text-[#2C2825] mb-4">
                  Your Emotional Journey
                </h3>
                <p className="text-[#6B6560] leading-relaxed">
                  {profileData.moodSummary}
                </p>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* 9. Action Buttons - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsStartSessionModalOpen(true)}
              className="relative group bg-gradient-to-r from-[#D4735F] to-[#B85A47] text-white rounded-2xl 
                       hover:from-[#B85A47] hover:to-[#A04A37] transition-all duration-300 
                       shadow-xl hover:shadow-2xl px-10 py-5 text-lg font-medium overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center">
                <Play className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                Start New Session
              </div>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={handleExportProfile}
              disabled={isExporting}
              className="border-2 border-[#D4735F]/30 text-[#6B6560] hover:bg-[#D4735F]/5 hover:text-[#D4735F] 
                       hover:border-[#D4735F] rounded-2xl transition-all duration-300 px-10 py-5 text-lg font-medium
                       bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download
                className={`w-5 h-5 mr-3 ${
                  isExporting ? "animate-spin" : "group-hover:animate-bounce"
                }`}
              />
              {isExporting ? "Exporting..." : "Export Profile"}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={handlePublicProfile}
              className="border-2 border-[#8B9DC3]/30 text-[#6B6560] hover:bg-[#8B9DC3]/5 hover:text-[#8B9DC3] 
                       hover:border-[#8B9DC3] rounded-2xl transition-all duration-300 px-10 py-5 text-lg font-medium
                       bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl group"
            >
              <ExternalLink className="w-5 h-5 mr-3 group-hover:rotate-45 transition-transform duration-300" />
              Public Profile
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Start Session Modal */}
      <StartSessionModal
        isOpen={isStartSessionModalOpen}
        onClose={() => setIsStartSessionModalOpen(false)}
        projects={
          profileData?.metadata?.projects?.map((project) => ({
            ...project,
            stage: project.stage || "idea",
            sessionsCount: project.sessionCount || 0,
          })) || []
        }
      />
    </div>
  );
}
