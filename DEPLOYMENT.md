# Vercel 배포 가이드

## 1. Vercel 웹 대시보드 배포 (추천)

### 단계별 배포 방법:

1. **Vercel 계정 생성/로그인**
   - [vercel.com](https://vercel.com) 접속
   - GitHub 계정으로 로그인

2. **프로젝트 가져오기**
   - "New Project" 클릭
   - GitHub 저장소에서 `mielvida/newsweb-next` 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - Framework Preset: `Next.js` (자동 감지)
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build` (기본값)
   - Output Directory: `.next` (기본값)
   - Install Command: `npm install` (기본값)

4. **환경변수 설정**
   - "Environment Variables" 섹션에서 추가:
   ```
   DATABASE_URL = "your-planetscale-connection-string"
   JWT_SECRET = "your-super-secret-jwt-key"
   ```

5. **배포**
   - "Deploy" 클릭
   - 배포 완료 후 제공되는 URL로 접속

## 2. 환경변수 설정

### 필수 환경변수:

```env
# PlanetScale 데이터베이스 연결
DATABASE_URL="mysql://username:password@host:port/database"

# JWT 토큰 시크릿
JWT_SECRET="your-super-secret-jwt-key-change-this"
```

### PlanetScale 연결 문자열 예시:
```
mysql://username:password@aws.connect.psdb.cloud/newsweb?sslaccept=strict
```

## 3. 배포 후 확인사항

1. **홈페이지 접속**: `https://your-project.vercel.app`
2. **관리자 페이지**: `https://your-project.vercel.app/admin`
3. **API 테스트**: `https://your-project.vercel.app/api/news`

## 4. 관리자 계정

- **이메일**: nsadmin@ns.com
- **비밀번호**: nsadmin4123

## 5. 문제 해결

### 빌드 오류 시:
1. 로컬에서 `npm run build` 테스트
2. 환경변수 확인
3. Prisma 클라이언트 생성 확인

### 데이터베이스 연결 오류 시:
1. PlanetScale 연결 문자열 확인
2. 데이터베이스 접근 권한 확인
3. SSL 설정 확인

## 6. 자동 배포

GitHub 저장소에 푸시하면 자동으로 재배포됩니다.

## 7. 커스텀 도메인

Vercel 대시보드에서 "Settings" → "Domains"에서 커스텀 도메인을 추가할 수 있습니다. 