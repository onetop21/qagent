import { apiClient } from '../api-client';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  _count?: {
    prds: number;
    webServices: number;
    testCases: number;
    testSessions: number;
    qaReports: number;
  };
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived';
}

export const projectsApi = {
  getAll: async (status?: string): Promise<Project[]> => {
    const url = status ? `/projects?status=${status}` : '/projects';
    return await apiClient.get<Project[]>(url);
  },

  getOne: async (id: string): Promise<Project> => {
    return await apiClient.get<Project>(`/projects/${id}`);
  },

  create: async (data: CreateProjectDto): Promise<Project> => {
    return await apiClient.post<Project>('/projects', data);
  },

  update: async (id: string, data: UpdateProjectDto): Promise<Project> => {
    return await apiClient.patch<Project>(`/projects/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
};
