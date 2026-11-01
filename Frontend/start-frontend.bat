@echo off
echo ===================================================================
echo               Starting BookLoop React Frontend
echo ===================================================================
cd /d "%~dp0"
echo Starting Vite development server on http://localhost:5173 ...
call npm.cmd run dev
pause
