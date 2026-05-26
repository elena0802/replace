# Re:Place

좋은 장소와 시간을 기록하세요.

Re:Place는 다시 가고 싶은 카페, 음식점, 공원, 여행지, 호텔을 나만의 아카이브로 남기고 공개 장소를 둘러볼 수 있는 라이프스타일 기록 서비스입니다.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Storage

## Local Setup

의존성을 설치합니다.

```bash
npm install
```

환경변수 예시 파일을 참고해 프로젝트 루트에 `.env.local`을 만듭니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

개발 서버를 실행합니다.

```bash
npm run dev
```

기본 접속 주소는 [http://localhost:3000](http://localhost:3000)입니다. 해당 포트가 사용 중이면 Next.js가 다른 포트를 안내합니다.

## Build

배포 전 production build를 확인합니다.

```bash
npm run build
```

## Supabase

Supabase 설정 가이드는 [docs/supabase-setup.md](./docs/supabase-setup.md)를 참고합니다.

필요한 주요 설정:
- Email/password Auth 활성화
- `places` 테이블 및 RLS 정책 적용
- `place-images` public Storage bucket 생성
- Vercel/localhost URL을 Auth URL Configuration에 등록

## Deployment

Vercel 배포 절차와 QA 체크리스트는 [docs/deployment.md](./docs/deployment.md)를 참고합니다.

Vercel 환경변수:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Production, Preview, Development 환경에 모두 등록하는 것을 권장합니다.
