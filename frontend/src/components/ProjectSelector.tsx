'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useProject } from '@/contexts/ProjectContext';
import { projectsApi, Project } from '@/lib/api/projects';
import { useRouter } from 'next/navigation';

export default function ProjectSelector() {
  const { selectedProject, setSelectedProject } = useProject();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { data: projects, error } = useSWR<Project[]>(
    '/projects?status=active',
    () => projectsApi.getAll('active'),
    { refreshInterval: 30000 }
  );

  // Auto-select first project if none selected and projects exist
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProject) {
      const savedProjectId = localStorage.getItem('selectedProjectId');
      const projectToSelect = savedProjectId
        ? projects.find((p) => p.id === savedProjectId) || projects[0]
        : projects[0];
      setSelectedProject(projectToSelect);
    }
  }, [projects, selectedProject, setSelectedProject]);

  if (error) {
    return (
      <div className="text-red-600 text-sm">
        Failed to load projects
      </div>
    );
  }

  if (!projects) {
    return (
      <div className="text-gray-500 text-sm">
        Loading...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <button
        onClick={() => router.push('/projects')}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Create Project
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 w-80 max-w-full"
      >
        <span className="truncate flex-1 text-left">{selectedProject?.name || 'Select Project'}</span>
        <svg
          className={`w-2.5 h-2.5 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
            <div className="py-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedProject?.id === project.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  <div className="font-medium truncate">{project.name}</div>
                  {project.description && (
                    <div className="text-xs text-gray-500 truncate">
                      {project.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/projects');
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
              >
                Manage Projects
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
