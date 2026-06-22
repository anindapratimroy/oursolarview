@echo off
echo ===================================================
echo     HSPTP Local Server Initializer
echo ===================================================
echo Starting local web server to bypass CORS restrictions...
echo Close this window to stop the server.
echo.

:: Try Python 3 first
python -c "import sys; sys.exit(0)" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python found. Starting HTTP server...
    start chrome "http://localhost:8000"
    python -m http.server 8000
    exit /b
)

:: Try Python 2
python -c "import sys; sys.exit(0)" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python 2 found. Starting SimpleHTTPServer...
    start chrome "http://localhost:8000"
    python -m SimpleHTTPServer 8000
    exit /b
)

:: Try npx (Node.js)
call npx --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js/npx found. Starting serve...
    start chrome "http://localhost:3000"
    call npx serve . -p 3000
    exit /b
)

echo [ERROR] Neither Python nor Node.js/npx is installed.
echo Please install Python (https://www.python.org/downloads/) or Node.js to run this project.
pause
