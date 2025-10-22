'use client';

import { useState } from 'react';
import FileUpload from '@/components/prd/FileUpload';
import { apiClient } from '@/lib/api-client';
import { useProject } from '@/contexts/ProjectContext';
import { useRouter } from 'next/navigation';
import ProjectRequiredSkeleton from '@/components/ProjectRequiredSkeleton';

export default function PrdPage() {
  const { selectedProject, isLoadingProject } = useProject();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedPrd, setUploadedPrd] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleUpload = async (file: File) => {
    if (!selectedProject) {
      setError('Please select a project first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', selectedProject.id);

      const result = await apiClient.upload('/prds', formData);
      setUploadedPrd(result);

      // Auto-generate test cases
      await apiClient.post(`/test-cases/generate/${result.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to upload PRD');
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
            Please select or create a project before uploading a PRD.
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
        <h1 className="text-2xl font-bold text-gray-900">Upload PRD</h1>
        <p className="text-gray-600 mt-1">
          Upload a Product Requirements Document to generate test cases
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Project: <span className="font-medium">{selectedProject.name}</span>
        </p>
      </div>

      <FileUpload onUpload={handleUpload} isLoading={isLoading} />

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {uploadedPrd && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold text-green-900">Upload Successful!</h3>
          <p className="text-green-800 mt-2">
            PRD uploaded: {uploadedPrd.fileName}
          </p>
          <p className="text-green-700 text-sm mt-1">
            Test cases are being generated...
          </p>
          <a
            href="/testcases"
            className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View Test Cases
          </a>
        </div>
      )}
    </div>
  );
}
