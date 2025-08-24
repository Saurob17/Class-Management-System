# Class Management System

A web-based application for managing classes, attendance, assignments, schedules, resources, results, and user authentication for students and teachers.

---

## Features

* **User Authentication:** Secure login system for students, teachers, and admin.
* **Attendance Management:** Track and manage student attendance.
* **Assignment Management:** Create, submit, and review assignments.
* **Daily Schedule:** Manage and view class schedules.
* **Course Management:** Assign and manage courses for students and teachers.
* **Result Management:** Enter and view student results.
* **Resource Sharing:** Upload and share class resources.
* **Role-Based Dashboards:** Dedicated pages for students, teachers, and admin with relevant information.

---

## Project Structure

```
Class-Management-System/
│
├── backend/                   # Server-side code
│   ├── config/                # Database connection (MariaDB)
│   ├── controllers/           # Business logic for each feature
│   ├── models/                # Data models
│   ├── routes/                # API endpoints
│   ├── services/              # Service layer for DB operations
│   ├── utils/                 # Helper functions and validators
│   └── package.json           # Backend dependencies
│
├── frontend/                  # Client-side code
│   ├── public/                # HTML pages and static assets
│   ├── src/                   # Frontend JS logic
│   └── package.json           # Frontend dependencies
│
└── README.md
```

---

## Backend

* Node.js + Express server
* MariaDB (via XAMPP) for persistent storage
* Modular MVC structure: controllers, services, routes, utils
* RESTful API endpoints for all features

## Frontend

* HTML pages for login, attendance, assignments, schedules, resources, results, and dashboards.
* JavaScript files for frontend logic and API integration.

---

## Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Configure Database:**

* Start XAMPP and ensure MariaDB is running.
* Update `backend/config/db.js` with your DB credentials if needed.

3. **Run the server:**

```bash
node server.js
```

4. **Access the app:**

* Open your browser and go to `http://localhost:3000` (or your configured port).

---

## Customization

* Modify backend files (`controllers`, `services`, `routes`) to change business logic.
* Update frontend HTML/JS files in `frontend/` or `public/` for UI changes.
* Add new features by creating new controllers, services, routes, or frontend components.

---

## License

This project is for educational purposes only.
