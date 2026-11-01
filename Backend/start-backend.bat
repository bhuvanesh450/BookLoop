@echo off
echo ===================================================================
echo               Starting BookLoop Spring Boot Backend
echo ===================================================================
cd /d "%~dp0"

echo Checking Java version:
java -version
echo.

echo Starting Spring Boot Backend on http://localhost:8080 ...
echo (Configure local settings in src\main\resources\application.properties.)
echo.

mvn spring-boot:run

pause
