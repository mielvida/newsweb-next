# 🚀 GitHub 저장소 생성 가이드 (mielvida)

## 📋 GitHub 저장소 생성

### 1단계: GitHub 웹사이트 접속
1. **[github.com](https://github.com)** 접속
2. **mielvida** 계정으로 로그인

### 2단계: 새 저장소 생성
1. **"New repository"** 클릭
2. **Repository name**: `newsweb-next`
3. **Description**: `News website built with Next.js, TypeScript, and PlanetScale`
4. **Public** 선택
5. **"Create repository"** 클릭

### 3단계: 저장소 URL 확인
- **저장소 URL**: `https://github.com/mielvida/newsweb-next`
- **Clone URL**: `https://github.com/mielvida/newsweb-next.git`

## 🔧 로컬 Git 설정

### 1단계: Git 명령어 실행
```bash
# 현재 디렉토리에서
git status
git add .
git commit -m "Fix JWT_SECRET error and update deployment config"
```

### 2단계: 원격 저장소 연결
```bash
git remote add origin https://github.com/mielvida/newsweb-next.git
git branch -M main
git push -u origin main
```

## 🚀 Vercel 배포

### 1단계: Vercel 프로젝트 생성
1. **[vercel.com](https://vercel.com)** 접속
2. **"New Project"** 클릭
3. **GitHub 저장소 선택**: `mielvida/newsweb-next`
4. **Root Directory**: `newsweb-next`
5. **Framework**: Next.js (자동 감지)

### 2단계: 환경 변수 설정
**Environment Variables** 섹션에서:

#### JWT_SECRET:
- **Name**: `JWT_SECRET`
- **Value**: `5f6fe6209484b2563dbcdbf6e821545a929561581f6beecf39adc543f382e777abf05124f73deaca032dbbb6e55fd1b30c0fe3c514da8fbbddfcc5300fe66cae`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

#### DATABASE_URL:
- **Name**: `DATABASE_URL`
- **Value**: `mysql://twzunzgzy40tdkdey44m:pscale_pw_iGZjXnCuTFroq25mIWF8H3DWE4CkjkIxO421K6Pg2OB@gcp.connect.psdb.cloud/newsweb?sslaccept=strict`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

### 3단계: 배포
1. **"Deploy"** 클릭
2. 배포 완료 대기

## ✅ 확인사항

### 배포 성공 후:
- ✅ **홈페이지**: `https://newsweb-next.vercel.app`
- ✅ **관리자**: `https://newsweb-next.vercel.app/admin`
- ✅ **API**: `https://newsweb-next.vercel.app/api/news`

### 관리자 로그인:
- **이메일**: `nsadmin@ns.com`
- **비밀번호**: `nsadmin4123`

## 🛠️ 문제 해결

### Git 인증 오류:
```bash
# Personal Access Token 사용
git remote set-url origin https://YOUR_TOKEN@github.com/mielvida/newsweb-next.git
```

### 강제 푸시 (필요시):
```bash
git push -f origin main
```

### 원격 저장소 확인:
```bash
git remote -v
```

## 📋 완료 체크리스트

- [ ] GitHub 저장소 생성 (`mielvida/newsweb-next`)
- [ ] 로컬 코드 커밋 및 푸시
- [ ] Vercel 프로젝트 생성
- [ ] 환경 변수 설정 (JWT_SECRET, DATABASE_URL)
- [ ] 배포 완료
- [ ] 웹사이트 접속 확인
- [ ] 관리자 로그인 테스트 