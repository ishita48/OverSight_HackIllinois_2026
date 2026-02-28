"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ArrowRight, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";

const stageColors = {
  idea: "bg-yellow-100 text-yellow-700 border-yellow-200",
  validating: "bg-orange-100 text-orange-700 border-orange-200",
  building: "bg-blue-100 text-blue-700 border-blue-200",
  launched: "bg-green-100 text-green-700 border-green-200",
  growing: "bg-purple-100 text-purple-700 border-purple-200",
  pivoting: "bg-red-100 text-red-700 border-red-200",
};

const stageLabels = {
  idea: "Idea",
  validating: "Validating",
  building: "Building",
  launched: "Launched",
  growing: "Growing",
  pivoting: "Pivoting",
};

export default function ProjectSelector({
  isOpen,
  onClose,
  projects,
  onContinueProject,
  onStartNewProject,
}) {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="relative bg-white/95 backdrop-blur-xl border-stone-200/50 shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
              {/* Header */}
              <CardHeader className="flex flex-row items-center justify-between border-b border-stone-200/50 pb-4">
                <div>
                  <CardTitle className="text-stone-900 flex items-center text-xl">
                    <Sparkles className="w-5 h-5 mr-2 text-orange-500" />
                    Start a Voice Session
                  </CardTitle>
                  <CardDescription className="text-stone-600 mt-1">
                    Continue working on an existing project or start something
                    new
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-stone-400 hover:text-stone-700 hover:bg-stone-100/50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              {/* Content */}
              <CardContent className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {/* New Project Option */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={onStartNewProject}
                    className="group cursor-pointer"
                  >
                    <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200/50 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-orange-300/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mr-4 shadow-sm">
                              <Plus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-stone-900 group-hover:text-orange-700 transition-colors">
                                Start New Project
                              </h3>
                              <p className="text-stone-600 text-sm">
                                Begin a fresh story and capture new ideas
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Existing Projects */}
                  {projects.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-stone-700 uppercase tracking-wide">
                        Continue Previous Project
                      </h3>

                      {projects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => onContinueProject(project.id)}
                          className="group cursor-pointer"
                        >
                          <Card className="bg-white/70 border-stone-200/50 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-stone-300/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center mb-2">
                                    <h3 className="text-lg font-semibold text-stone-900 group-hover:text-orange-700 transition-colors truncate mr-3">
                                      {project.name}
                                    </h3>
                                    <Badge
                                      className={`${
                                        stageColors[project.currentStage] ||
                                        stageColors.idea
                                      } text-xs`}
                                    >
                                      {stageLabels[project.currentStage] ||
                                        "Unknown"}
                                    </Badge>
                                  </div>

                                  <p className="text-stone-600 text-sm">
                                    {project.sessionCount} session
                                    {project.sessionCount !== 1 ? "s" : ""}{" "}
                                    recorded
                                  </p>

                                  {project.lastSessionSummary && (
                                    <p className="text-stone-500 text-xs mt-1 truncate">
                                      {project.lastSessionSummary}
                                    </p>
                                  )}
                                </div>

                                <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all ml-4" />
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
