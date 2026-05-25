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

## 5. SQL Editor에서 스키마 실행

1. Supabase 프로젝트 대시보드에서 **SQL Editor**를 엽니다.
2. 이 저장소의 `supabase/schema.sql` 파일 내용을 복사합니다.
3. SQL Editor에 붙여넣고 실행합니다.
4. 실행 후 **Table Editor**에서 `places` 테이블이 생성되었는지 확인합니다.

현재 SQL은 이메일 로그인 기반 MVP 구조입니다. `places.user_id`는 `auth.users(id)`를 참조하고, 공개 장소 조회와 사용자별 장소 생성/조회/수정/삭제 RLS 정책을 포함합니다.

기존 테스트 정책이 남아 있다면 `supabase/schema.sql`을 다시 실행해 anon insert/update/delete 정책을 제거하고 사용자별 정책으로 교체합니다.

기존에 생성한 row는 `user_id`가 비어 있을 수 있습니다. 새 로그인 구조에서는 새로 저장한 장소부터 로그인 사용자 id가 저장됩니다.

## 6. Supabase Auth 설정

1. Supabase 프로젝트 대시보드에서 **Authentication**을 엽니다.
2. **Providers > Email**에서 Email provider가 활성화되어 있는지 확인합니다.
3. 이번 MVP는 email/password 방식만 사용합니다.
4. 이메일 확인을 켜둔 경우 회원가입 후 메일 확인을 마쳐야 로그인 세션이 생성됩니다.
5. 로컬 테스트 URL은 필요하면 **URL Configuration**의 Site URL 또는 Redirect URLs에 `http://localhost:3000` 또는 현재 dev 서버 URL을 추가합니다.

## 7. places 테이블 구조

현재 `places` 테이블 구조입니다.

| column | type | note |
| --- | --- | --- |
| id | uuid | primary key |
| user_id | uuid | auth.users(id) 참조 |
| name | text | 장소명 |
| category | text | 카페, 음식점, 공원, 여행지, 호텔, 기타 |
| region | text | 지역 |
| memory | text | 장소에 남긴 기억 |
| visited_date | date | 다녀온 날짜, nullable |
| companion | text | 혼자, 부부, 가족, 친구, 기타, nullable |
| revisit_level | text | 보통, 좋았어요, 꼭 다시 가고 싶어요 |
| space_tags | text[] | 공간 정보 태그 |
| is_public | boolean | 공개 여부 |
| image_url | text | Storage public URL, nullable |
| created_at | timestamptz | 생성일 |
| updated_at | timestamptz | 수정일 |

## 8. Storage bucket 설정

장소 대표 사진 업로드를 위해 public bucket을 하나 만듭니다.

1. Supabase 프로젝트 대시보드에서 **Storage**를 엽니다.
2. **New bucket**을 선택합니다.
3. bucket name을 `place-images`로 입력합니다.
4. **Public bucket**으로 생성합니다.
5. SQL Editor에서 최신 `supabase/schema.sql`을 실행해 `storage.objects` 업로드 정책을 적용합니다.

현재 MVP는 공개 이미지 URL을 `places.image_url`에 저장합니다. 추후 실제 서비스 전환 시 private bucket과 signed URL 방식으로 개선할 수 있습니다.

현재 구현 범위는 이메일 로그인, 사용자별 장소 저장/조회/수정/삭제, 대표 사진 1장 업로드입니다. 프로필, 소셜 로그인, 여러 장 이미지 업로드는 아직 구현하지 않습니다.
