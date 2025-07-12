@echo off
echo ========================================
echo Git 설정 및 GitHub 연동 스크립트 (mielvida)
echo ========================================

echo.
echo 1. Git 상태 확인...
git status

echo.
echo 2. 변경사항 스테이징...
git add .

echo.
echo 3. 커밋 생성...
git commit -m "Fix JWT_SECRET error and update deployment config"

echo.
echo 4. 원격 저장소 연결...
git remote add origin https://github.com/mielvida/newsweb-next.git

echo.
echo 5. 브랜치 이름 변경...
git branch -M main

echo.
echo 6. 코드 푸시...
git push -u origin main

echo.
echo ========================================
echo 완료! 다음 단계:
echo 1. Vercel에서 GitHub 저장소 연동
echo 2. 환경 변수 설정 (JWT_SECRET, DATABASE_URL)
echo 3. 배포 완료
echo ========================================

pause 