# QAgent

## 개요

QAgent는 Gemini CLI 환경에 통합되어 QA 관련 작업을 자동화하고 능률화하기 위해 설계된 도구입니다. 이 프로젝트는 테스트 케이스 관리, 코드 포맷팅, QA 명령어 실행 등의 기능을 제공하여 개발 및 QA 프로세스의 효율성을 높이는 것을 목표로 합니다.

## 디렉토리 구조

- **/gemini-extension**: Gemini 확장 프로그램의 핵심 파일들이 위치합니다.
  - `gemini-extension.json`: 확장 프로그램의 설정 파일입니다.
  - `commands/QA/*.toml`: `augment`, `formatting`, `run`, `testcase` 등 QA 관련 명령어들의 설정을 담고 있습니다.
  - `templates/testcase_template.md`: 테스트 케이스 생성에 사용되는 템플릿입니다.
- **/tests**: 테스트 관련 문서 및 파일들이 저장됩니다.
  - `need_formatting.md`: 포맷팅이 필요한 문서 예시입니다.
  - `PRD.md`: 제품 요구사항 문서(Product Requirements Document)입니다.
- **/web-service-qa**: 웹 서비스 QA와 관련된 명령어 설정이 위치합니다.

## 설치 방법

```bash
git clone https://github.com/onetop21/qagent.git
cd qagent
```

## 사용 방법

이 프로젝트는 Gemini CLI 확장으로 실행되도록 설계되었습니다. Gemini CLI 환경에서 `gext` 명령어를 통해 등록된 QA 관련 커맨드를 사용할 수 있습니다.

각 명령어 (예: `formatting`, `run`)는 `*.toml` 설정 파일에 정의된 동작을 수행합니다.
