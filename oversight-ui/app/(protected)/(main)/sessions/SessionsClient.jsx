"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Calendar,
  Heart,
  MoreVertical,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Plus,
  Clock,
  Quote,
  TrendingUp,
  Grid3X3,
  List,
  ArrowRight,
  Eye,
  BookOpen,
  Sparkles,
  ChevronRight,
  Star,
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
import { formatDistanceToNow } from "date-fns";
import { useStartSessionModal } from "@/hooks/useStartSessionModal";
import StartSessionModal from "@/components/home/StartSessionModal";

export default function SessionsClient({ sessions, stats, userName }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMood, setFilterMood] = useState("");
  const [viewMode, setViewMode] = useState("grid");
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
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const calculateDuration = (transcript) => {
    if (!transcript) return "0m";
    const words = transcript.split(" ").length;
    const avgWordsPerMinute = 150;
    const minutes = Math.ceil(words / avgWordsPerMinute);
    return `${minutes}m`;
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
            .includes(searchQuery.toLowerCase())) ||
        (session.tags &&
          session.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ));

      const matchesMood = !filterMood || session.mood === filterMood;
      return matchesSearch && matchesMood;
    });
  }, [sessions, searchQuery, filterMood]);

  const uniqueMoods = useMemo(() => {
    return [...new Set(sessions.map((s) => s.mood))].filter(Boolean);
  }, [sessions]);

  // Time-aware greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning reflections";
    if (hour < 17) return "afternoon thoughts";
    return "evening stories";
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F2] via-transparent to-[#F7F5F2] opacity-60" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-[#8B9DC3]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-[#D4735F]/5 rounded-full blur-3xl" />

      <div className="relative z-10 px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-light text-[#2C2825] mb-3">
              your story collection, {userName}
            </h1>
            <p className="text-[#8B9DC3] text-lg font-light">
              every session is a chapter in your founder's journey •{" "}
              {getTimeGreeting()}
            </p>
          </motion.div>

          {sessions.length === 0 ? (
            // Empty State
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-8">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-16 h-16 text-[#D4735F] mx-auto mb-4" />
                </motion.div>
                <h2 className="text-2xl font-serif text-[#2C2825] font-light mb-4">
                  your first chapter awaits
                </h2>
                <p className="text-[#8B9DC3] font-light text-lg mb-8 max-w-md mx-auto">
                  every great story starts with silence. ready to discover your
                  founder narrative?
                </p>
                <Button
                  onClick={handleNewSession}
                  className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] text-white px-8 py-3 rounded-xl 
                           hover:from-[#B85A47] hover:to-[#A04A37] transition-all duration-300 
                           shadow-lg hover:shadow-xl hover:scale-105 group"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Flame className="w-4 h-4 mr-2" />
                  </motion.div>
                  begin your story
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B6560] w-4 h-4" />
                    <Input
                      placeholder="search your stories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 bg-white/80 border-[#F7F5F2] rounded-xl focus:border-[#8B9DC3] 
                               transition-colors text-[#2C2825] placeholder:text-[#6B6560]"
                    />
                  </div>

                  {/* Mood Filter */}
                  {uniqueMoods.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-xl border-[#F7F5F2] bg-white/80 text-[#2C2825] 
                                   hover:bg-[#8B9DC3]/10 hover:border-[#8B9DC3]"
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          {filterMood || "all moods"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border-[#F7F5F2] rounded-xl">
                        <DropdownMenuItem
                          onClick={() => setFilterMood("")}
                          className="text-[#2C2825] hover:bg-[#F7F5F2]"
                        >
                          all moods
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#F7F5F2]" />
                        {uniqueMoods.map((mood) => (
                          <DropdownMenuItem
                            key={mood}
                            onClick={() => setFilterMood(mood)}
                            className="text-[#2C2825] hover:bg-[#F7F5F2]"
                          >
                            {mood}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* View Toggle & New Session */}
                <div className="flex items-center gap-3">
                  <div className="flex bg-white/80 rounded-xl border border-[#F7F5F2] p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`rounded-lg ${
                        viewMode === "grid"
                          ? "bg-[#8B9DC3] text-white"
                          : "text-[#6B6560] hover:text-[#2C2825] hover:bg-[#F7F5F2]"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`rounded-lg ${
                        viewMode === "list"
                          ? "bg-[#8B9DC3] text-white"
                          : "text-[#6B6560] hover:text-[#2C2825] hover:bg-[#F7F5F2]"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={handleNewSession}
                    className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] text-white rounded-xl 
                             hover:from-[#B85A47] hover:to-[#A04A37] transition-all duration-300 
                             shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    new session
                  </Button>
                </div>
              </div>

              {/* Results Info */}
              {searchQuery && (
                <div className="mb-6">
                  <p className="text-[#6B6560] text-sm">
                    found {filteredSessions.length} session
                    {filteredSessions.length !== 1 ? "s" : ""}
                    {filterMood && ` with "${filterMood}" mood`}
                  </p>
                </div>
              )}

              {/* Sessions Display */}
              <AnimatePresence mode="wait">
                {filteredSessions.length === 0 ? (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <Quote className="w-12 h-12 text-[#8B9DC3] mx-auto mb-4" />
                    <h3 className="text-xl font-serif text-[#2C2825] mb-2">
                      no stories match your search
                    </h3>
                    <p className="text-[#6B6560]">
                      try adjusting your filters or search terms
                    </p>
                  </motion.div>
                ) : viewMode === "grid" ? (
                  <motion.div
                    key="grid-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredSessions.map((session, index) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        index={index}
                        onDelete={confirmDelete}
                        formatTimeAgo={formatTimeAgo}
                        calculateDuration={calculateDuration}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {filteredSessions.map((session, index) => (
                      <SessionListItem
                        key={session.id}
                        session={session}
                        index={index}
                        onDelete={confirmDelete}
                        formatTimeAgo={formatTimeAgo}
                        calculateDuration={calculateDuration}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-[#F7F5F2] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-[#2C2825]">
              delete session
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#6B6560]">
              are you sure you want to delete "{sessionToDelete?.sessionTitle}"?
              this story will be lost forever.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-[#F7F5F2] text-[#6B6560] hover:bg-[#F7F5F2] rounded-xl"
              disabled={deletingSession}
            >
              keep story
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteSession(sessionToDelete?.sessionId)}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
              disabled={deletingSession}
            >
              {deletingSession ? "deleting..." : "delete forever"}
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

// Session Card Component for Grid View
function SessionCard({
  session,
  index,
  onDelete,
  formatTimeAgo,
  calculateDuration,
}) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <Card
        className="bg-white/90 border-[#F7F5F2] hover:border-[#D4735F]/30 
                     hover:shadow-xl transition-all duration-300 rounded-2xl cursor-pointer h-full"
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3
                className="font-serif text-lg font-medium text-[#2C2825] mb-2 line-clamp-2 
                         group-hover:text-[#D4735F] transition-colors cursor-pointer"
                onClick={() =>
                  router.push(`/session/${session.sessionId}/report`)
                }
              >
                {session.sessionTitle}
              </h3>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#6B6560] text-sm bg-[#F7F5F2] px-3 py-1 rounded-full">
                  {session.projectName}
                </span>
                {session.mood && (
                  <span className="text-[#D4735F] text-xs px-2 py-1 rounded-full bg-[#D4735F]/10">
                    {session.mood}
                  </span>
                )}
              </div>
            </div>

            {/* Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[#6B6560] 
                           hover:text-[#2C2825] hover:bg-[#F7F5F2] rounded-lg"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-[#F7F5F2] rounded-xl">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/session/${session.sessionId}/report`)
                  }
                  className="text-[#2C2825] hover:bg-[#F7F5F2]"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  view report
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#F7F5F2]" />
                <DropdownMenuItem
                  onClick={() => onDelete(session)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  delete session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-[#6B6560] mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(session.createdAt)}
            </div>
            {session.transcript && (
              <div className="flex items-center gap-1">
                <Mic className="w-3 h-3" />
                {calculateDuration(session.transcript)}
              </div>
            )}
          </div>

          {/* Content Preview */}
          {session.oneLiner && (
            <div className="bg-[#8B9DC3]/10 rounded-xl p-3 mb-4">
              <Quote className="w-3 h-3 text-[#8B9DC3] mb-1" />
              <p className="text-[#2C2825] text-sm line-clamp-2 italic">
                "{session.oneLiner}"
              </p>
            </div>
          )}

          {/* Action */}
          <Button
            onClick={() => router.push(`/session/${session.sessionId}/report`)}
            variant="ghost"
            className="w-full mt-2 text-[#8B9DC3] hover:text-[#D4735F] hover:bg-[#D4735F]/5 
                     transition-colors rounded-xl group/btn"
          >
            explore this chapter
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Session List Item Component for List View
function SessionListItem({
  session,
  index,
  onDelete,
  formatTimeAgo,
  calculateDuration,
}) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Card
        className="bg-white/90 border-[#F7F5F2] hover:border-[#D4735F]/30 
                     hover:shadow-lg transition-all duration-300 rounded-2xl group"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div
              className="flex-1 cursor-pointer"
              onClick={() =>
                router.push(`/session/${session.sessionId}/report`)
              }
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3
                    className="font-serif text-lg font-medium text-[#2C2825] mb-1 
                               group-hover:text-[#D4735F] transition-colors"
                  >
                    {session.sessionTitle}
                  </h3>

                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#6B6560] text-sm bg-[#F7F5F2] px-3 py-1 rounded-full">
                      {session.projectName}
                    </span>
                    {session.mood && (
                      <span className="text-[#D4735F] text-xs px-2 py-1 rounded-full bg-[#D4735F]/10">
                        {session.mood}
                      </span>
                    )}
                  </div>

                  {session.oneLiner && (
                    <p className="text-[#6B6560] text-sm line-clamp-1 italic mb-2">
                      "{session.oneLiner}"
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-[#6B6560]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(session.createdAt)}
                    </div>
                    {session.transcript && (
                      <div className="flex items-center gap-1">
                        <Mic className="w-3 h-3" />
                        {calculateDuration(session.transcript)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() =>
                  router.push(`/session/${session.sessionId}/report`)
                }
                variant="ghost"
                size="sm"
                className="text-[#8B9DC3] hover:text-[#D4735F] hover:bg-[#D4735F]/5 rounded-xl"
              >
                <Eye className="w-4 h-4 mr-1" />
                view
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#6B6560] hover:text-[#2C2825] hover:bg-[#F7F5F2] rounded-lg"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-[#F7F5F2] rounded-xl">
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/session/${session.sessionId}/report`)
                    }
                    className="text-[#2C2825] hover:bg-[#F7F5F2]"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    view report
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#F7F5F2]" />
                  <DropdownMenuItem
                    onClick={() => onDelete(session)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    delete session
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
