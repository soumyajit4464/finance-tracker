# Finance Tracker - Mac Setup Guide

## Step 1: Install Missing Tools

Open Terminal and run these commands:

### Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Install Maven
```bash
brew install maven
```

### Install MySQL
```bash
brew install mysql
```

### Start MySQL Service
```bash
brew services start mysql
```

### Secure MySQL Installation (set root password)
```bash
mysql_secure_installation
```
- Set root password (remember this!)
- Answer Y to all security questions

---

## Step 2: Create Database

After MySQL is installed and running:

```bash
mysql -u root -p
```

Then in MySQL prompt:
```sql
CREATE DATABASE finance_tracker;
CREATE USER 'financeuser'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON finance_tracker.* TO 'financeuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Step 3: Verify Everything is Installed

```bash
java -version          # Should show Java 17+
mvn -version           # Should show Maven version
mysql --version        # Should show MySQL version
node -v                # Should show Node.js version
npm -v                 # Should show npm version
```

---

## Step 4: Run the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend will start on: http://localhost:8080

---

## Step 5: Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on: http://localhost:5173

---

## Quick Commands Reference

### Backend Commands
```bash
# Run application
mvn spring-boot:run

# Clean and build
mvn clean install

# Run tests
mvn test

# Package as JAR
mvn package
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### MySQL Commands
```bash
# Start MySQL
brew services start mysql

# Stop MySQL
brew services stop mysql

# Restart MySQL
brew services restart mysql

# Connect to MySQL
mysql -u root -p

# Connect to finance_tracker database
mysql -u financeuser -p finance_tracker
```

---

## Troubleshooting

### If Maven command not found after installation:
```bash
echo 'export PATH="/usr/local/opt/maven/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### If MySQL connection fails:
```bash
brew services restart mysql
mysql -u root -p
```

### If port 8080 is already in use:
Change port in `backend/src/main/resources/application.properties`:
```properties
server.port=8081
```

---

## Next Steps

1. Install Maven and MySQL using the commands above
2. Create the database
3. Run `mvn spring-boot:run` in the backend folder
4. Run `npm install && npm run dev` in the frontend folder
5. Open browser to http://localhost:5173

You're all set! 🚀
