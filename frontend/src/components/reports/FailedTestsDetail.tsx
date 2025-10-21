'use client';

interface FailedTestsDetailProps {
  report: {
    failedTests: Array<{
      testId: string;
      description: string;
      status: 'failed' | 'timeout';
      failureReason?: string;
      screenshotUrl?: string;
      executedSteps: Array<{
        action: string;
        status: 'success' | 'failed' | 'timeout';
        failureReason?: string;
      }>;
    }>;
  };
}

export default function FailedTestsDetail({ report }: FailedTestsDetailProps) {
  if (report.failedTests.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Failed Tests</h2>
        <div className="text-center py-8">
          <p className="text-green-600 text-lg font-medium">
            All tests passed! No failures to report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Failed Tests ({report.failedTests.length})
      </h2>

      <div className="space-y-4">
        {report.failedTests.map((test, index) => (
          <div
            key={index}
            className="border border-red-200 rounded-lg p-4 bg-red-50"
          >
            {/* Test Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{test.testId}</h3>
                <p className="text-sm text-gray-700 mt-1">{test.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  test.status === 'timeout'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {test.status.toUpperCase()}
              </span>
            </div>

            {/* Failure Reason */}
            {test.failureReason && (
              <div className="mb-3 p-3 bg-white border border-red-200 rounded">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Failure Reason:
                </p>
                <p className="text-sm text-red-700">{test.failureReason}</p>
              </div>
            )}

            {/* Executed Steps */}
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Executed Steps:
              </p>
              <div className="space-y-2">
                {test.executedSteps.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className={`p-2 rounded text-sm border ${
                      step.status === 'success'
                        ? 'bg-green-50 border-green-200'
                        : step.status === 'timeout'
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {stepIndex + 1}. {step.action}
                      </span>
                      <span
                        className={`font-medium ${
                          step.status === 'success'
                            ? 'text-green-600'
                            : step.status === 'timeout'
                            ? 'text-orange-600'
                            : 'text-red-600'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                    {step.failureReason && (
                      <p className="mt-1 text-xs text-red-600">
                        {step.failureReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Screenshot */}
            {test.screenshotUrl && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Screenshot:
                </p>
                <img
                  src={test.screenshotUrl}
                  alt={`Screenshot for ${test.testId}`}
                  className="border border-gray-300 rounded max-w-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
