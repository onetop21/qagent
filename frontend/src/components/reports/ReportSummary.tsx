'use client';

interface ReportSummaryProps {
  report: {
    id: string;
    generatedAt: string;
    totalTests: number;
    successCount: number;
    failureCount: number;
    timeoutCount: number;
    successRate: number;
    session: {
      webService: {
        name: string;
        url: string;
      };
      startedAt: string;
      completedAt: string;
    };
  };
}

export default function ReportSummary({ report }: ReportSummaryProps) {
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const duration = report.session.completedAt
    ? Math.round(
        (new Date(report.session.completedAt).getTime() -
          new Date(report.session.startedAt).getTime()) /
          1000
      )
    : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>

      {/* Web Service Info */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Web Service</p>
            <p className="font-medium text-gray-900">
              {report.session.webService.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">URL</p>
            <p className="font-medium text-gray-900">
              {report.session.webService.url}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Started At</p>
            <p className="font-medium text-gray-900">
              {formatDate(report.session.startedAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="font-medium text-gray-900">
              {duration}s
            </p>
          </div>
        </div>
      </div>

      {/* Test Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-3xl font-bold text-gray-900">
            {report.totalTests}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total Tests</p>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-3xl font-bold text-green-600">
            {report.successCount}
          </p>
          <p className="text-sm text-gray-600 mt-1">Passed</p>
        </div>

        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-3xl font-bold text-red-600">
            {report.failureCount}
          </p>
          <p className="text-sm text-gray-600 mt-1">Failed</p>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <p className="text-3xl font-bold text-orange-600">
            {report.timeoutCount}
          </p>
          <p className="text-sm text-gray-600 mt-1">Timeout</p>
        </div>
      </div>

      {/* Success Rate */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">Success Rate</p>
          <p className={`text-3xl font-bold ${getSuccessRateColor(report.successRate)}`}>
            {report.successRate.toFixed(1)}%
          </p>
        </div>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              report.successRate >= 90
                ? 'bg-green-600'
                : report.successRate >= 70
                ? 'bg-yellow-600'
                : 'bg-red-600'
            }`}
            style={{ width: `${report.successRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
