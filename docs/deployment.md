# Re:Place Deployment Guide

Re:Place는 Next.js App Router, Supabase Auth, Supabase Database, Supabase Storage를 사용하는 웹 앱입니다. Vercel 배포 전후에 아래 항목을 확인합니다.

## 1. Production build 확인

로컬에서 배포 전 빌드를 확인합니다.

```bash
npm run build
```

TypeScript 또는 lint 오류가 있으면 먼저 수정한 뒤 배포합니다.

## 2. Vercel 배포

1. [Vercel](https://vercel.com/)에 로그인합니다.
2. **Add New... > Project**를 선택합니다.
3. GitHub에서 Re:Place repository를 import합니다.
4. Framework Preset이 **Next.js**로 설정되어 있는지 확인합니다.
5. Build Command는 기본값 `npm run build`를 사용합니다.
6. 환경변수를 등록한 뒤 배포합니다.

## 3. Vercel 환경변수

Vercel Project Settings의 **Environment Variables**에 아래 값을 추가합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

권장 설정:
- **Production**, **Preview**, **Development** 환경에 모두 등록합니다.
- 환경변수를 추가하거나 수정한 뒤에는 반드시 redeploy합니다.
- 실제 키는 README나 코드에 직접 기록하지 않습니다.

## 4. Supabase Auth URL 설정

Supabase Dashboard에서 **Authentication > URL Configuration**을 엽니다.

설정 항목:
- **Site URL**: Vercel production URL
- **Redirect URLs**:
  - Vercel production URL
  - Vercel preview URL 패턴
  - localhost 개발 URL

예시:

```text
https://your-project.vercel.app
https://*.vercel.app
http://localhost:3000
http://localhost:3001
```

이 프로젝트는 현재 email/password 방식만 사용합니다. OAuth 로그인, 비밀번호 재설정 UX, 커스텀 도메인은 이번 배포 범위에 포함하지 않습니다.

## 5. Supabase Storage 확인

장소 대표 사진 업로드를 위해 Supabase Storage bucket이 필요합니다.

확인 항목:
- bucket name: `place-images`
- public bucket으로 생성되어 있어야 합니다.
- 최신 `supabase/schema.sql`의 Storage 정책을 SQL Editor에서 실행합니다.
- 배포 후 실제 이미지 업로드와 이미지 표시를 확인합니다.

현재 MVP는 public image URL을 `places.image_url`에 저장합니다. 추후 private bucket과 signed URL 방식으로 개선할 수 있습니다.

## 6. 배포 후 QA 체크리스트

배포 후 production URL에서 아래 흐름을 확인합니다.

- 회원가입
- 로그인
- 로그아웃
- 장소 등록
- 이미지 업로드
- 내 장소 목록 확인
- 공개/비공개 장소 표시 확인
- 둘러보기 공개 피드 확인
- 상세 페이지 확인
- 장소 수정
- 장소 삭제
- 모바일 화면 확인

## 7. 배포 전 확인 사항

- `.env.local`은 Git에 포함하지 않습니다.
- Vercel 환경변수와 Supabase Dashboard 설정이 같은 프로젝트를 가리키는지 확인합니다.
- Supabase SQL Editor에서 최신 `supabase/schema.sql`을 실행했는지 확인합니다.
- Storage bucket `place-images`가 public인지 확인합니다.
- 배포 후 환경변수 변경 시 redeploy합니다.
