'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import SessionForm from '@/components/sessions/SessionForm';
import ActiveSession from '@/components/sessions/ActiveSession';

export default function SessionsPage() {
  const { data: activeSession, error, mutate } = useSWR('/sessions/active');
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState('');

  const handleStartSession = async (data: {
    webServiceId: string;
    testCaseIds: string[];
  }) => {
    setIsStarting(true);
    setStartError('');

    try {
      const session = await apiClient.post('/sessions', data);
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
