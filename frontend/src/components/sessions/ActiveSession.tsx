'use client';

import { useEffect, useState } from 'react';

interface ActiveSessionProps {
  session: {
    id: string;
    status: 'running' | 'completed' | 'failed' | 'canceled';
    startedAt: string;
    completedAt?: string;
    webService: {
      name: string;
      url: string;
    };
    testResults: Array<{
      id: string;
      status: 'pending' | 'running' | 'success' | 'failed' | 'timeout';
      testCase: {
        testId: string;
        description: string;
      };
    }>;
  };
  onCancel: (sessionId: string) => void;
}

export default function ActiveSession({ session, onCancel }: ActiveSessionProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const completed = session.testResults.filter(
      (r) => r.status === 'success' || r.status === 'failed' || r.status === 'timeout'
    ).length;
    const total = session.testResults.length;
    setProgress(total > 0 ? (completed / total) * 100 : 0);
  }, [session.testResults]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'failed':
      case 'timeout':
        return 'text-red-600';
      case 'running':
        return 'text-blue-600';
      case 'pending':
        return 'text-gray-500';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'failed':
      case 'timeout':
        return 'bg-red-50 border-red-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      case 'pending':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const isRunning = session.status === 'running';
  const isCompleted = session.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isRunning ? 'Test Session Running' : 'Test Session Completed'}
            </h2>
            <p className="text-gray-600 mt-1">
              Web Service: <span className="font-medium">{session.webService.name}</span>
            </p>
          </div>
          {isRunning && (
            <button
              onClick={() => onCancel(session.id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel Session
            </button>
          )}
          {isCompleted && (
            <a
              href={`/reports/${session.id}`}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              View Report
            </a>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Test Results ({session.testResults.length})
        </h3>
        <div className="space-y-2">
          {session.testResults.map((result) => (
            <div
              key={result.id}
              className={`border rounded-md p-3 ${getStatusBg(result.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {result.testCase.testId}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {result.testCase.description}
                  </div>
                </div>
                <div className={`font-medium uppercase text-sm ${getStatusColor(result.status)}`}>
                  {result.status}
                  {result.status === 'running' && (
                    <span className="ml-2 inline-block animate-spin">⚙</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
