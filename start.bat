@echo off
echo ====================================
echo   Owner Portal - Starting Dev Server
echo ====================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo.
    echo WARNING: .env file not found!
    echo Please copy .env.example to .env and configure your API endpoints
    echo.
    pause
)

echo Starting development server...
echo The app will open at http://localhost:3000
echo.
call npm run dev



