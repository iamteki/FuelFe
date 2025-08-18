@echo off
echo Opening Fuel Quota Management System Demo...
echo.

echo This will open the demo in your default web browser.
echo.

start "" "demo-simple.html"

echo.
echo Demo Features:
echo - Click "Login to System" to see the dashboard
echo - Click "Register Vehicle" to see the vehicle form  
echo - Navigate between different pages using the header buttons
echo - Check the status panel in the bottom right
echo.

echo If the demo doesn't open automatically:
echo 1. Open your web browser (Chrome, Firefox, Edge)
echo 2. Press Ctrl+O to open a file
echo 3. Navigate to: %~dp0demo-simple.html
echo 4. Or drag and drop the demo-simple.html file into your browser
echo.

pause
