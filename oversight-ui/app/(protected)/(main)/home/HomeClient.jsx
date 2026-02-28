"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Star,
  Calendar,
  TrendingUp,
  Heart,
  ChevronRight,
  Sparkles,
  Clock,
  User,
  ExternalLink,
  Quote,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateUUID } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/nextjs";
import StartSessionModal from "@/components/home/StartSessionModal";
import { getUsername } from "@/utils/usernameHelper";

export default function HomeClient({
  projects: initialProjects,
  sessions: initialSessions,
  stats: initialStats,
  isFirstTime,
  hasProjects: initialHasProjects,
}) {
  const router = useRouter();
  const { user } = useUser();
  const [sessions] = useState(initialSessions);
  const [stats] = useState(initialStats);
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [profileData, setProfileData] = useState(null);

  // Narrative-inspired greetings
  const narrativeGreetings = [
    "your story's waiting to be told",
    "the next chapter is yours to begin",
    "shall we pick up where we left off?",
    "you talk, I'll listen — like always",
    "every founder needs a space to think — this is yours",
    "you've come far — let's make sense of it",
    "sometimes, saying it out loud helps",
    "you don't need all the answers — just start speaking",
    "what's felt heavy lately? let's talk about it",
    "this isn't just story — it's your becoming",
    "not another journaling app — this one remembers you",
    "you build the startup. I'll help build the story",
  ];

  // Sample honest quotes - these would ideally come from the user's actual sessions
  const sampleQuotes = [
    "Sometimes I don't know where this is going — but I can't stop building",
    "The hardest part isn't the code, it's believing it matters",
    "Every day I choose this uncertainty over someone else's certainty",
    "I'm not building a product, I'm building proof that this matters",
    "The vision is clear, the path is fog — and that's exactly where I need to be",
  ];

  // Transform projects data to match modal expectations
  const [projects] = useState(
    (initialProjects || []).map((project) => ({
      ...project,
      stage: project.currentStage, // Map currentStage to stage
      sessionsCount: project.sessionCount, // Map sessionCount to sessionsCount
    }))
  );

  const [isStartSessionModalOpen, setIsStartSessionModalOpen] = useState(false);

  // Rotate greetings every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreeting((prev) => (prev + 1) % narrativeGreetings.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % sampleQuotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Fetch user's profile data for sidebar
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        }
      } catch (error) {
        console.log("Could not fetch profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  // Handle viewing public profile
  const handleViewPublicProfile = () => {
    const username = getUsername(user);
    if (username) {
      window.open(`/u/${username}`, "_blank");
    }
  };

  // Handle viewing full profile
  const handleViewFullProfile = () => {
    router.push("/profile");
  };

  // Get session duration display with emoji indicators
  const getDurationDisplay = (session) => {
    // Since there's no duration field, we'll estimate based on transcript length
    if (!session.transcript) return { icon: "☕", text: "a coffee break" };

    const words = session.transcript.split(" ").length;
    const estimatedMinutes = Math.round(words / 150); // Average speaking pace

    if (estimatedMinutes <= 15) return { icon: "☕", text: "a coffee break" };
    if (estimatedMinutes <= 30) return { icon: "🔥", text: "a deep dive" };
    return { icon: "⭐", text: "an odyssey" };
  };

  // Handle new session creation
  const handleNewSession = () => {
    setIsStartSessionModalOpen(true);
  };

  // Handle starting a new project/session
  const handleStartNewProject = () => {
    const sessionId = generateUUID();
    router.push(`/record/${sessionId}`);
  };

  // Handle continuing an existing project
  const handleContinueProject = (projectId) => {
    const sessionId = generateUUID();
    router.push(`/record/${sessionId}?projectId=${projectId}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-hidden">
      {/* Subtle background gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F2] via-transparent to-[#F7F5F2] opacity-60" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E4B08F]/10 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#8B9DC3]/8 via-transparent to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 flex">
        {/* Main Content */}
        <div className="flex-1 p-6 md:p-12 lg:pr-6">
          <motion.div
            className="max-w-4xl mx-auto lg:mx-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Section */}
            <motion.div
              className="text-center lg:text-left mb-16"
              variants={itemVariants}
            >
              {/* Rotating narrative greeting */}
              <div className="h-20 md:h-24 mb-8 flex items-center justify-center lg:justify-start">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={currentGreeting}
                    className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-[#2C2825] leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  >
                    {narrativeGreetings[currentGreeting]}
                  </motion.h1>
                </AnimatePresence>
              </div>

              {/* Steve Jobs Quote */}
              <motion.p
                className="text-[#8B9DC3] text-lg md:text-xl font-light italic tracking-wide mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                "The most powerful person in the world is the storyteller" —
                Steve Jobs
              </motion.p>

              {/* Action Buttons Row */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {/* Main CTA Button */}
                <Button
                  onClick={handleNewSession}
                  className="group relative bg-gradient-to-r from-[#D4735F] to-[#B85A47] 
                            hover:from-[#C66A56] hover:to-[#A5533F] text-white 
                            px-12 py-6 text-lg font-medium rounded-2xl 
                            transition-all duration-300 ease-out
                            hover:scale-105 hover:shadow-2xl hover:shadow-[#D4735F]/30
                            border-0 overflow-hidden"
                >
                  <div className="flex items-center space-x-3 relative z-10">
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
                      <Flame className="w-5 h-5 text-white drop-shadow-sm" />
                    </motion.div>
                    <span className="lowercase tracking-wide font-medium drop-shadow-sm">
                      start talking
                    </span>
                  </div>
                </Button>

                {/* View Full Profile Button */}
                <Button
                  onClick={handleViewFullProfile}
                  variant="outline"
                  className="border-2 border-[#8B9DC3]/30 text-[#2C2825] hover:bg-[#8B9DC3]/10 
                            px-8 py-6 text-lg font-medium rounded-2xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>✍️ view full profile</span>
                  </div>
                </Button>
              </motion.div>

              {/* Rotating Quote */}
              <motion.div
                className="bg-white/50 backdrop-blur-sm border border-[#E4B08F]/20 rounded-2xl p-6 mb-8 max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-start space-x-3">
                  <Quote className="w-6 h-6 text-[#D4735F] mt-1 flex-shrink-0" />
                  <div className="min-h-[60px] flex items-center">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={currentQuote}
                        className="text-[#2C2825] text-lg font-medium italic leading-relaxed"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.8 }}
                      >
                        ✨ Quote of the Journey: "{sampleQuotes[currentQuote]}"
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Recent Sessions Section */}
            {sessions.length > 0 && (
              <motion.div className="mb-16" variants={itemVariants}>
                <div className="flex items-center space-x-3 mb-8">
                  <h2 className="text-3xl font-serif text-[#2C2825] font-light">
                    recent chapters
                  </h2>
                  <Sparkles className="w-6 h-6 text-[#D4735F]" />
                  {sessions.length > 0 && (
                    <motion.span
                      className="text-sm text-[#8B9DC3] font-light bg-[#8B9DC3]/10 px-3 py-1 rounded-full"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {sessions.length} latest
                    </motion.span>
                  )}
                </div>

                <div className="space-y-4">
                  {sessions.slice(0, 3).map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: index * 0.1 + 0.8 },
                      }}
                    >
                      <SessionCard
                        session={session}
                        getDurationDisplay={getDurationDisplay}
                        router={router}
                      />
                    </motion.div>
                  ))}

                  {/* Show link to view all sessions if there are more */}
                  {sessions.length > 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="pt-4"
                    >
                      <div className="text-center">
                        <button
                          onClick={() => router.push("/sessions")}
                          className="text-[#8B9DC3] hover:text-[#D4735F] text-sm font-light transition-colors duration-300 group"
                        >
                          <span>view all {sessions.length} chapters</span>
                          <ChevronRight className="inline w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Empty State for new users */}
            {sessions.length === 0 && (
              <motion.div className="text-center py-20" variants={itemVariants}>
                <div className="space-y-8">
                  {/* Abstract illustration */}
                  <motion.div
                    className="flex justify-center mb-12"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <div className="relative w-40 h-40">
                      {/* Layered circles with gradients */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#E4B08F] to-[#F7F5F2] rounded-full opacity-60"
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.6, 0.8, 0.6],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute inset-6 bg-gradient-to-tr from-[#8B9DC3] to-[#E4B08F] rounded-full opacity-50"
                        animate={{
                          scale: [1.05, 1, 1.05],
                          opacity: [0.5, 0.7, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: 0.5,
                        }}
                      />
                      <div className="absolute inset-12 bg-white rounded-full shadow-lg" />

                      {/* Center flame */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Flame className="w-12 h-12 text-[#D4735F]" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.h3
                    className="text-2xl font-serif text-[#2C2825] font-light max-w-lg mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    every story starts with silence
                  </motion.h3>

                  <motion.p
                    className="text-[#8B9DC3] font-light text-lg max-w-md mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    when you're ready, just speak your truth
                  </motion.p>
                </div>
              </motion.div>
            )}

            {/* Stats Section - only if user has sessions */}
            {stats.totalSessions > 0 && (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
                variants={itemVariants}
              >
                <StatsCard
                  icon={<Calendar className="w-5 h-5" />}
                  value={stats.totalSessions}
                  label="chapters told"
                  accent="terracotta"
                />
                <StatsCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  value={stats.sessionsThisMonth}
                  label="this month"
                  accent="dusty-blue"
                />
                <StatsCard
                  icon={<Heart className="w-5 h-5" />}
                  value={stats.mostCommonMood || "reflective"}
                  label="recent mood"
                  accent="sage"
                />
                <StatsCard
                  icon={<Star className="w-5 h-5" />}
                  value={stats.projectsInProgress || 0}
                  label="active stories"
                  accent="terracotta"
                />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Founder DNA Sidebar (Desktop Only) */}
        <div className="hidden lg:block w-80 p-6">
          <motion.div
            className="sticky top-6 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Your Founder DNA Card */}
            <Card className="bg-white/80 backdrop-blur-sm border border-[#E4B08F]/20 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4735F] to-[#B85A47] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-serif font-medium text-[#2C2825]">
                      Your Founder DNA
                    </h3>
                  </div>

                  {profileData ? (
                    <div className="space-y-4">
                      {/* Headline */}
                      {profileData.headlineTruth && (
                        <div className="p-4 bg-gradient-to-r from-[#F7F5F2] to-[#E4B08F]/10 rounded-xl border border-[#E4B08F]/20">
                          <p className="text-[#2C2825] font-medium text-sm leading-relaxed">
                            "{profileData.headlineTruth}"
                          </p>
                        </div>
                      )}

                      {/* DNA Tags */}
                      {profileData.personalityTraits &&
                        profileData.personalityTraits.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-[#6B6560] uppercase tracking-wide">
                              DNA Tags
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {profileData.personalityTraits
                                .slice(0, 3)
                                .map((trait, index) => (
                                  <span
                                    key={index}
                                    className="text-xs px-3 py-1 bg-[#8B9DC3]/10 text-[#8B9DC3] rounded-full border border-[#8B9DC3]/20"
                                  >
                                    {trait.trait || trait}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}

                      {/* Last Session Mood */}
                      {sessions[0]?.mood && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-[#6B6560] uppercase tracking-wide">
                            Last session mood
                          </p>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-[#D4735F]"></div>
                            <span className="text-sm text-[#2C2825] capitalize">
                              {sessions[0].mood}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-[#D4735F] border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-[#8B9DC3] text-sm">
                        Loading your DNA...
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-[#F7F5F2] space-y-3">
                    <Button
                      onClick={handleViewFullProfile}
                      variant="outline"
                      className="w-full border border-[#8B9DC3]/30 text-[#2C2825] hover:bg-[#8B9DC3]/10 text-sm"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      ✍️ view full profile
                    </Button>

                    <Button
                      onClick={handleViewPublicProfile}
                      variant="outline"
                      className="w-full border border-[#D4735F]/30 text-[#D4735F] hover:bg-[#D4735F]/10 text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Share on LinkedIn
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            {stats.totalSessions > 0 && (
              <Card className="bg-white/60 backdrop-blur-sm border border-[#8B9DC3]/20 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-serif font-medium text-[#2C2825] mb-4">
                    Your Journey
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6B6560]">
                        Total sessions
                      </span>
                      <span className="text-lg font-semibold text-[#2C2825]">
                        {stats.totalSessions}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#6B6560]">This month</span>
                      <span className="text-lg font-semibold text-[#2C2825]">
                        {stats.sessionsThisMonth || 0}
                      </span>
                    </div>
                    {projects.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#6B6560]">
                          Active projects
                        </span>
                        <span className="text-lg font-semibold text-[#2C2825]">
                          {projects.length}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {/* Start Session Modal */}
      <StartSessionModal
        isOpen={isStartSessionModalOpen}
        onClose={() => setIsStartSessionModalOpen(false)}
        projects={projects}
        onContinueProject={handleContinueProject}
        onStartNewProject={handleStartNewProject}
      />
    </div>
  );
}

// Individual Session Card Component
function SessionCard({ session, getDurationDisplay, router }) {
  const duration = getDurationDisplay(session);

  const handleSessionClick = () => {
    // Navigate to session report page
    router.push(`/session/${session.id}/report`);
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.99 }}
    >
      <Card
        className="group cursor-pointer bg-white/90 backdrop-blur-sm 
                   border border-[#F7F5F2] hover:border-[#D4735F]/30
                   shadow-sm hover:shadow-xl hover:shadow-[#D4735F]/10
                   transition-all duration-300 ease-out rounded-2xl overflow-hidden
                   hover:bg-white/95"
        onClick={handleSessionClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-3">
              {/* Session Content Preview */}
              <div className="space-y-2">
                {/* Use sessionTitle or yourStory for title */}
                {(session.sessionTitle || session.yourStory) && (
                  <h3 className="text-lg font-serif text-[#2C2825] font-medium line-clamp-2 leading-snug group-hover:text-[#D4735F] transition-colors duration-300">
                    {session.sessionTitle ||
                      (session.yourStory
                        ? `${session.yourStory.substring(0, 60)}...`
                        : "Untitled Chapter")}
                  </h3>
                )}

                {/* Use project name and mood for description */}
                {(session.projectName || session.mood) && (
                  <div className="flex items-center space-x-2">
                    {session.projectName && (
                      <span className="text-[#6B6560] text-xs font-medium bg-[#F7F5F2] px-2 py-1 rounded-full border border-[#F7F5F2] group-hover:bg-[#8B9DC3]/10 group-hover:border-[#8B9DC3]/20 transition-all duration-300">
                        {session.projectName}
                      </span>
                    )}
                    {session.mood && (
                      <span className="text-[#D4735F] text-xs font-light capitalize px-2 py-1 rounded-full bg-[#D4735F]/10">
                        {session.mood}
                      </span>
                    )}
                  </div>
                )}

                {/* Show transcript preview if no title */}
                {!session.sessionTitle &&
                  !session.yourStory &&
                  session.transcript && (
                    <p className="text-[#6B6560] line-clamp-2 leading-relaxed text-sm">
                      {session.transcript.substring(0, 120)}...
                    </p>
                  )}

                {/* Fallback for completely empty sessions */}
                {!session.sessionTitle &&
                  !session.yourStory &&
                  !session.transcript && (
                    <p className="text-[#8B9DC3] italic text-sm">
                      Session in progress...
                    </p>
                  )}
              </div>

              {/* Session Metadata */}
              <div className="flex items-center space-x-4 text-xs">
                {/* Duration with emoji */}
                <div className="flex items-center space-x-1.5 text-[#6B6560]">
                  <span className="text-sm">{duration.icon}</span>
                  <span className="font-light">{duration.text}</span>
                </div>

                {/* Timestamp */}
                <div className="flex items-center space-x-1.5 text-[#6B6560]">
                  <Clock className="w-3 h-3" />
                  <span className="font-light">
                    {formatDistanceToNow(new Date(session.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow with terracotta hover */}
            <motion.div
              className="ml-4 text-[#6B6560] group-hover:text-[#D4735F] transition-colors duration-300"
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Stats Card Component
function StatsCard({ icon, value, label, accent = "dusty-blue" }) {
  const accentColors = {
    terracotta: "text-[#D4735F] bg-[#D4735F]/10 border-[#D4735F]/20",
    "dusty-blue": "text-[#8B9DC3] bg-[#8B9DC3]/10 border-[#8B9DC3]/20",
    sage: "text-[#7FB069] bg-[#7FB069]/10 border-[#7FB069]/20",
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      <Card
        className="bg-white/70 backdrop-blur-sm border border-[#F7F5F2] 
                       hover:border-[#E4B08F]/30 hover:shadow-lg hover:shadow-[#E4B08F]/10
                       transition-all duration-300 rounded-2xl overflow-hidden"
      >
        <CardContent className="p-6 text-center space-y-4">
          <motion.div
            className={`inline-flex p-3 rounded-xl border ${accentColors[accent]}`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
          <div className="space-y-2">
            <motion.div
              className="text-2xl font-semibold text-[#2C2825] font-serif"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {typeof value === "string" ? value : value.toLocaleString()}
            </motion.div>
            <div className="text-sm text-[#6B6560] font-light lowercase tracking-wide">
              {label}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
