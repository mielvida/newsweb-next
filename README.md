# 뉴스웹 - Next.js 뉴스 웹사이트

coinreaders.com과 유사한 뉴스 웹사이트입니다.

## 기술 스택

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PlanetScale (MySQL)
- **Authentication**: JWT
- **Deployment**: Vercel

## 주요 기능

- 📰 뉴스 목록 및 상세 보기
- 🏷️ 카테고리별 필터링
- 🔥 인기 뉴스 (조회수 기준)
- 👨‍💼 관리자 로그인 및 뉴스 관리 (CRUD)
- 📱 반응형 디자인

## 로컬 개발

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가:
```env
DATABASE_URL="your-planetscale-connection-string"
JWT_SECRET="your-jwt-secret"
```

### 3. 데이터베이스 설정
```bash
npx prisma generate
npx prisma db push
```

### 4. 초기 데이터 생성
```bash
node scripts/createAdmin.js
node scripts/createCategories.js
node scripts/createSampleNews.js
```

### 5. 개발 서버 실행
```bash
npm run dev
```

## 관리자 계정

- **이메일**: nsadmin@ns.com
- **비밀번호**: nsadmin4123

## API 엔드포인트

### 인증
- `POST /api/auth/login` - 관리자 로그인

### 뉴스
- `GET /api/news` - 뉴스 목록 조회
- `POST /api/news` - 뉴스 작성 (관리자)
- `GET /api/news/[id]` - 뉴스 상세 조회
- `PUT /api/news/[id]` - 뉴스 수정 (관리자)
- `DELETE /api/news/[id]` - 뉴스 삭제 (관리자)

### 카테고리
- `GET /api/categories` - 카테고리 목록 조회
- `POST /api/categories` - 카테고리 생성 (관리자)

## 배포

### Vercel 배포

1. Vercel CLI 설치
```bash
npm install -g vercel
```

2. 배포
```bash
vercel
```

3. 환경변수 설정 (Vercel 대시보드)
- `DATABASE_URL`: PlanetScale 연결 문자열
- `JWT_SECRET`: JWT 시크릿 키

## 프로젝트 구조

```
newsweb-next/
├── app/
│   ├── api/           # API 라우트
│   ├── admin/         # 관리자 페이지
│   ├── news/          # 뉴스 상세 페이지
│   └── page.tsx       # 홈페이지
├── prisma/
│   └── schema.prisma  # 데이터베이스 스키마
├── scripts/           # 초기 데이터 생성 스크립트
└── public/            # 정적 파일
```

## 라이선스

MIT License
