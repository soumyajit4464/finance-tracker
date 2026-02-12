💰 Finance Tracker – Full Stack Financial Management System

A production-style full-stack finance management application built independently using Spring Boot, React, and MySQL.

The system is designed to demonstrate secure authentication, clean architecture principles, and real-world financial domain modeling.

🔐 Core Capabilities

1. Stateless authentication using JWT
2. Role-based access control with Spring Security
3. Multi-account financial tracking
4. Income & expense management
5. Budget allocation and monitoring
6. RESTful API design with proper DTO separation
7. Structured layered backend architecture
8. Data persistence using JPA & Hibernate

🏗 System Architecture
Backend (Spring Boot)

1. The backend follows a clean layered architecture:
2. Controller Layer – REST endpoints
3. Service Layer – Business logic abstraction
4. Repository Layer – Data persistence
5. Security Layer – JWT filter & authentication provider
6. DTO Layer – Request/response mapping

Design principles applied:

1. Separation of Concerns
2. Dependency Injection
3. Stateless session handling
4. Proper exception handling strategy

Frontend (React)

1. Component-based architecture
2. entralized API service layer
3. Protected routes for authenticated users
4. Chart-based visualization for analytics
5. Axios interceptors for JWT handling

🗄 Domain Model

Primary entities:

1. User
2. Account
3. Transaction
4. Budget
5. Category

Relational mapping handled via Hibernate ORM with proper entity relationships and constraints.

🛠 Tech Stack
Backend

1. Java 17
2. Spring Boot
3. Spring Security
4. JWT
5. JPA / Hibernate
6. MySQL
7. Maven

Frontend

1. React 18
2. Vite
3. React Router
4. Axios
5. Recharts

▶️ Running the Application
Backend
mvn spring-boot:run


Runs on:

http://localhost:8080

Frontend
npm install
npm run dev


Runs on:

http://localhost:5173

🎯 Engineering Focus

This project was developed independently with emphasis on:

1. Secure API development
2. JWT token lifecycle handling
3. Clean code & modular structure
4. Financial data modeling
5. Full-stack integration
6. Practical implementation of Spring Security

👨‍💻 Author

Soumyajit Biswas
Full Stack Developer – Java & React