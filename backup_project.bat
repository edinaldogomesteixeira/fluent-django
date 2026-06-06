@echo off
setlocal

:: =========================================
:: CONFIG
:: =========================================

set PROJECT_NAME=fluentu-clone

:: REMOVE BARRA FINAL
set SOURCE_DIR=%~dp0
set SOURCE_DIR=%SOURCE_DIR:~0,-1%

set BACKUP_DIR=%SOURCE_DIR%\backup

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set DATETIME=%%i

set ZIP_FILE=%BACKUP_DIR%\%PROJECT_NAME%_%DATETIME%.zip

:: =========================================
:: CREATE BACKUP FOLDER
:: =========================================

if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
)

echo.
echo =========================================
echo GERANDO BACKUP...
echo =========================================
echo.

:: =========================================
:: TEMP FOLDER
:: =========================================

set TEMP_DIR=%TEMP%\backup_temp_%RANDOM%

mkdir "%TEMP_DIR%"

:: =========================================
:: COPY FILES
:: =========================================

robocopy "%SOURCE_DIR%" "%TEMP_DIR%" /E ^
/XD venv .venv env .git __pycache__ node_modules media backup .idea .vscode dist build ^
/XF *.log *.pyc *.zip *.bat .env db.sqlite3 *.sqlite3 ^
/R:2 /W:2

:: =========================================
:: CHECK ERROR
:: =========================================

if %ERRORLEVEL% GEQ 8 (
    echo.
    echo =========================================
    echo ERRO NO BACKUP
    echo =========================================
    echo.

    rmdir /S /Q "%TEMP_DIR%"
    pause
    exit /b 1
)

:: =========================================
:: CREATE ZIP
:: =========================================

powershell -NoProfile -Command "Compress-Archive -Path '%TEMP_DIR%\*' -DestinationPath '%ZIP_FILE%' -Force"

:: =========================================
:: CLEAN TEMP
:: =========================================

rmdir /S /Q "%TEMP_DIR%"

echo.
echo =========================================
echo BACKUP FINALIZADO
echo %ZIP_FILE%
echo =========================================
echo.

pause