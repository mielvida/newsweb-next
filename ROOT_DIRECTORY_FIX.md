# Root Directory 설정 문제 해결 가이드

## 🚨 오류 내용
```
Error: No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies". Also check your Root Directory setting matches the directory of your package.json file.
```

## 🔍 문제 원인
Vercel이 `package.json` 파일을 찾지 못하고 있습니다. 이는 **Root Directory 설정이 잘못**되었기 때문입니다.

## 🔧 해결 방법

### 방법 1: Vercel 웹 대시보드에서 Root Directory 수정

#### 1단계: Vercel 대시보드 접속
1. **[vercel.com](https://vercel.com) 접속**
2. **프로젝트 선택**

#### 2단계: 프로젝트 설정 수정
1. **"Settings" 탭 클릭**
2. **"General" 섹션에서 "Root Directory" 찾기**
3. **"Edit" 클릭**
4. **Root Directory를 `newsweb-next`로 설정**
5. **"Save" 클릭**

#### 3단계: 재배포
1. **"Deployments" 탭 클릭**
2. **최신 배포 옆의 "..." 버튼 클릭**
3. **"Redeploy" 선택**

### 방법 2: 새 프로젝트 생성 (추천)

#### 1단계: 기존 프로젝트 삭제
1. **Vercel 대시보드 → 프로젝트 선택**
2. **"Settings" → "General"**
3. **"Delete Project" 클릭**
4. **확인 후 삭제**

#### 2단계: 새 프로젝트 생성
1. **"New Project" 클릭**
2. **GitHub 저장소 `mielvida/newsweb-next` 선택**
3. **"Import" 클릭**

#### 3단계: 프로젝트 설정
- **Framework Preset**: `Next.js` (자동 감지)
- **Root Directory**: `newsweb-next` ⚠️ **중요!**
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

#### 4단계: 환경변수 설정
```
Name: JWT_SECRET
Value: 5f6fe6209484b2563dbcdbf6e821545a929561581f6beecf39adc543f382e777abf05124f73deaca032dbbb6e55fd1b30c0fe3c514da8fbbddfcc5300fe66cae
Environment: Production, Preview, Development (모두 체크)

Name: DATABASE_URL
Value: [PlanetScale 연결 문자열]
Environment: Production, Preview, Development (모두 체크)
```

#### 5단계: 배포
1. **"Deploy" 클릭**
2. **배포 완료 대기**

## 📁 프로젝트 구조 확인

### 올바른 구조:
```
mielvida/newsweb-next (GitHub 저장소)
├── newsweb-next/ (Root Directory)
│   ├── package.json ✅
│   ├── app/
│   ├── prisma/
│   └── ...
└── README.md
```

### 잘못된 구조:
```
mielvida/newsweb-next (GitHub 저장소)
├── package.json ❌ (루트에 있으면 안됨)
├── newsweb-next/
│   ├── package.json ✅
│   └── ...
└── README.md
```

## ✅ 확인사항

### 배포 성공 후:
- **홈페이지**: `https://your-project.vercel.app`
- **관리자**: `https://your-project.vercel.app/admin`
- **API 테스트**: `https://your-project.vercel.app/api/news`

### 관리자 계정:
- **이메일**: `nsadmin@ns.com`
- **비밀번호**: `nsadmin4123`

## 🛠️ 추가 문제 해결

### 여전히 오류 발생 시:
1. **GitHub 저장소 구조 확인**
2. **Root Directory가 `newsweb-next`인지 재확인**
3. **환경변수 설정 확인**
4. **브라우저 캐시 삭제 후 재시도**

### CLI 사용 시:
```bash
# 프로젝트 재설정
vercel --force

# 또는 새 프로젝트로 배포
vercel --name newsweb-next-app
``` 