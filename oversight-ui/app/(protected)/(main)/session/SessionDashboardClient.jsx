"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Calendar,
  Quote,
  Sparkles,
  Play,
  MoreVertical,
  Trash2,
  ExternalLink,
  Eye,
  Heart,
  Clock,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useStartSessionModal } from "@/hooks/useStartSessionModal";
import StartSessionModal from "@/components/home/StartSessionModal";

// Mood emoji mapping for visual appeal
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

export default function SessionDashboardClient({ sessions, stats, userName }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [deletingSession, setDeletingSession] = useState(false);

  // Use the modal hook for session creation
  const {
    isStartSessionModalOpen,
    openStartSessionModal,
    closeStartSessionModal,
    handleStartNewProject,
    handleContinueProject,
    transformedProjects,
  } = useStartSessionModal([]);

  const handleNewSession = openStartSessionModal;

  const handleDeleteSession = async (sessionId) => {
    setDeletingSession(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      toast.success("Session deleted successfully");
      setDeleteDialogOpen(false);
      setSessionToDelete(null);

      // Refresh the page to update the sessions list
      router.refresh();
    } catch (err) {
      console.error("Error deleting session:", err);
      toast.error("Failed to delete session");
    } finally {
      setDeletingSession(false);
    }
  };

  const confirmDelete = (session) => {
    setSessionToDelete(session);
    setDeleteDialogOpen(true);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return `${Math.floor(diffInDays / 30)}mo ago`;
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        !searchQuery ||
        session.sessionTitle
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        session.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (session.oneLiner &&
          session.oneLiner.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (session.sessionReflection &&
          session.sessionReflection
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesMood = !selectedMood || session.mood === selectedMood;

      return matchesSearch && matchesMood;
    });
  }, [sessions, searchQuery, selectedMood]);

  const uniqueMoods = useMemo(() => {
    return [...new Set(sessions.map((s) => s.mood))].filter(Boolean);
  }, [sessions]);

  // Floating background animations
  const FloatingOrb = ({ delay = 0 }) => (
    <motion.div
      className="absolute w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -50, 25, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );

  const SessionCard = ({ session, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group"
    >
      <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 overflow-hidden relative">
        {/* Soft shimmer effect on new sessions */}
        {index < 3 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"
            animate={{ x: [-200, 400] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
        )}

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div
              className="flex-1 cursor-pointer"
              onClick={() =>
                router.push(`/session/${session.sessionId}/report`)
              }
            >
              {/* Mood emoji and title */}
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">
                  {moodEmojis[session.mood] || "💭"}
                </span>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {session.sessionTitle}
                </h3>
              </div>

              {/* Project name */}
              <p className="text-sm text-blue-300 mb-3 font-medium">
                {session.projectName}
              </p>

              {/* Date */}
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(session.createdAt)}</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-800/95 backdrop-blur border-gray-700"
              >
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/session/${session.sessionId}/report`)
                  }
                  className="text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Report
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/u/${userName}/${session.sessionId}`)
                  }
                  className="text-gray-300 hover:text-white hover:bg-gray-700/50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  onClick={() => confirmDelete(session)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* One-liner if available */}
          {session.oneLiner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-900/20 rounded-lg p-3 mb-4 border-l-2 border-blue-400/50"
            >
              <p className="text-blue-200 text-sm font-medium leading-relaxed">
                {session.oneLiner}
              </p>
            </motion.div>
          )}

          {/* Session reflection preview */}
          {session.sessionReflection && (
            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
              {session.sessionReflection}
            </p>
          )}

          {/* Key quote if available */}
          {session.keyQuote && (
            <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <Quote className="w-3 h-3 text-blue-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm italic line-clamp-2">
                  "{session.keyQuote}"
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {session.tags.slice(0, 3).map((tag, tagIndex) => (
                <Badge
                  key={tagIndex}
                  variant="secondary"
                  className="bg-gray-700/50 text-gray-300 text-xs border-0"
                >
                  {tag}
                </Badge>
              ))}
              {session.tags.length > 3 && (
                <Badge
                  variant="secondary"
                  className="bg-gray-700/50 text-gray-400 text-xs border-0"
                >
                  +{session.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/session/${session.sessionId}/report`)}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 p-0 h-auto font-medium"
          >
            Read full story
            <Play className="w-3 h-3 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Floating background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingOrb delay={0} />
        <FloatingOrb delay={2} />
        <FloatingOrb delay={4} />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between"
          >
            <div className="mb-6 md:mb-0">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-2"
              >
                Your Stories
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400"
              >
                {stats.totalSessions}{" "}
                {stats.totalSessions === 1 ? "narrative" : "narratives"} and
                counting, {userName}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={handleNewSession}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {sessions.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Your storytelling journey begins
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Ready to discover your founder narrative? Let's capture your first
              authentic story.
            </p>
            <Button
              onClick={handleNewSession}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              size="lg"
            >
              <Mic className="w-5 h-5 mr-2" />
              Record Your First Story
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 mb-8"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search your stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 backdrop-blur-sm"
                />
              </div>

              {uniqueMoods.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedMood === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood("")}
                    className="border-gray-700/50"
                  >
                    All
                  </Button>
                  {uniqueMoods.slice(0, 4).map((mood) => (
                    <Button
                      key={mood}
                      variant={selectedMood === mood ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMood(mood)}
                      className="border-gray-700/50 capitalize"
                    >
                      {moodEmojis[mood] || "💭"} {mood}
                    </Button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Sessions Grid */}
            <AnimatePresence mode="wait">
              {filteredSessions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">
                    No stories found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filters
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredSessions.map((session, index) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      index={index}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800/95 backdrop-blur border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Story
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{sessionToDelete?.sessionTitle}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
              disabled={deletingSession}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteSession(sessionToDelete?.sessionId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletingSession}
            >
              {deletingSession ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Start Session Modal */}
      <StartSessionModal
        isOpen={isStartSessionModalOpen}
        onClose={closeStartSessionModal}
        projects={transformedProjects}
        onContinueProject={handleContinueProject}
        onStartNewProject={handleStartNewProject}
      />
    </div>
  );
}
