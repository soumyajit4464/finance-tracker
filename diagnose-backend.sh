#!/bin/bash

echo "========================================"
echo "  Finance Tracker Backend Diagnostic"
echo "========================================"
echo ""

cd backend

echo "1. Checking pom.xml exists..."
if [ -f "pom.xml" ]; then
    echo "✅ pom.xml found"
else
    echo "❌ pom.xml not found - are you in the right directory?"
    exit 1
fi

echo ""
echo "2. Checking Java version..."
java -version

echo ""
echo "3. Running Maven with verbose output..."
echo "   This will show us exactly what's happening..."
echo ""

mvn spring-boot:run -X 2>&1 | tail -50

echo ""
echo "========================================"
echo "  Check the output above for errors"
echo "========================================"
