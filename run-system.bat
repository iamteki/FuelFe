@echo off
echo Starting Fuel Quota Management System...
echo.

echo Setting up MySQL database...
echo Please make sure MySQL is running and create the database using database.sql
echo.

echo Starting Backend (Spring Boot)...
cd backend
start "Backend Server" cmd /k "mvn spring-boot:run"
echo Backend server starting on http://localhost:8080
echo.

echo Waiting for backend to start...
timeout /t 15 /nobreak > nul

echo Starting Frontend (React)...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"
echo Frontend server starting on http://localhost:3000
echo.

echo ========================================
echo Fuel Quota Management System Started!
echo ========================================
echo Backend:  http://localhost:8080/api
echo Frontend: http://localhost:3000
echo Swagger:  http://localhost:8080/swagger-ui.html
echo ========================================
echo.
echo Press any key to exit...
pause > nul
