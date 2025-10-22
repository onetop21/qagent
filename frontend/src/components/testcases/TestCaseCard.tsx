'use client';

interface TestCaseCardProps {
  testCase: {
    id: string;
    testId: string;
    description: string;
    expectedResult: string;
    source: string;
    isEdgeCase: boolean;
    testSteps: any[];
  };
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function TestCaseCard({
  testCase,
  isSelected,
  onSelect,
}: TestCaseCardProps) {
  const sourceLabels = {
    prd_auto: 'Auto-generated',
    ai_augmented: 'AI Augmented',
    user_manual: 'Manual',
    imported: 'Imported',
  };

  return (
    <div
      className={`border rounded-lg p-4 ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(testCase.id)}
                className="w-4 h-4"
              />
            )}
            <h3 className="font-semibold text-gray-900">{testCase.testId}</h3>
            <span
              className={`text-xs px-2 py-1 rounded ${
                testCase.isEdgeCase
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {testCase.isEdgeCase ? 'Edge Case' : sourceLabels[testCase.source as keyof typeof sourceLabels]}
            </span>
          </div>
          <p className="text-gray-700 mt-2">{testCase.description}</p>
          <p className="text-sm text-gray-600 mt-1">
            Expected: {testCase.expectedResult}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            {testCase.testSteps.length} steps
          </div>
        </div>
      </div>
    </div>
  );
}
