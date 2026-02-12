#!/bin/bash

echo "======================================"
echo "  CHECKING YOUR SYSTEM REQUIREMENTS  "
echo "======================================"
echo ""

# Check Java
echo "1. Checking Java..."
if command -v java &> /dev/null
then
    java -version
    echo "✅ Java is installed"
else
    echo "❌ Java is NOT installed"
    echo "   Download from: https://www.oracle.com/java/technologies/downloads/"
fi
echo ""

# Check Maven
echo "2. Checking Maven..."
if command -v mvn &> /dev/null
then
    mvn -version
    echo "✅ Maven is installed"
else
    echo "❌ Maven is NOT installed"
    echo "   Download from: https://maven.apache.org/download.cgi"
fi
echo ""

# Check Node.js
echo "3. Checking Node.js..."
if command -v node &> /dev/null
then
    node -v
    echo "✅ Node.js is installed"
else
    echo "❌ Node.js is NOT installed"
    echo "   Download from: https://nodejs.org/"
fi
echo ""

# Check npm
echo "4. Checking npm..."
if command -v npm &> /dev/null
then
    npm -v
    echo "✅ npm is installed"
else
    echo "❌ npm is NOT installed"
    echo "   Comes with Node.js installation"
fi
echo ""

# Check MySQL
echo "5. Checking MySQL..."
if command -v mysql &> /dev/null
then
    mysql --version
    echo "✅ MySQL is installed"
else
    echo "❌ MySQL is NOT installed"
    echo "   Download from: https://dev.mysql.com/downloads/"
fi
echo ""

# Check Git
echo "6. Checking Git..."
if command -v git &> /dev/null
then
    git --version
    echo "✅ Git is installed"
else
    echo "❌ Git is NOT installed"
    echo "   Download from: https://git-scm.com/downloads"
fi
echo ""

echo "======================================"
echo "  SYSTEM CHECK COMPLETE  "
echo "======================================"
echo ""
echo "💡 TIP: If anything is missing, install it before proceeding!"
echo ""
