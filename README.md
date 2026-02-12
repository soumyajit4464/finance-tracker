# 💰 Finance Tracker - Full Stack Project

A complete Personal Finance Management System built with **Spring Boot** (Backend) and **React** (Frontend).

Perfect for showcasing full-stack development skills, especially for Banking & Financial Services domain!

---

## 🎯 Project Overview

This application helps users manage their personal finances with features like:
- 👤 User Authentication (JWT-based)
- 💳 Multi-account Management
- 📊 Transaction Tracking
- 💰 Budget Management
- 📈 Financial Analytics & Reports

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17
- **Database:** MySQL 8.0
- **Security:** Spring Security + JWT
- **ORM:** Hibernate/JPA
- **Build Tool:** Maven

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router
- **HTTP Client:** Axios
- **Charts:** Recharts

---

## 📋 Prerequisites

Make sure you have these installed on your Mac:

- ✅ **Java JDK 17+** (Check: `java -version`)
- ✅ **Maven** (Check: `mvn -version`)
- ✅ **Node.js 16+** (Check: `node -v`)
- ✅ **MySQL 8.0** (Check: `mysql --version`)
- ✅ **Git** (Check: `git --version`)

---

## 🚀 Quick Start (Mac Setup)

### Step 1: Install Missing Tools

If you don't have Maven or MySQL, install them using Homebrew:

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Maven
brew install maven

# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure MySQL (set root password)
mysql_secure_installation
```

---

### Step 2: Create Database

```bash
# Connect to MySQL
mysql -u root -p

# In MySQL prompt, run:
CREATE DATABASE finance_tracker;
CREATE USER 'financeuser'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON finance_tracker.* TO 'financeuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### Step 3: Clone/Download the Project

If you have this folder, navigate to it:
```bash
cd finance-tracker
```

---

### Step 4: Run the Backend

```bash
cd backend

# Install dependencies and run
mvn spring-boot:run
```

You should see:
```
=================================================
   Finance Tracker Backend is running! 🚀
   Access at: http://localhost:8080
=================================================
```

Test it by visiting: http://localhost:8080/api/health

---

### Step 5: Run the Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

---

## 🧪 Verify Everything Works

1. **Backend:** Open http://localhost:8080/api/health
   - Should show: `{"status":"UP","message":"Finance Tracker API is running!"}`

2. **Frontend:** Open http://localhost:5173
   - Should show the dashboard with green "✅ Backend is running successfully!"

---

## 📂 Project Structure

```
finance-tracker/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/financetracker/
│   │   │   │   ├── model/           # Entity classes
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Account.java
│   │   │   │   │   ├── Transaction.java
│   │   │   │   │   ├── Budget.java
│   │   │   │   │   └── Category.java
│   │   │   │   ├── repository/      # JPA Repositories
│   │   │   │   ├── service/         # Business Logic
│   │   │   │   ├── controller/      # REST APIs
│   │   │   │   ├── security/        # JWT & Auth
│   │   │   │   ├── config/          # Configuration
│   │   │   │   └── dto/             # Data Transfer Objects
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable Components
│   │   ├── pages/                   # Page Components
│   │   │   └── Dashboard.jsx
│   │   ├── services/                # API Services
│   │   ├── utils/                   # Helper Functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🗄️ Database Schema

### Tables Created Automatically:

1. **users** - User accounts with authentication
2. **accounts** - Bank/financial accounts
3. **transactions** - Income/expense records
4. **budgets** - Monthly spending limits
5. **categories** - Transaction categories

---

## 🔑 Key Features to Implement Next

### Phase 1: Authentication ✅ (Models Ready)
- [ ] User Registration API
- [ ] Login API with JWT
- [ ] Password encryption
- [ ] Protected routes

### Phase 2: Accounts
- [ ] Create/Read/Update/Delete accounts
- [ ] View account balances
- [ ] Account types (Savings, Checking, Credit Card, etc.)

### Phase 3: Transactions
- [ ] Add transactions (Income/Expense)
- [ ] Filter by date/category/type
- [ ] Edit/Delete transactions
- [ ] Transaction history

### Phase 4: Budgets
- [ ] Set monthly budgets per category
- [ ] Track spending vs budget
- [ ] Budget alerts
- [ ] Visual progress bars

### Phase 5: Analytics
- [ ] Spending charts
- [ ] Income vs Expense graphs
- [ ] Category breakdown
- [ ] Monthly reports

---

## 🎨 API Endpoints (To Be Implemented)

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
GET    /api/auth/profile        - Get user profile
```

### Accounts
```
GET    /api/accounts            - Get all accounts
POST   /api/accounts            - Create account
GET    /api/accounts/{id}       - Get account by ID
PUT    /api/accounts/{id}       - Update account
DELETE /api/accounts/{id}       - Delete account
```

### Transactions
```
GET    /api/transactions        - Get all transactions
POST   /api/transactions        - Create transaction
GET    /api/transactions/{id}   - Get transaction by ID
PUT    /api/transactions/{id}   - Update transaction
DELETE /api/transactions/{id}   - Delete transaction
```

### Budgets
```
GET    /api/budgets             - Get all budgets
POST   /api/budgets             - Create budget
GET    /api/budgets/{id}        - Get budget by ID
PUT    /api/budgets/{id}        - Update budget
DELETE /api/budgets/{id}        - Delete budget
```

---

## 🔧 Development Commands

### Backend
```bash
# Run application
mvn spring-boot:run

# Clean and rebuild
mvn clean install

# Run tests
mvn test

# Package as JAR
mvn package
```

### Frontend
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database
```bash
# Start MySQL
brew services start mysql

# Stop MySQL
brew services stop mysql

# Connect to database
mysql -u financeuser -p finance_tracker
```

---

## 🐛 Troubleshooting

### Backend won't start?
1. Check MySQL is running: `brew services list`
2. Verify database exists: `mysql -u root -p`, then `SHOW DATABASES;`
3. Check `application.properties` has correct credentials

### Frontend can't connect to backend?
1. Ensure backend is running on port 8080
2. Check CORS configuration in `SecurityConfig.java`
3. Verify Vite proxy in `vite.config.js`

### Port already in use?
```bash
# Find process using port 8080
lsof -i :8080

# Kill it
kill -9 <PID>
```

---

## 📝 Configuration Files

### Backend (`application.properties`)
- Database URL, username, password
- Server port (default: 8080)
- JPA/Hibernate settings
- JWT secret key

### Frontend (`vite.config.js`)
- Development server port (default: 5173)
- API proxy configuration

---

## 🎓 Learning Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Introduction](https://jwt.io/introduction)

---

## 📧 Support

For issues or questions about this project template, check:
1. Console logs in browser (F12)
2. Backend terminal output
3. MySQL connection

---

## 🚀 Deployment (Future)

### Backend
- Heroku
- Railway
- AWS Elastic Beanstalk

### Frontend
- Vercel
- Netlify
- GitHub Pages

### Database
- Railway
- AWS RDS
- PlanetScale

---

## ✨ Next Steps

1. ✅ Set up your Mac with Maven and MySQL
2. ✅ Create the database
3. ✅ Run backend and frontend
4. ✅ Verify both are connected
5. 🔨 Start implementing Authentication APIs
6. 🔨 Build out the remaining features

---

**Happy Coding! 🚀**

Built with ❤️ for your resume and interview prep!
