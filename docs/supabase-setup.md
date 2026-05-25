# Re:Place Supabase Setup

이 문서는 다음 단계에서 Re:Place의 장소 기록 저장 기능을 연결하기 위한 기본 Supabase 설정 가이드입니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com/)에 로그인합니다.
2. 새 프로젝트를 생성합니다.
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전을 설정합니다.
4. 프로젝트가 준비될 때까지 기다립니다.

## 2. Project URL 확인

1. Supabase 프로젝트 대시보드로 이동합니다.
2. 왼쪽 메뉴에서 **Project Settings**를 엽니다.
3. **API** 메뉴에서 **Project URL** 값을 확인합니다.
4. 이 값은 `.env.local`의 `NEXT_PUBLIC_SUPABASE_URL`에 넣습니다.

## 3. anon key 확인

1. 같은 **Project Settings > API** 화면으로 이동합니다.
2. **Project API keys** 영역에서 **anon public** key를 확인합니다.
3. 이 값은 `.env.local`의 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 넣습니다.

## 4. 로컬 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 직접 만들고 아래 값을 채웁니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

주의:
- `.env.local`은 Git에 올리지 않습니다.
- 실제 Supabase 키를 코드나 문서에 직접 넣지 않습니다.
- 이 저장소에는 예시 파일인 `.env.example`만 커밋합니다.

## 5. 다음 단계 places 테이블 초안

다음 단계에서 실제 저장 기능을 연결할 때 만들 places 테이블 초안입니다.

| column | type | note |
| --- | --- | --- |
| id | uuid | primary key |
| name | text | 장소명 |
| category | text | 카페, 음식점, 공원, 여행지, 호텔, 기타 |
| region | text | 지역 |
| memory | text | 장소에 남긴 기억 |
| visited_date | date | 다녀온 날짜, nullable |
| companion | text | 혼자, 부부, 가족, 친구, 기타, nullable |
| revisit_level | text | 보통, 좋았어요, 꼭 다시 가고 싶어요 |
| space_tags | text[] | 공간 정보 태그 |
| is_public | boolean | 공개 여부 |
| image_url | text | 대표 이미지 URL, nullable |
| created_at | timestamptz | 생성일 |

이번 단계에서는 테이블 생성, 조회, 저장, 인증, RLS 정책은 아직 구현하지 않습니다.
