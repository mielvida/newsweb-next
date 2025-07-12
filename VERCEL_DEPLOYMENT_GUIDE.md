# Vercel 웹 대시보드 배포 가이드

## 🚀 배포 단계별 가이드

### 1. Vercel 계정 생성/로그인
1. **[vercel.com](https://vercel.com) 접속**
2. **GitHub 계정으로 로그인**

### 2. 새 프로젝트 생성
1. **"New Project" 클릭**
2. **GitHub 저장소 선택**: `mielvida/newsweb-next`
3. **"Import" 클릭**

### 3. 프로젝트 설정
- **Framework Preset**: `Next.js` (자동 감지)
- **Root Directory**: `newsweb-next` ⚠️ **중요!**
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

### 4. 환경변수 설정
**"Environment Variables" 섹션에서 추가:**

```
Name: JWT_SECRET
Value: 5f6fe6209484b2563dbcdbf6e821545a929561581f6beecf39adc543f382e777abf05124f73deaca032dbbb6e55fd1b30c0fe3c514da8fbbddfcc5300fe66cae
Environment: Production, Preview, Development (모두 체크)

Name: DATABASE_URL
Value: [PlanetScale 연결 문자열]
Environment: Production, Preview, Development (모두 체크)
```

### 5. 배포 실행
1. **"Deploy" 클릭**
2. **배포 완료 대기** (약 2-3분)
3. **제공된 URL로 접속**

## 🔧 PlanetScale 연결 문자열 가져오기

### 단계:
1. **[planetscale.com](https://planetscale.com) 로그인**
2. **프로젝트 선택**
3. **"Connect" 버튼 클릭**
4. **"Connect with Prisma" 선택**
5. **연결 문자열 복사**

### 예시:
```
mysql://username:password@aws.connect.psdb.cloud/newsweb?sslaccept=strict
```

## 📱 배포 후 확인사항

### 접속 URL:
- **홈페이지**: `https://your-project.vercel.app`
- **관리자**: `https://your-project.vercel.app/admin`
- **API 테스트**: `https://your-project.vercel.app/api/news`

### 관리자 계정:
- **이메일**: `nsadmin@ns.com`
- **비밀번호**: `nsadmin4123`

## 🛠️ 문제 해결

### 빌드 오류 시:
1. Root Directory가 `newsweb-next`로 설정되었는지 확인
2. 환경변수가 올바르게 설정되었는지 확인
3. PlanetScale 연결 문자열 확인

### 환경변수 오류 시:
1. Vercel 대시보드 → Settings → Environment Variables
2. 기존 환경변수 삭제 후 재설정
3. "Redeploy" 클릭

### 데이터베이스 연결 오류 시:
1. PlanetScale 연결 문자열 재확인
2. 데이터베이스 접근 권한 확인
3. SSL 설정 확인

## 🔄 자동 배포

GitHub 저장소에 푸시하면 자동으로 재배포됩니다.

## 🌐 커스텀 도메인

Vercel 대시보드에서 "Settings" → "Domains"에서 커스텀 도메인을 추가할 수 있습니다. 