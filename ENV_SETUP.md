# 환경변수 설정 가이드

## 필수 환경변수

### 1. DATABASE_URL (PlanetScale 연결)

**PlanetScale에서 연결 문자열 가져오기:**
1. [planetscale.com](https://planetscale.com) 로그인
2. 프로젝트 선택
3. "Connect" 버튼 클릭
4. "Connect with Prisma" 선택
5. 연결 문자열 복사

**예시:**
```
mysql://username:password@aws.connect.psdb.cloud/newsweb?sslaccept=strict
```

### 2. JWT_SECRET (JWT 토큰 시크릿)

**안전한 시크릿 키 생성:**
```bash
# Node.js에서 랜덤 문자열 생성
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**또는 온라인 생성기 사용:**
- [randomkeygen.com](https://randomkeygen.com)
- 최소 32자 이상의 랜덤 문자열

## Vercel 환경변수 설정 방법

### 방법 1: 웹 대시보드 (추천)

1. **Vercel 프로젝트 대시보드 접속**
2. **"Settings" 탭 클릭**
3. **"Environment Variables" 섹션 클릭**
4. **환경변수 추가:**

```
Name: DATABASE_URL
Value: [PlanetScale 연결 문자열]
Environment: Production, Preview, Development (모두 체크)

Name: JWT_SECRET
Value: [생성한 시크릿 키]
Environment: Production, Preview, Development (모두 체크)
```

5. **"Save" 클릭**
6. **"Redeploy" 클릭하여 재배포**

### 방법 2: CLI 명령어

```bash
# DATABASE_URL 설정
vercel env add DATABASE_URL production
# 프롬프트에서 연결 문자열 입력

# JWT_SECRET 설정  
vercel env add JWT_SECRET production
# 프롬프트에서 시크릿 키 입력

# 재배포
vercel --prod
```

### 방법 3: .env 파일 (로컬 개발용)

프로젝트 루트에 `.env.local` 파일 생성:

```env
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/newsweb?sslaccept=strict"
JWT_SECRET="your-super-secret-jwt-key-change-this"
```

## 환경변수 확인

### 배포 후 확인:
1. **홈페이지 접속**: `https://your-project.vercel.app`
2. **API 테스트**: `https://your-project.vercel.app/api/news`
3. **관리자 로그인**: `https://your-project.vercel.app/admin`

### 로그 확인:
- Vercel 대시보드 → "Functions" 탭
- 에러 로그에서 환경변수 관련 오류 확인

## 문제 해결

### DATABASE_URL 오류:
- 연결 문자열 형식 확인
- PlanetScale 데이터베이스 접근 권한 확인
- SSL 설정 확인

### JWT_SECRET 오류:
- 시크릿 키 길이 확인 (최소 32자)
- 특수문자 포함 여부 확인

### 일반적인 오류:
- 환경변수 이름 대소문자 확인
- Production 환경에만 설정되어 있는지 확인
- 재배포 후 확인 