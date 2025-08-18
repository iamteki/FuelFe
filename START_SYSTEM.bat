@echo off
echo ========================================
echo Fuel Quota Management System Startup
echo ========================================
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "java -jar target\fuel-quota-backend-1.0.0.jar --spring.profiles.active=h2"
echo Backend starting in new window...
echo.

echo Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak > nul

echo Starting Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"
echo Frontend starting in new window...
echo.

echo ========================================
echo Access URLs:
echo ========================================
echo Frontend:         http://localhost:5173
echo Backend API:      http://localhost:8080/api
echo API Docs:         http://localhost:8080/swagger-ui.html
echo H2 Console:       http://localhost:8080/api/h2-console
echo ========================================
echo.

echo Test Credentials:
echo Username: admin    Password: admin123
echo Username: testuser Password: test123
echo.

pause
