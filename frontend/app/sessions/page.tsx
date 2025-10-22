'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import SessionForm from '@/components/sessions/SessionForm';
import ActiveSession from '@/components/sessions/ActiveSession';
import { useProject } from '@/contexts/ProjectContext';
import { useRouter } from 'next/navigation';
import ProjectRequiredSkeleton from '@/components/ProjectRequiredSkeleton';

export default function SessionsPage() {
  const { selectedProject, isLoadingProject } = useProject();
  const router = useRouter();
  const { data: activeSession, error, mutate } = useSWR(
    selectedProject ? `/sessions/active?projectId=${selectedProject.id}` : null
  );
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState('');

  const handleStartSession = async (data: {
    webServiceId: string;
    testCaseIds: string[];
  }) => {
    if (!selectedProject) {
      setStartError('Please select a project first');
      return;
    }

    setIsStarting(true);
    setStartError('');

    try {
      const session = await apiClient.post('/sessions', {
        ...data,
        projectId: selectedProject.id,
      });
      mutate(); // Refresh active session
      // Session started, will appear in active session display
    } catch (err: any) {
      setStartError(err.message || 'Failed to start session');
    } finally {
      setIsStarting(false);
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      await apiClient.post(`/sessions/${sessionId}/cancel`);
      mutate(); // Refresh to clear active session
    } catch (err: any) {
      console.error('Failed to cancel session:', err);
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
            Please select or create a project before starting a test session.
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

  if (error) {
    return (
      <div className="px-4 py-6">
        <p className="text-red-600">Failed to load session data</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Test Sessions</h1>
        <p className="text-gray-600 mt-1">
          Execute QA tests on your web services
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Project: <span className="font-medium">{selectedProject.name}</span>
        </p>
      </div>

      {activeSession ? (
        <ActiveSession
          session={activeSession}
          onCancel={handleCancelSession}
        />
      ) : (
        <>
          <SessionForm
            onSubmit={handleStartSession}
            isLoading={isStarting}
          />

          {startError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded max-w-2xl">
              <p className="text-red-800">{startError}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
