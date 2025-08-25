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
const studentAssignmentBackend = require('./Stu_Assignment');

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




// Catch-all route for static HTML files in Public
app.get('/:page', (req, res) => {
  const file = path.join(__dirname, 'Public', req.params.page);
  res.sendFile(file, err => {
    if (err) res.status(404).json({ success: false, message: 'Page not found' });
  });
});


// Add teacher
app.post('/api/teachers', (req, res) => {
  const { teacher_name, password } = req.body;
  if (!teacher_name || !password) return res.json({ success: false, message: 'Missing fields.' });

  const sql = `INSERT INTO Teacher_Log_Info (teacher_name, password) VALUES (?, ?)`;
  con.query(sql, [teacher_name, password], (err, result) => {
    if (err) return res.json({ success: false, message: 'DB error.' });
    res.json({ success: true });
  });
});


// Add student
app.post('/api/students', (req, res) => {
  const { Roll, Student_Name, Registration, sem_No, Session } = req.body;
  if (!Roll || !Student_Name || !Registration || !sem_No || !Session) 
    return res.json({ success: false, message: 'Missing fields.' });

  const sql = `INSERT INTO Student_Table (Roll, Student_Name, Registration, sem_No, Session)
               VALUES (?, ?, ?, ?, ?)`;
  con.query(sql, [Roll, Student_Name, Registration, sem_No, Session], (err, result) => {
    if (err) return res.json({ success: false, message: 'DB error.' });
    res.json({ success: true });
  });
});

// =================
// COURSES

// Add course
app.post('/api/courses', (req, res) => {
  const { Course_Code, Course_Name, sem_No } = req.body;
  if (!Course_Code || !Course_Name || !sem_No) 
    return res.json({ success: false, message: 'Missing fields.' });

  const sql = `INSERT INTO Course_Info (Course_Code, Course_Name, sem_No) VALUES (?, ?, ?)`;
  con.query(sql, [Course_Code, Course_Name, sem_No], (err, result) => {
    if (err) return res.json({ success: false, message: 'DB error.' });
    res.json({ success: true });
  });
});

// =================
/// TEACHERS_COURSE
// Get all teacher courses
app.get('/api/teacher_courses', (req, res) => {
  const { teacherId } = req.query;
  if (!teacherId) return res.status(400).json({ success: false, message: "Missing teacherId" });

  const sql = `SELECT * FROM Teachers_Course WHERE Teacher_Id = ?`;
  con.query(sql, [teacherId], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ success: false, message: "Database error." });
    }
    res.json({ success: true, courses: results });
  });
});



// Add teacher-course
app.post('/api/teacher_courses',(req,res)=>{
  const {Teacher_Id, Course_Code, Session} = req.body;
  if(!Teacher_Id || !Course_Code || !Session) return res.json({success:false,message:'Missing fields.'});
  const sql = `INSERT INTO Teachers_Course (Teacher_Id, Course_Code, Session) VALUES (?,?,?)`;
  con.query(sql,[Teacher_Id, Course_Code, Session],(err,result)=>{
    if(err) return res.json({success:false,message:'DB error.'});
    res.json({success:true});
  });
});

// =================
// MARKS
app.post('/api/marks', (req, res) => {
  const { Course_Code, Roll, Attendance_Mark, Mid_1, Mid_2, Assign_Mark, Session } = req.body;
  if (!Course_Code || !Roll || Attendance_Mark === undefined) 
    return res.json({ success: false, message: 'Missing fields.' });

  const sql = `INSERT INTO Mark_Table (Course_Code, Roll, Attendance_Mark, Mid_1, Mid_2, Assign_Mark, Session)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  con.query(sql, [Course_Code, Roll, Attendance_Mark, Mid_1, Mid_2, Assign_Mark, Session], (err, result) => {
    if (err) return res.json({ success: false, message: 'DB error.' });
    res.json({ success: true });
  });
});


// Add batch
app.post('/api/batches', (req, res) => {
  const { password, session, sem_No } = req.body;
  if(!password || !session || !sem_No) {
    return res.json({success:false, message:"Missing required fields"});
  }

  const sql = `INSERT INTO Batch_Log_Info (password, session, sem_No) VALUES (?, ?, ?)`;
  con.query(sql, [password, session, sem_No], (err, result) => {
    if(err) return res.json({success:false, message:"DB error"});
    res.json({success:true});
  });
});


// Get next class for a student
app.get('/api/next_class', (req, res) => {
  const { session, sem_No, day, currentTime } = req.query;

  if (!session || !sem_No || !day || !currentTime) {
    return res.json({ success: false, message: "Missing query parameters." });
  }

  const sql = `
    SELECT * FROM Daily_Schedule
    WHERE session = ? AND sem_No = ? AND Day = ? AND Start_Time > ?
    ORDER BY Start_Time ASC
    LIMIT 1
  `;

  con.query(sql, [session, sem_No, day, currentTime], (err, results) => {
    if (err) {
      console.error("Error fetching next class:", err);
      return res.json({ success: false, message: "DB error." });
    }

    if (results.length > 0) {
      res.json({ success: true, nextClass: results[0] });
    } else {
      res.json({ success: true, nextClass: null, message: "No more classes today" });
    }
  });
});


// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
