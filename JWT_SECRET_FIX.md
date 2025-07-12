# JWT_SECRET 오류 해결 가이드

## 🚨 오류 내용
```
Environment Variable "JWT_SECRET" references Secret "jwt-secret", which does not exist.
```

## 🔧 해결 방법 (Vercel 웹 대시보드)

### 1단계: Vercel 대시보드 접속
1. **[vercel.com](https://vercel.com) 접속**
2. **프로젝트 선택** (newsweb 또는 해당 프로젝트)

### 2단계: 환경변수 확인 및 수정
1. **"Settings" 탭 클릭**
2. **"Environment Variables" 섹션 클릭**
3. **기존 JWT_SECRET 찾기**

### 3단계: 기존 환경변수 삭제
1. **JWT_SECRET 옆의 "..." 버튼 클릭**
2. **"Delete" 선택**
3. **확인 후 삭제**

### 4단계: 새 환경변수 추가
1. **"Add New" 클릭**
2. **다음 정보 입력:**
   ```
   Name: JWT_SECRET
   Value: 5f6fe6209484b2563dbcdbf6e821545a929561581f6beecf39adc543f382e777abf05124f73deaca032dbbb6e55fd1b30c0fe3c514da8fbbddfcc5300fe66cae
   Environment: Production, Preview, Development (모두 체크)
   ```
3. **"Save" 클릭**

### 5단계: DATABASE_URL 확인
1. **DATABASE_URL 환경변수가 있는지 확인**
2. **없다면 추가:**
   ```
   Name: DATABASE_URL
   Value: mysql://twzunzgzy40tdkdey44m:pscale_pw_iGZjXnCuTFroq25mIWF8H3DWE4CkjkIxO421K6Pg2OB@gcp.connect.psdb.cloud/newsweb?sslaccept=strict
   Environment: Production, Preview, Development (모두 체크)
   ```

### 6단계: 재배포
1. **"Deployments" 탭 클릭**
2. **최신 배포 옆의 "..." 버튼 클릭**
3. **"Redeploy" 선택**

## 🔄 대안 방법: 새 프로젝트 생성

### 1단계: 기존 프로젝트 삭제
1. **Vercel 대시보드 → 프로젝트 선택**
2. **"Settings" → "General"**
3. **"Delete Project" 클릭**
4. **확인 후 삭제**

### 2단계: 새 프로젝트 생성
1. **"New Project" 클릭**
2. **GitHub 저장소 선택**
3. **프로젝트 설정:**
   - **Root Directory**: `newsweb-next`
   - **Framework**: Next.js (자동 감지)
4. **환경변수 설정:**
   ```
   JWT_SECRET = 5f6fe6209484b2563dbcdbf6e821545a929561581f6beecf39adc543f382e777abf05124f73deaca032dbbb6e55fd1b30c0fe3c514da8fbbddfcc5300fe66cae
   DATABASE_URL = mysql://twzunzgzy40tdkdey44m:pscale_pw_iGZjXnCuTFroq25mIWF8H3DWE4CkjkIxO421K6Pg2OB@gcp.connect.psdb.cloud/newsweb?sslaccept=strict
   ```
5. **"Deploy" 클릭**

## ✅ 확인사항

### 배포 성공 후:
- **홈페이지**: `https://your-project.vercel.app`
- **관리자**: `https://your-project.vercel.app/admin`
- **API 테스트**: `https://your-project.vercel.app/api/news`

### 관리자 계정:
- **이메일**: `nsadmin@ns.com`
- **비밀번호**: `nsadmin4123`

## 🛠️ 문제 해결

### 여전히 오류 발생 시:
1. **브라우저 캐시 삭제**
2. **Vercel 대시보드 새로고침**
3. **환경변수 다시 확인**
4. **재배포 시도**

### CLI 사용 시:
```bash
# 기존 환경변수 제거
vercel env rm JWT_SECRET

# 새 환경변수 추가
vercel env add JWT_SECRET production
# 프롬프트에서 값 입력

# 재배포
vercel --prod
```

## 📝 중요 사항

- **vercel.json에서 env 섹션 제거됨**: 환경 변수는 Vercel 웹 대시보드에서만 설정
- **Secret 참조 금지**: 직접 값을 입력해야 함
- **모든 환경 체크**: Production, Preview, Development 모두 선택 