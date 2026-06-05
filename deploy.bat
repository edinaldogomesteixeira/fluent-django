@echo off

echo =====================
echo Git Add
echo =====================
git add .

echo =====================
echo Git Commit
echo =====================
set /p msg=Mensagem do commit:

git commit -m "%msg%"

echo =====================
echo Git Push
echo =====================
git push

echo =====================
echo Deploy VPS
echo =====================

ssh root@2.24.104.26 "cd /opt/projects/fluent-django && ./deploy.sh"

echo =====================
echo Deploy Concluido
echo =====================

pause
