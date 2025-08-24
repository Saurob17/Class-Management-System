# Class Management System

A web-based application for managing classes, attendance, assignments, schedules, resources, results, and user authentication for students and teachers.

## Features

- **Student & Teacher Login:** Secure login system for batch and individual users.
- **Attendance Management:** Track and manage student attendance.
- **Assignment Management:** Create, submit, and review assignments for students and teachers.
- **Daily Schedule:** Manage and view daily class schedules.
- **Course Management:** Assign and manage courses for students and teachers.
- **Result Management:** Enter, view, and connect student results.
- **Resource Sharing:** Upload and share resources for classes.
- **User Pages:** Dedicated pages for students and teachers with relevant information.

## Project Structure

```
Class-Management-System/
│
├── attendance_backend.js
├── batch_login.js
├── Connect_Result.js
├── connected_file.js
├── daily_shidule_backend.js
├── result_backend.js
├── server.js
├── Stu_Assignment.js
├── student_assignment_backend.js
├── student_cource_backend.js
├── student_pages.js
├── teacher_assignment_backend.js
├── teacher_dailyShi_backend.js
├── Teacher_page_backedn.js
├── Teachers_cources_backend.js
├── teachers_pass_veri.js
├── package.json
├── README.md
│
└── Public/
	 ├── assignment.html
	 ├── attendence_front.js
	 ├── Attendence.html
	 ├── batch_cource.html
	 ├── Daily_shidule_front.js
	 ├── daily_shidule.html
	 ├── Home_page.html
	 ├── Login_page.html
	 ├── login.js
	 ├── next_class_front.js
	 ├── Resource_.js
	 ├── Resource_file.html
	 ├── Result_JS_code.js
	 ├── Result_page.html
	 ├── student_assignment_front.js
	 ├── student_assignment.html
	 ├── student_cource_front.js
	 ├── student_page.html
	 ├── Student_result.html
	 ├── teacher_assignment.js
	 ├── Teacher_cource_front.js
	 ├── Teacher_daily_shidule.html
	 ├── teacher_dailyShi_front.js
	 ├── teachers_cources.html
	 ├── Teachers_page.html
	 └── teachers_pages_front.js
```

## Backend

- Node.js server (`server.js`)
- Multiple backend modules for attendance, assignments, schedules, courses, results, and authentication.

## Frontend

- HTML pages for login, attendance, assignments, schedules, resources, results, and user dashboards.
- JavaScript files for frontend logic and API calls.

## Getting Started

1. **Install dependencies:**
	```powershell
	npm install
	```

2. **Run the server:**
	```powershell
	node server.js
	```

3. **Access the app:**
	Open your browser and go to `http://localhost:3000` (or the port specified in your server).

## Customization

- Modify backend JS files to change business logic.
- Update HTML and JS files in `Public/` for UI changes.

## License

This project is for educational purposes.
