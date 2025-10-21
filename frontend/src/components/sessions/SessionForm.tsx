'use client';

import { useState } from 'react';
import useSWR from 'swr';

interface SessionFormProps {
  onSubmit: (data: {
    webServiceId: string;
    testCaseIds: string[];
  }) => void;
  isLoading?: boolean;
}

export default function SessionForm({ onSubmit, isLoading }: SessionFormProps) {
  const { data: webServices } = useSWR('/web-services');
  const { data: testCases } = useSWR('/test-cases');

  const [selectedWebService, setSelectedWebService] = useState('');
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedWebService) {
      newErrors.webService = 'Please select a web service';
    }
    if (selectedTestCases.length === 0) {
      newErrors.testCases = 'Please select at least one test case';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        webServiceId: selectedWebService,
        testCaseIds: selectedTestCases,
      });
    }
  };

  const toggleTestCase = (id: string) => {
    setSelectedTestCases((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    if (errors.testCases) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.testCases;
        return newErrors;
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedTestCases.length === testCases?.length) {
      setSelectedTestCases([]);
    } else {
      setSelectedTestCases(testCases?.map((tc: any) => tc.id) || []);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Web Service Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Web Service
        </label>
        <select
          value={selectedWebService}
          onChange={(e) => {
            setSelectedWebService(e.target.value);
            if (errors.webService) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.webService;
                return newErrors;
              });
            }
          }}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
        >
          <option value="">-- Select a web service --</option>
          {webServices?.map((ws: any) => (
            <option key={ws.id} value={ws.id}>
              {ws.name} ({ws.url})
            </option>
          ))}
        </select>
        {errors.webService && (
          <p className="mt-1 text-sm text-red-600">{errors.webService}</p>
        )}
        {!webServices?.length && (
          <p className="mt-2 text-sm text-gray-500">
            No web services configured.{' '}
            <a href="/webservices" className="text-blue-600 hover:underline">
              Add one now
            </a>
          </p>
        )}
      </div>

      {/* Test Cases Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Test Cases
          </label>
          {testCases?.length > 0 && (
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-sm text-blue-600 hover:underline"
            >
              {selectedTestCases.length === testCases?.length
                ? 'Deselect All'
                : 'Select All'}
            </button>
          )}
        </div>

        <div className="border border-gray-300 rounded-md max-h-96 overflow-y-auto">
          {testCases?.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {testCases.map((tc: any) => (
                <label
                  key={tc.id}
                  className="flex items-start p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTestCases.includes(tc.id)}
                    onChange={() => toggleTestCase(tc.id)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {tc.testId}
                      </span>
                      {tc.isEdgeCase && (
                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded">
                          Edge Case
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {tc.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No test cases available.{' '}
              <a href="/prd" className="text-blue-600 hover:underline">
                Upload a PRD
              </a>{' '}
              to generate test cases.
            </div>
          )}
        </div>

        {errors.testCases && (
          <p className="mt-1 text-sm text-red-600">{errors.testCases}</p>
        )}

        {selectedTestCases.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            {selectedTestCases.length} test case(s) selected
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !webServices?.length || !testCases?.length}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
      >
        {isLoading ? 'Starting Session...' : 'Start Test Session'}
      </button>
    </form>
  );
}
