"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Folder,
  Calendar,
  BarChart3,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Share,
  Star,
  Clock,
  Sparkles,
  BookOpen,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateUUID } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useStartSessionModal } from "@/hooks/useStartSessionModal";
import StartSessionModal from "@/components/home/StartSessionModal";

const ProjectsClient = ({ user }) => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use the modal hook for session creation
  const {
    isStartSessionModalOpen,
    openStartSessionModal,
    closeStartSessionModal,
    handleStartNewProject,
    handleContinueProject,
    transformedProjects,
  } = useStartSessionModal(projects);

  // Fetch real projects data
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();

      // Transform API data to match UI expectations
      const transformedProjects = await Promise.all(
        data.projects.map(async (project) => {
          // Get sessions for this project to calculate stats
          try {
            const sessionsResponse = await fetch(
              `/api/projects/${project.id}/sessions`
            );
            let sessionStats = { sessions: [], count: 0 };

            if (sessionsResponse.ok) {
              sessionStats = await sessionsResponse.json();
            }

            const sessions = sessionStats.sessions || [];
            const sessionCount = sessions.length;

            // Calculate total duration from sessions
            const totalMinutes = sessions.reduce((total, session) => {
              // Estimate 15-30 minutes per session based on narrative depth
              const estimatedMinutes = (session.narrativeDepth || 1) * 15;
              return total + estimatedMinutes;
            }, 0);

            // Format duration
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const totalDuration =
              hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

            // Determine status based on stage and recent activity
            const lastActivity = project.updatedAt
              ? new Date(project.updatedAt)
              : new Date(project.createdAt);
            const daysSinceUpdate = Math.floor(
              (new Date() - lastActivity) / (1000 * 60 * 60 * 24)
            );

            let status = "active";
            if (project.currentStage === "launched" && daysSinceUpdate > 30) {
              status = "completed";
            } else if (daysSinceUpdate > 14) {
              status = "paused";
            }

            // Calculate progress based on stage and session count
            const stageProgress = {
              idea: 10,
              validating: 25,
              building: 50,
              launched: 80,
              growing: 90,
              pivoting: 60,
            };

            const baseProgress = stageProgress[project.currentStage] || 10;
            const sessionBonus = Math.min(sessionCount * 5, 30); // Up to 30% bonus for sessions
            const progress = Math.min(baseProgress + sessionBonus, 100);

            // Format last activity
            let lastActivityText = "just now";
            if (daysSinceUpdate === 0) {
              lastActivityText = "today";
            } else if (daysSinceUpdate === 1) {
              lastActivityText = "yesterday";
            } else if (daysSinceUpdate < 7) {
              lastActivityText = `${daysSinceUpdate} days ago`;
            } else if (daysSinceUpdate < 30) {
              const weeks = Math.floor(daysSinceUpdate / 7);
              lastActivityText = `${weeks} week${weeks > 1 ? "s" : ""} ago`;
            } else {
              const months = Math.floor(daysSinceUpdate / 30);
              lastActivityText = `${months} month${months > 1 ? "s" : ""} ago`;
            }

            // Extract tags from recent sessions
            const allTags = sessions.reduce((tags, session) => {
              if (session.tags && Array.isArray(session.tags)) {
                tags.push(...session.tags);
              }
              return tags;
            }, []);

            // Get unique tags and limit to top 3
            const uniqueTags = [...new Set(allTags)].slice(0, 3);

            return {
              id: project.id,
              name: project.name,
              description: project.description || "No description provided",
              status,
              sessionsCount: sessionCount,
              lastActivity: lastActivityText,
              createdAt: project.createdAt,
              isStarred: false, // TODO: Add starring functionality
              tags: uniqueTags.length > 0 ? uniqueTags : [project.currentStage],
              progress,
              totalDuration,
              currentStage: project.currentStage,
              updatedAt: project.updatedAt,
            };
          } catch (sessionError) {
            console.warn(
              `Failed to fetch sessions for project ${project.id}:`,
              sessionError
            );

            // Return project with minimal stats if session fetch fails
            return {
              id: project.id,
              name: project.name,
              description: project.description || "No description provided",
              status: "active",
              sessionsCount: project.sessionCount || 0,
              lastActivity: "unknown",
              createdAt: project.createdAt,
              isStarred: false,
              tags: [project.currentStage],
              progress: 10,
              totalDuration: "0m",
              currentStage: project.currentStage,
              updatedAt: project.updatedAt,
            };
          }
        })
      );

      setProjects(transformedProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesFilter =
      filterStatus === "all" || project.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning focus";
    if (hour < 17) return "afternoon energy";
    return "evening reflection";
  };

  const handleCreateProject = () => {
    // Open the modal to start a new session/project
    openStartSessionModal();
  };

  const handleStartSession = (projectId) => {
    const sessionId = generateUUID();
    router.push(`/record/${sessionId}?projectId=${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // Remove project from local state
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectToDelete.id)
      );

      setDeleteDialogOpen(false);
      setProjectToDelete(null);

      // Show success feedback
      console.log(`Project "${projectToDelete.name}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDFCFB] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="space-y-4">
              <div className="h-8 bg-[#F7F5F2] rounded w-1/4"></div>
              <div className="h-4 bg-[#F7F5F2] rounded w-1/3"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-[#F7F5F2] rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#FDFCFB] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-serif text-[#2C2825]">
                Something went wrong
              </h2>
              <p className="text-[#8B9DC3] max-w-md">
                We couldn't load your projects. Please check your connection and
                try again.
              </p>
              <p className="text-sm text-red-600 font-mono">{error}</p>
            </div>
            <Button
              onClick={fetchProjects}
              className="bg-[#7A5AF8] hover:bg-[#6844F5] text-white px-6 py-2 rounded-xl"
            >
              Try Again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCFB] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-light text-[#2C2825] tracking-tight">
                your narrative projects
              </h1>
              <p className="text-[#6B6560] font-light mt-2">
                {getTimeOfDayGreeting()}, {user?.firstName || "storyteller"}.
                ready to continue weaving your stories?
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleCreateProject}
                className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#B85A47] hover:to-[#A04A37]
                         text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl
                         transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                start new project
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            {
              label: "total projects",
              value: projects.length,
              icon: Folder,
              color: "text-[#D4735F]",
              bgColor: "bg-[#D4735F]/10",
            },
            {
              label: "active sessions",
              value: projects.reduce((acc, p) => acc + p.sessionsCount, 0),
              icon: BarChart3,
              color: "text-[#8B9DC3]",
              bgColor: "bg-[#8B9DC3]/10",
            },
            {
              label: "total hours",
              value: (() => {
                const totalMinutes = projects.reduce((acc, p) => {
                  // Parse duration string like "4h 32m" or "45m"
                  const duration = p.totalDuration || "0m";
                  const hours = duration.match(/(\d+)h/)?.[1] || 0;
                  const minutes = duration.match(/(\d+)m/)?.[1] || 0;
                  return acc + parseInt(hours) * 60 + parseInt(minutes);
                }, 0);

                const hours = Math.floor(totalMinutes / 60);
                const mins = totalMinutes % 60;
                return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
              })(),
              icon: Clock,
              color: "text-[#7FB069]",
              bgColor: "bg-[#7FB069]/10",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2 }}
              className="bg-white/60 backdrop-blur border border-[#F7F5F2] rounded-2xl p-6
                         hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6B6560] text-sm font-light">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-serif font-medium text-[#2C2825] mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6560]" />
              <Input
                placeholder="search projects, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/60 border-[#F7F5F2] rounded-xl focus:ring-2 focus:ring-[#8B9DC3]/20
                         font-light placeholder:text-[#6B6560]"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 bg-white/60 border-[#F7F5F2] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">all status</SelectItem>
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="paused">paused</SelectItem>
                <SelectItem value="completed">completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-lg"
            >
              grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-lg"
            >
              list
            </Button>
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 bg-[#8B9DC3]/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="w-12 h-12 text-[#8B9DC3]" />
            </motion.div>

            <h3 className="text-2xl font-serif font-light text-[#2C2825] mb-4">
              {searchQuery
                ? "no projects match your search"
                : "your narrative canvas awaits"}
            </h3>
            <p className="text-[#6B6560] font-light leading-relaxed max-w-md mx-auto mb-8">
              {searchQuery
                ? "try adjusting your search terms or filters to find what you're looking for"
                : "every great story starts with a single session. create your first project and begin weaving your founder narrative."}
            </p>

            {!searchQuery && (
              <Button
                onClick={handleCreateProject}
                className="bg-gradient-to-r from-[#D4735F] to-[#B85A47] hover:from-[#B85A47] hover:to-[#A04A37]
                         text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                create your first project
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={viewMode === "grid" ? "group" : "group"}
                >
                  <Card
                    className="bg-white/60 backdrop-blur border-[#F7F5F2] hover:shadow-xl 
                                 transition-all duration-300 overflow-hidden h-full"
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3
                              className="text-xl font-serif font-medium text-[#2C2825] 
                                         group-hover:text-[#D4735F] transition-colors"
                            >
                              {project.name}
                            </h3>
                            {project.isStarred && (
                              <Star className="w-4 h-4 text-[#E3B505] fill-current" />
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`font-light ${
                                project.status === "active"
                                  ? "border-[#D4735F] text-[#D4735F] bg-[#D4735F]/5"
                                  : project.status === "paused"
                                  ? "border-[#8B9DC3] text-[#8B9DC3] bg-[#8B9DC3]/5"
                                  : "border-[#7FB069] text-[#7FB069] bg-[#7FB069]/5"
                              }`}
                            >
                              {project.status}
                            </Badge>
                            <span className="text-xs text-[#6B6560] font-light">
                              {project.lastActivity}
                            </span>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              edit project
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="w-4 h-4 mr-2" />
                              share project
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="w-4 h-4 mr-2" />
                              archive project
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              delete project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <p className="text-[#6B6560] font-light leading-relaxed line-clamp-3">
                        {project.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6B6560] font-light">
                            progress
                          </span>
                          <span className="text-[#2C2825] font-medium">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-[#F7F5F2] rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-[#8B9DC3] to-[#D4735F] h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-[#6B6560]">
                            <BookOpen className="w-4 h-4" />
                            <span className="font-light">
                              {project.sessionsCount} sessions
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[#6B6560]">
                            <Clock className="w-4 h-4" />
                            <span className="font-light">
                              {project.totalDuration}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="text-xs font-light bg-[#8B9DC3]/10 text-[#8B9DC3] hover:bg-[#8B9DC3]/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-[#F7F5F2]">
                        <Button
                          onClick={() => handleStartSession(project.id)}
                          className="flex-1 bg-gradient-to-r from-[#D4735F] to-[#B85A47] 
                                   hover:from-[#B85A47] hover:to-[#A04A37] text-white rounded-xl
                                   font-medium shadow-md hover:shadow-lg transition-all"
                        >
                          <Target className="w-4 h-4 mr-2" />
                          continue story
                        </Button>

                        <Link href={`/projects/${project.id}`}>
                          <Button
                            variant="outline"
                            className="border-[#F7F5F2] text-[#6B6560] hover:bg-[#F7F5F2] 
                                     hover:text-[#2C2825] rounded-xl"
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            insights
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          onClick={() => router.push(`/project/${project.id}`)}
                          className="border-[#F7F5F2] text-[#6B6560] hover:bg-[#8B9DC3]/10 
                                   hover:text-[#8B9DC3] hover:border-[#8B9DC3] rounded-xl transition-all"
                          title="Share project"
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-[#E5E5E0]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-[#2C2825]">
              Delete Project
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#6B6560] font-light">
              Are you sure you want to delete "{projectToDelete?.name}"? This
              will permanently delete the project and all{" "}
              {projectToDelete?.sessionsCount || 0} session
              {projectToDelete?.sessionsCount !== 1 ? "s" : ""} associated with
              it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="bg-[#F7F5F2] border-[#E5E5E0] text-[#6B6560] hover:bg-[#F0EDE8]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
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
    </main>
  );
};

export default ProjectsClient;
