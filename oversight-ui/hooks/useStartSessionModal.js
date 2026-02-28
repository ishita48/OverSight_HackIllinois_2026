// hooks/useStartSessionModal.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateUUID } from "@/lib/utils";

export function useStartSessionModal(projects = []) {
  const router = useRouter();
  const [isStartSessionModalOpen, setIsStartSessionModalOpen] = useState(false);

  // Transform projects data to match modal expectations
  const transformedProjects = projects.map((project) => ({
    ...project,
    stage: project.currentStage || project.stage, // Map currentStage to stage
    sessionsCount: project.sessionCount || project.sessionsCount, // Map sessionCount to sessionsCount
  }));

  // Open the modal instead of direct navigation
  const openStartSessionModal = () => {
    setIsStartSessionModalOpen(true);
  };

  // Close the modal
  const closeStartSessionModal = () => {
    setIsStartSessionModalOpen(false);
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

  return {
    isStartSessionModalOpen,
    openStartSessionModal,
    closeStartSessionModal,
    handleStartNewProject,
    handleContinueProject,
    transformedProjects,
  };
}

// Also export as default for compatibility
export default useStartSessionModal;
