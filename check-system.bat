@echo off
echo ======================================
echo   CHECKING YOUR SYSTEM REQUIREMENTS  
echo ======================================
echo.

echo 1. Checking Java...
java -version 2>nul
if %errorlevel% == 0 (
    echo ✅ Java is installed
) else (
    echo ❌ Java is NOT installed
    echo    Download from: https://www.oracle.com/java/technologies/downloads/
)
echo.

echo 2. Checking Maven...
mvn -version 2>nul
if %errorlevel% == 0 (
    echo ✅ Maven is installed
) else (
    echo ❌ Maven is NOT installed
    echo    Download from: https://maven.apache.org/download.cgi
)
echo.

echo 3. Checking Node.js...
node -v 2>nul
if %errorlevel% == 0 (
    echo ✅ Node.js is installed
) else (
    echo ❌ Node.js is NOT installed
    echo    Download from: https://nodejs.org/
)
echo.

echo 4. Checking npm...
npm -v 2>nul
if %errorlevel% == 0 (
    echo ✅ npm is installed
) else (
    echo ❌ npm is NOT installed
    echo    Comes with Node.js installation
)
echo.

echo 5. Checking MySQL...
mysql --version 2>nul
if %errorlevel% == 0 (
    echo ✅ MySQL is installed
) else (
    echo ❌ MySQL is NOT installed
    echo    Download from: https://dev.mysql.com/downloads/
)
echo.

echo 6. Checking Git...
git --version 2>nul
if %errorlevel% == 0 (
    echo ✅ Git is installed
) else (
    echo ❌ Git is NOT installed
    echo    Download from: https://git-scm.com/downloads
)
echo.

echo ======================================
echo   SYSTEM CHECK COMPLETE  
echo ======================================
echo.
echo 💡 TIP: If anything is missing, install it before proceeding!
echo.
pause
