# 🔧 Git 설정 및 GitHub 연동 가이드

## 📋 현재 상태
- ✅ Git 저장소 초기화됨
- ❌ GitHub 원격 저장소 연결 필요
- ❌ 변경사항 커밋 필요

## 🚀 Git 설정 단계

### 1. Git 사용자 정보 설정
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. 현재 변경사항 확인
```bash
git status
```

### 3. 변경사항 스테이징
```bash
git add .
```

### 4. 커밋 생성
```bash
git commit -m "Fix JWT_SECRET error and update deployment config"
```

### 5. GitHub 저장소 생성 (웹에서)
1. [github.com](https://github.com) 접속
2. **"New repository"** 클릭
3. **Repository name**: `newsweb-next`
4. **Public** 선택
5. **"Create repository"** 클릭

### 6. 원격 저장소 연결
```bash
git remote add origin https://github.com/YOUR_USERNAME/newsweb-next.git
```

### 7. 코드 푸시
```bash
git branch -M main
git push -u origin main
```

## 🔄 대안: GitHub CLI 사용

### GitHub CLI 설치 (Windows)
```bash
# Chocolatey 사용
choco install gh

# 또는 winget 사용
winget install GitHub.cli
```

### GitHub CLI 로그인
```bash
gh auth login
```

### 저장소 생성 및 푸시
```bash
gh repo create newsweb-next --public --source=. --remote=origin --push
```

## 📝 수동 GitHub 저장소 생성

### 1. GitHub 웹사이트에서
- [github.com](https://github.com) 접속
- **"New repository"** 클릭
- **Repository name**: `newsweb-next`
- **Description**: `News website built with Next.js, TypeScript, and PlanetScale`
- **Public** 선택
- **"Create repository"** 클릭

### 2. 로컬에서 연결
```bash
git remote add origin https://github.com/YOUR_USERNAME/newsweb-next.git
git branch -M main
git push -u origin main
```

## ✅ 확인사항

### 성공 후 확인:
- ✅ GitHub 저장소 생성됨
- ✅ 코드 푸시 완료
- ✅ Vercel에서 GitHub 연동 가능

### Vercel 배포:
1. Vercel 대시보드에서 **"New Project"**
2. GitHub 저장소 선택
3. **Root Directory**: `newsweb-next`
4. 환경 변수 설정
5. **"Deploy"**

## 🛠️ 문제 해결

### Git 인증 오류:
```bash
# Personal Access Token 사용
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/newsweb-next.git
```

### 강제 푸시 (필요시):
```bash
git push -f origin main
```

### 원격 저장소 확인:
```bash
git remote -v
```

## 📋 다음 단계

1. ✅ Git 설정 완료
2. ✅ GitHub 저장소 생성
3. ✅ 코드 푸시
4. 🔄 Vercel에서 GitHub 연동
5. 🔄 환경 변수 설정
6. 🔄 배포 완료 