'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import WebServiceForm from '@/components/webservices/WebServiceForm';
import { useProject } from '@/contexts/ProjectContext';
import { useRouter } from 'next/navigation';
import ProjectRequiredSkeleton from '@/components/ProjectRequiredSkeleton';

export default function WebServicesPage() {
  const { selectedProject, isLoadingProject } = useProject();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: any) => {
    if (!selectedProject) {
      setError('Please select a project first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await apiClient.post('/web-services', {
        ...data,
        projectId: selectedProject.id,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/sessions');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to save web service');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProject) {
    return <ProjectRequiredSkeleton />;
  }

  if (!selectedProject) {
    return (
      <div className="px-4 py-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            No Project Selected
          </h2>
          <p className="text-yellow-800 mb-4">
            Please select or create a project before configuring a web service.
          </p>
          <button
            onClick={() => router.push('/projects')}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
          >
            Go to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Configure Web Service
        </h1>
        <p className="text-gray-600 mt-1">
          Add the target web service for testing
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Project: <span className="font-medium">{selectedProject.name}</span>
        </p>
      </div>

      <WebServiceForm onSubmit={handleSubmit} isLoading={isLoading} />

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded max-w-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded max-w-md">
          <p className="text-green-800">
            Web service saved successfully! Redirecting to test execution...
          </p>
        </div>
      )}
    </div>
  );
}
