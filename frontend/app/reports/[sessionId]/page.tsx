'use client';

import { use } from 'react';
import useSWR from 'swr';
import ReportSummary from '@/components/reports/ReportSummary';
import FailedTestsDetail from '@/components/reports/FailedTestsDetail';

interface ReportPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default function ReportPage({ params }: ReportPageProps) {
  const { sessionId } = use(params);
  const { data: report, error, isLoading } = useSWR(`/reports/session/${sessionId}`);

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <p>Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">Failed to load report</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="px-4 py-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">Report not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QA Report</h1>
          <p className="text-gray-600 mt-1">
            Session ID: {sessionId}
          </p>
        </div>
        <a
          href="/sessions"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          New Test Session
        </a>
      </div>

      <div className="space-y-6">
        <ReportSummary report={report} />
        <FailedTestsDetail report={report} />
      </div>
    </div>
  );
}
