@echo off
echo ========================================
echo Git 설정 및 GitHub 연동 스크립트
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
echo 4. 원격 저장소 확인...
git remote -v

echo.
echo ========================================
echo 다음 단계:
echo 1. GitHub에서 저장소 생성
echo 2. 원격 저장소 연결: git remote add origin https://github.com/YOUR_USERNAME/newsweb-next.git
echo 3. 코드 푸시: git push -u origin main
echo ========================================

pause 