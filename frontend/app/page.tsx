export default function Home() {
  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gemini Web QA Tool
        </h1>
        <p className="text-gray-600">
          AI 기반 자동화 웹 서비스 QA 테스팅 플랫폼
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <a
          href="/prd"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              📝 PRD 업로드
            </h2>
            <span className="text-2xl">→</span>
          </div>
          <p className="text-gray-600 text-sm">
            Markdown 또는 PDF PRD를 업로드하고 Gemini AI가 자동으로 테스트 케이스를 생성합니다.
          </p>
          <div className="mt-4 text-blue-600 text-sm font-medium">
            시작하기 →
          </div>
        </a>

        <a
          href="/testcases"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              ✅ 테스트 케이스
            </h2>
            <span className="text-2xl">→</span>
          </div>
          <p className="text-gray-600 text-sm">
            생성된 테스트 케이스를 확인하고 수정하거나 수동으로 추가할 수 있습니다.
          </p>
          <div className="mt-4 text-blue-600 text-sm font-medium">
            확인하기 →
          </div>
        </a>

        <a
          href="/webservices"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              🔧 웹 서비스
            </h2>
            <span className="text-2xl">→</span>
          </div>
          <p className="text-gray-600 text-sm">
            테스트할 웹 서비스를 설정하고 로그인 정보를 안전하게 저장합니다.
          </p>
          <div className="mt-4 text-blue-600 text-sm font-medium">
            설정하기 →
          </div>
        </a>

        <a
          href="/sessions"
          className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              🎯 테스트 실행
            </h2>
            <span className="text-2xl">→</span>
          </div>
          <p className="text-gray-600 text-sm">
            Playwright로 실제 브라우저에서 테스트를 실행하고 결과를 확인합니다.
          </p>
          <div className="mt-4 text-blue-600 text-sm font-medium">
            실행하기 →
          </div>
        </a>
      </div>

      {/* Features */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🤖</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                AI 테스트 생성
              </h3>
              <p className="text-gray-600 text-sm">
                Gemini AI가 PRD를 분석하여 자동으로 5-10개의 테스트 케이스를 생성합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="text-2xl mr-3">🎭</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                브라우저 자동화
              </h3>
              <p className="text-gray-600 text-sm">
                Playwright를 사용하여 실제 브라우저에서 테스트를 자동 실행합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="text-2xl mr-3">📊</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                실시간 모니터링
              </h3>
              <p className="text-gray-600 text-sm">
                테스트 진행 상황을 실시간으로 모니터링하고 결과를 확인합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="text-2xl mr-3">🔒</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                보안 인증 관리
              </h3>
              <p className="text-gray-600 text-sm">
                AES-256-GCM 암호화로 로그인 정보를 안전하게 보관합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="text-2xl mr-3">📈</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                QA 리포트
              </h3>
              <p className="text-gray-600 text-sm">
                테스트 결과를 자동으로 분석하여 상세한 리포트를 생성합니다.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <span className="text-2xl mr-3">⏰</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                자동 데이터 관리
              </h3>
              <p className="text-gray-600 text-sm">
                30일 데이터 보관 정책으로 스토리지를 자동으로 관리합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">빠른 시작 가이드</h2>
        <ol className="space-y-3">
          <li className="flex items-start">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold mr-3 mt-0.5">
              1
            </span>
            <div>
              <span className="font-semibold text-gray-900">PRD 업로드</span>
              <p className="text-gray-600 text-sm">
                Markdown 또는 PDF 형식의 PRD 문서를 업로드합니다.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold mr-3 mt-0.5">
              2
            </span>
            <div>
              <span className="font-semibold text-gray-900">테스트 케이스 확인</span>
              <p className="text-gray-600 text-sm">
                AI가 생성한 테스트 케이스를 검토하고 필요시 수정합니다.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold mr-3 mt-0.5">
              3
            </span>
            <div>
              <span className="font-semibold text-gray-900">웹 서비스 설정</span>
              <p className="text-gray-600 text-sm">
                테스트할 웹 서비스 URL과 로그인 정보를 입력합니다.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold mr-3 mt-0.5">
              4
            </span>
            <div>
              <span className="font-semibold text-gray-900">테스트 실행</span>
              <p className="text-gray-600 text-sm">
                웹 서비스와 테스트 케이스를 선택하여 테스트를 실행합니다.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold mr-3 mt-0.5">
              5
            </span>
            <div>
              <span className="font-semibold text-gray-900">리포트 확인</span>
              <p className="text-gray-600 text-sm">
                생성된 QA 리포트에서 성공률과 실패 원인을 분석합니다.
              </p>
            </div>
          </li>
        </ol>

        <div className="mt-6 pt-6 border-t border-blue-200">
          <a
            href="/prd"
            className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            지금 시작하기 →
          </a>
        </div>
      </div>
    </div>
  );
}
