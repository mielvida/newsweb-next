# 🚀 JWT_SECRET 에러 해결 및 배포 가이드

## 🚨 현재 문제
```
Environment Variable "JWT_SECRET" references Secret "jwt-secret", which does not exist.
```

## ✅ 해결 방법

### 1. Vercel 웹 대시보드 접속
- [vercel.com](https://vercel.com) 접속
- 프로젝트 선택

### 2. 환경 변수 설정
**Settings → Environment Variables**

#### JWT_SECRET 추가:
- **Name**: `JWT_SECRET`
- **Value**: `[YOUR_JWT_SECRET_VALUE]`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

#### DATABASE_URL 추가:
- **Name**: `DATABASE_URL`
- **Value**: `[YOUR_PLANETSCALE_DATABASE_URL]`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

### 3. 재배포
- **Deployments** 탭 클릭
- 최신 배포 옆 **"..."** → **"Redeploy"**

## 🔄 새 프로젝트 생성 (대안)

### 1. 기존 프로젝트 삭제
- Settings → General → Delete Project

### 2. 새 프로젝트 생성
- New Project → GitHub 저장소 선택
- **Root Directory**: `newsweb-next`
- 환경 변수 설정 후 Deploy

## 📋 확인 사항

### 배포 성공 후:
- ✅ 홈페이지: `https://your-project.vercel.app`
- ✅ 관리자: `https://your-project.vercel.app/admin`
- ✅ API: `https://your-project.vercel.app/api/news`

### 관리자 로그인:
- **이메일**: `[YOUR_ADMIN_EMAIL]`
- **비밀번호**: `[YOUR_ADMIN_PASSWORD]`

## 🛠️ 문제 해결

### 여전히 에러 발생 시:
1. 브라우저 캐시 삭제
2. Vercel 대시보드 새로고침
3. 환경 변수 다시 확인
4. 재배포 시도

### 중요:
- ❌ Secret 참조 금지
- ✅ 직접 값 입력
- ✅ 모든 환경 체크 