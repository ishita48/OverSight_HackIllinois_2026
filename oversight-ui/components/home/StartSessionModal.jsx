"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic2, FolderOpen, Plus, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const stageColors = {
  idea: "bg-amber-50 text-amber-700 border-amber-200",
  validating: "bg-orange-50 text-orange-700 border-orange-200",
  building: "bg-blue-50 text-blue-700 border-blue-200",
  launched: "bg-emerald-50 text-emerald-700 border-emerald-200",
  growing: "bg-purple-50 text-purple-700 border-purple-200",
  pivoting: "bg-rose-50 text-rose-700 border-rose-200",
};

const stageLabels = {
  idea: "Idea",
  validating: "Validating",
  building: "Building",
  launched: "Launched",
  growing: "Growing",
  pivoting: "Pivoting",
};

export default function StartSessionModal({
  isOpen,
  onClose,
  projects = [],
  onContinueProject,
  onStartNewProject,
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleStartFresh = () => {
    onStartNewProject && onStartNewProject();
    onClose();
  };

  const handleContinueProject = (projectId) => {
    onContinueProject && onContinueProject(projectId);
    onClose();
  };

  const lastProject = projects[0]; // Most recent project

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white border border-[#E5E5E0] shadow-xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="font-display text-2xl font-bold text-[#1A1A1A] flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FF3D00]/10 rounded-xl flex items-center justify-center">
              <Mic2 className="w-5 h-5 text-[#FF3D00]" />
            </div>
            <span>Start a Voice Session</span>
          </DialogTitle>
          <p className="font-ui text-[#7C7C7C] mt-2">
            Choose how you'd like to begin today's reflection
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Start Fresh Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={handleStartFresh}
          >
            <div className="bg-gradient-to-r from-[#FF3D00]/5 to-[#FF3D00]/10 border border-[#FF3D00]/20 rounded-2xl p-6 hover:border-[#FF3D00]/30 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#FF3D00]/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#FF3D00]" />
                  </div>
                  <div>
                    <h3 className="font-ui text-lg font-semibold text-[#1A1A1A] mb-1">
                      🎉 Start Fresh
                    </h3>
                    <p className="font-ui text-sm text-[#7C7C7C]">
                      Begin a new thread with whatever's on your mind
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#FF3D00]" />
              </div>
            </div>
          </motion.div>

          {/* Continue Last Project */}
          {lastProject && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              onClick={() => handleContinueProject(lastProject.id)}
            >
              <div className="bg-gradient-to-r from-[#7A5AF8]/5 to-[#7A5AF8]/10 border border-[#7A5AF8]/20 rounded-2xl p-6 hover:border-[#7A5AF8]/30 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#7A5AF8]/10 rounded-xl flex items-center justify-center">
                      <FolderOpen className="w-6 h-6 text-[#7A5AF8]" />
                    </div>
                    <div>
                      <h3 className="font-ui text-lg font-semibold text-[#1A1A1A] mb-1">
                        🗂️ Continue "{lastProject.name}"
                      </h3>
                      <p className="font-ui text-sm text-[#7C7C7C]">
                        Pick up where you left off with your latest project
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge
                          className={`${
                            stageColors[lastProject.stage] || stageColors.idea
                          } font-mono text-xs px-2 py-1`}
                        >
                          {stageLabels[lastProject.stage] || "Unknown"}
                        </Badge>
                        <span className="font-mono text-xs text-[#7C7C7C]">
                          {lastProject.sessionsCount || 0} sessions
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#7A5AF8]" />
                </div>
              </div>
            </motion.div>
          )}

          {/* All Projects Dropdown */}
          {projects.length > 1 && (
            <div className="border border-[#E5E5E0] rounded-2xl overflow-hidden">
              <div className="bg-[#F5F5F0] px-6 py-4 border-b border-[#E5E5E0]">
                <h4 className="font-ui text-sm font-semibold text-[#3A3A3A] mb-1">
                  📁 Choose from All Projects
                </h4>
                <p className="font-mono text-xs text-[#7C7C7C]">
                  Select any of your {projects.length} projects to continue
                </p>
              </div>

              <div className="max-h-48 overflow-y-auto">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ backgroundColor: "#FAF8F4" }}
                    className="px-6 py-4 border-b border-[#E5E5E0] last:border-b-0 cursor-pointer transition-colors duration-200"
                    onClick={() => handleContinueProject(project.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#7A5AF8]/10 rounded-lg flex items-center justify-center">
                          <FolderOpen className="w-4 h-4 text-[#7A5AF8]" />
                        </div>
                        <div>
                          <h5 className="font-ui text-sm font-medium text-[#1A1A1A]">
                            {project.name}
                          </h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              className={`${
                                stageColors[project.stage] || stageColors.idea
                              } font-mono text-xs px-2 py-0.5`}
                            >
                              {stageLabels[project.stage] || "Unknown"}
                            </Badge>
                            <span className="font-mono text-xs text-[#7C7C7C]">
                              {project.sessionsCount || 0} sessions
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#7C7C7C]" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-[#E5E5E0]">
          <p className="font-mono text-xs text-[#7C7C7C] text-center">
            🗣️ I'm all ears. Ready when you are.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
