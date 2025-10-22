'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { projectsApi, Project, CreateProjectDto } from '@/lib/api/projects';
import { useProject } from '@/contexts/ProjectContext';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
  const { setSelectedProject } = useProject();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState<CreateProjectDto>({ name: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('active');

  const { data: projects, error, mutate } = useSWR<Project[]>(
    `/projects?status=${filterStatus}`,
    () => projectsApi.getAll(filterStatus),
    { refreshInterval: 5000 }
  );

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    setIsCreating(true);
    try {
      const created = await projectsApi.create(newProject);
      await mutate();
      setSelectedProject(created);
      setNewProject({ name: '', description: '' });
      setShowCreateModal(false);
      router.push('/');
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? All related data will be deleted.')) {
      return;
    }

    try {
      await projectsApi.delete(id);
      await mutate();
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      alert(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleUpdateStatus = async (id: string, status: 'active' | 'completed' | 'archived') => {
    try {
      await projectsApi.update(id, { status });
      await mutate();
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project status');
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage your QA testing projects
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          + Create Project
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['active', 'completed', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 font-medium capitalize ${
              filterStatus === status
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded-md">
          Failed to load projects
        </div>
      )}

      {!projects && !error && (
        <div className="text-gray-500">Loading projects...</div>
      )}

      {projects && projects.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            No {filterStatus} projects found
          </p>
          {filterStatus === 'active' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first project
            </button>
          )}
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-600 text-sm">{project.description}</p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Stats */}
              {project._count && (
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-600">PRDs</div>
                    <div className="font-semibold">{project._count.prds}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-600">Test Cases</div>
                    <div className="font-semibold">{project._count.testCases}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-600">Sessions</div>
                    <div className="font-semibold">{project._count.testSessions}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-gray-600">Reports</div>
                    <div className="font-semibold">{project._count.qaReports}</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    router.push('/');
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Select
                </button>
                <div className="relative group">
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    •••
                  </button>
                  <div className="hidden group-hover:block absolute right-0 top-0 pt-10 w-48 z-10">
                    <div className="bg-white border border-gray-200 rounded-md shadow-lg mt-1">
                    {project.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateStatus(project.id, 'completed')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mark as Completed
                      </button>
                    )}
                    {project.status !== 'archived' && (
                      <button
                        onClick={() => handleUpdateStatus(project.id, 'archived')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Archive
                      </button>
                    )}
                    {project.status !== 'active' && (
                      <button
                        onClick={() => handleUpdateStatus(project.id, 'active')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Reactivate
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Create New Project
            </h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My QA Project"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of this project..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewProject({ name: '', description: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
