'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '@/lib/api/projects';

interface ProjectContextType {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  isLoadingProject: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);

  // Load selected project from localStorage on mount
  useEffect(() => {
    const savedProjectId = localStorage.getItem('selectedProjectId');
    if (savedProjectId) {
      // The actual project data will be loaded by the component that needs it
      // We just store the ID here
    }
    // If no saved project, stop loading state
    if (!savedProjectId) {
      setIsLoadingProject(false);
    }
  }, []);

  // Save selected project ID to localStorage when it changes
  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem('selectedProjectId', selectedProject.id);
      setIsLoadingProject(false);
    } else {
      localStorage.removeItem('selectedProjectId');
    }
  }, [selectedProject]);

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject, isLoadingProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
