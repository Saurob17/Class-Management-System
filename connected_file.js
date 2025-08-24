const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const con = require('./server'); // MySQL connection

// Route files
const teacher_page = require('./teachers_pass_veri');
const batch_page = require('./batch_login');
const student_pages = require('./student_pages');
const student_cource_backend = require('./student_cource_backend');
const teacherCourses = require('./Teachers_cources_backend'); 
const teacherPageBackend = require('./Teacher_page_backedn');  
const dailyScheduleBackend = require('./daily_shidule_backend');
const resultBackend = require('./result_backend');
const teacherAssignmentBackend = require('./teacher_assignment_backend');
const teacherDailyShiBackend = require('./teacher_dailyShi_backend'); 
//student_assignment_backend.js
const studentAssignmentBackend = require('./student_assignment_backend');

// -----------------
// App initialization
const app = express();

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// -----------------
// Register routes AFTER app initialized
teacher_page(app, con);
batch_page(app, con);
student_pages(app, con);
student_cource_backend(app, con);
teacherCourses(app, con);  
teacherPageBackend(app, con); 
dailyScheduleBackend(app, con); 
resultBackend(app, con);
teacherAssignmentBackend(app, con);
teacherDailyShiBackend(app, con);
studentAssignmentBackend(app, con);

// -----------------
// Static files
app.use(express.static(path.join(__dirname, 'Public')));

// DB connect
con.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('✅ DB Connected');
});

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'Login_page.html'));
});

// Server
const PORT = 700;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
