# NewsWeb Next.js

뉴스 웹사이트 프로젝트입니다.

## 로컬 개발 환경 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Database (로컬 MySQL 사용 시)
DATABASE_URL="mysql://root:password@localhost:3306/newsweb"

# 또는 PlanetScale 사용 시
DATABASE_URL="mysql://username:password@host:port/database?sslaccept=strict"

# JWT Secret
JWT_SECRET="5f6fe6209484b2563dbcdbf6e821545a929561581f6beecf39adc543f382e777abf05124f73deaca032dbbb6e55fd1b30c0fe3c514da8fbbddfcc5300fe66cae"

# Next.js
NEXTAUTH_SECRET="5f6fe6209484b2563dbcdbf6e821545a929561581f6beecf39adc543f382e777abf05124f73deaca032dbbb6e55fd1b30c0fe3c514da8fbbddfcc5300fe66cae"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. 데이터베이스 설정

#### 로컬 MySQL 사용 시:

1. MySQL 설치 및 실행
2. 데이터베이스 생성:
   ```sql
   CREATE DATABASE newsweb;
   ```

#### PlanetScale 사용 시:

1. [PlanetScale](https://planetscale.com)에서 계정 생성
2. 새 데이터베이스 생성
3. 연결 문자열 복사하여 DATABASE_URL에 설정

### 3. 의존성 설치

```bash
npm install
```

### 4. Prisma 설정

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션 (로컬 MySQL 사용 시)
npx prisma db push

# 또는 PlanetScale 사용 시
npx prisma db push
```

### 5. 샘플 데이터 생성

```bash
# 관리자 계정 생성
node scripts/createAdmin.js

# 카테고리 생성
node scripts/createCategories.js

# 샘플 뉴스 생성
node scripts/createSampleNews.js
```

### 6. 개발 서버 실행

```bash
npm run dev
```

## 배포

### Vercel 배포

1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 연결
3. 환경 변수 설정:
   - `DATABASE_URL`: 데이터베이스 연결 문자열
   - `JWT_SECRET`: JWT 시크릿 키

## 주요 기능

- 뉴스 목록 조회
- 뉴스 상세 보기
- 카테고리별 필터링
- 관리자 로그인
- 뉴스 작성/수정/삭제 (관리자만)

## 기술 스택

- Next.js 15
- TypeScript
- Prisma (ORM)
- MySQL (PlanetScale)
- Tailwind CSS
- JWT 인증
