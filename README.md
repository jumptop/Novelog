# Novelog: AI 기반 독서 추천 및 기록 서비스

Novelog는 사용자의 독서 취향을 분석하여 AI(Gemini)가 맞춤형 도서를 추천해주고, 읽은 책에 대한 독서 기록을 AI의 도움을 받아 작성하고 관리할 수 있는 웹 서비스입니다.

## 주요 기능

-   **Google OAuth2 로그인**: Google 계정을 통해 간편하게 로그인할 수 있습니다.
-   **취향 설문조사**: 사용자의 선호 장르와 인생 책을 기반으로 독서 취향을 파악합니다.
-   **AI 도서 추천**: Gemini API를 활용하여 설문 결과를 바탕으로 사용자에게 맞춤형 도서(소설 또는 소설 외 분야)를 추천합니다.
-   **네이버 도서 API 연동**: 책 검색, 신간 도서 목록 조회 등 네이버 도서 정보를 활용합니다.
-   **신간 도서 목록**: 메인 페이지에서 '인문/사회' 분야의 최신 출간 도서 목록을 제공합니다.
-   **사용자 프로필**: 내 정보 페이지에서 프로필 정보, 설문 답변 내역을 확인하고 설문 초기화 기능을 제공합니다.
-   **AI 독서 기록장**: 
    -   책을 검색하여 선택하고, 간단한 감상평을 입력합니다.
    -   Gemini AI가 사용자의 감상평을 바탕으로 풍부한 독서 기록을 자동으로 작성해줍니다.
    -   작성된 독서 기록은 데이터베이스에 저장되어 언제든지 다시 확인하고 관리할 수 있습니다.
-   **독서 기록 관리**: 
    -   '나의 독서 기록' 페이지에서 저장된 모든 독서 기록을 책 표지 형태로 한눈에 볼 수 있습니다.
    -   각 기록의 표지를 클릭하면 상세 페이지에서 기록의 전체 내용을 확인할 수 있습니다.
    -   기록을 개별적으로 삭제할 수 있습니다.

## 기술 스택

### 백엔드
-   **프레임워크**: Spring Boot (Java 21)
-   **인증/인가**: Spring Security (OAuth2 Client)
-   **데이터베이스**: Spring Data JPA, H2 Database (개발용), MySQL (운영용)
-   **API 연동**: Spring WebFlux (WebClient), Google Gemini API, Naver Book API
-   **유틸리티**: Lombok

### 프론트엔드
-   **프레임워크**: React (Vite)
-   **라우팅**: React Router DOM
-   **스타일링**: Pure CSS

## 시작하기

### 1. 필수 설치 항목
-   Java Development Kit (JDK) 21 이상
-   Node.js (LTS 버전 권장)
-   npm 또는 Yarn
-   Gradle

### 2. API 키 설정
프로젝트를 실행하기 전에 `src/main/resources/application.yml` 파일에 다음 API 키들을 설정해야 합니다.

```yaml
# application.yml 예시

spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: YOUR_GOOGLE_CLIENT_ID
            client-secret: YOUR_GOOGLE_CLIENT_SECRET
            scope: profile,email

naver:
  api:
    client-id: YOUR_NAVER_CLIENT_ID
    client-secret: YOUR_NAVER_CLIENT_SECRET

gemini:
  api:
    key: YOUR_GEMINI_API_KEY
```

### 3. 백엔드 실행

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다.

```bash
./gradlew bootRun
```

### 4. 프론트엔드 실행

`front` 디렉토리로 이동하여 다음 명령어를 실행합니다.

```bash
cd front
npm install  # 또는 yarn install
npm run dev  # 또는 yarn dev
```

프론트엔드 개발 서버는 기본적으로 `http://localhost:8000`에서 실행됩니다.

## API 엔드포인트

### 사용자 및 인증
-   `GET /api/user/me`: 현재 로그인 사용자 정보 조회
-   `GET /api/user/answers`: 현재 사용자의 설문 답변 조회
-   `POST /api/user/me/reset-survey`: 현재 사용자의 설문 상태 초기화

### 도서 검색 및 추천
-   `GET /api/search/books?query={query}`: 네이버 도서 검색
-   `GET /api/books/new-releases`: 인문/사회 분야 신간 도서 목록 조회
-   `GET /api/books/{isbn}`: ISBN으로 특정 도서 상세 정보 조회
-   `GET /api/recommendations`: Gemini 기반 맞춤형 도서 추천

### 독서 기록
-   `POST /api/journals`: 독서 기록 생성 (Gemini AI 활용, DB 저장)
-   `GET /api/journals`: 현재 사용자의 모든 독서 기록 조회
-   `GET /api/journals/{id}`: 특정 독서 기록 상세 조회
-   `DELETE /api/journals/{id}`: 특정 독서 기록 삭제

## 데이터베이스 스키마 (주요 엔티티)

-   **User**: 사용자 정보 (이름, 이메일, 프로필 사진, 설문 완료 여부)
-   **SurveyAnswer**: 사용자의 설문 답변 (장르, 인생 책)
-   **Journal**: 독서 기록 (사용자, 책 제목, ISBN, 이미지, 사용자 감상평, AI 생성 기록, 작성일)

## 향후 개선 사항 (아이디어)
-   독서 기록 수정 기능 추가
-   책 상세 페이지에서 바로 독서 기록 작성 기능 연동
-   추천 알고리즘 고도화 (사용자 독서 기록 기반)
-   반응형 디자인 개선
