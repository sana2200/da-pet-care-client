@echo off
echo ===================================
echo Pet Care Full Stack Application
echo ===================================
echo.
echo Starting Backend Server...
echo.

cd server
start cmd /k "npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
echo.

cd ..\Client
start cmd /k "npm run dev"

echo.
echo ===================================
echo Both servers are starting!
echo ===================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ===================================
echo.
echo Press any key to exit this window...
pause > nul
