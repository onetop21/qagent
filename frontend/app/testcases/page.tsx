'use client';

import { useState } from 'react';
import useSWR from 'swr';
import TestCaseCard from '@/components/testcases/TestCaseCard';
import { useProject } from '@/contexts/ProjectContext';
import { useRouter } from 'next/navigation';
import ProjectRequiredSkeleton from '@/components/ProjectRequiredSkeleton';

export default function TestCasesPage() {
  const { selectedProject, isLoadingProject } = useProject();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data: testCases, error, isLoading } = useSWR(
    selectedProject ? `/test-cases?projectId=${selectedProject.id}` : null
  );

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === testCases?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(testCases?.map((tc: any) => tc.id) || []);
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
            Please select or create a project to view test cases.
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

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <p>Loading test cases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <p className="text-red-600">Failed to load test cases</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Cases</h1>
          <p className="text-gray-600 mt-1">
            {testCases?.length || 0} test cases available
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Project: <span className="font-medium">{selectedProject.name}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            {selectedIds.length === testCases?.length ? 'Deselect All' : 'Select All'}
          </button>
          <a
            href="/sessions"
            className={`px-4 py-2 rounded text-white ${
              selectedIds.length > 0
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Run Selected ({selectedIds.length})
          </a>
        </div>
      </div>

      <div className="space-y-3">
        {testCases?.map((testCase: any) => (
          <TestCaseCard
            key={testCase.id}
            testCase={testCase}
            isSelected={selectedIds.includes(testCase.id)}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {testCases?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No test cases yet</p>
          <a
            href="/prd"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload PRD
          </a>
        </div>
      )}
    </div>
  );
}
