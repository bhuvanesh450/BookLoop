@echo off
title BookLoop - Launch System
echo ===================================================================
echo               LAUNCHING BOOKLOOP FULL-STACK SYSTEM
echo ===================================================================
echo.
echo [1/2] Launching Spring Boot Backend in a separate window...
start "BookLoop Backend (Spring Boot :8080)" cmd /k "cd /d "%~dp0Backend" && call start-backend.bat"

timeout /t 3 /nobreak >nul

echo [2/2] Launching React Frontend in a separate window...
start "BookLoop Frontend (Vite React :5173)" cmd /k "cd /d "%~dp0Frontend" && call start-frontend.bat"

echo.
echo ===================================================================
echo Both Backend (port 8080) and Frontend (port 5173) are launching!
echo Once loaded, open your browser at: http://localhost:5173
echo ===================================================================
timeout /t 5
