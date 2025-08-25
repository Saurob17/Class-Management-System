const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const con = require('./server'); // MySQL connection

// -----------------
// App initialization
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// -----------------
// Static files
app.use(express.static(path.join(__dirname, 'Public')));

// DB connect
// Register route files for login endpoints
const teacher_page = require('./teachers_pass_veri');
const batch_page = require('./batch_login');
teacher_page(app, con);
batch_page(app, con);
con.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('✅ DB Connected');
});

// Home route

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'Login_page.html'));
});

// Catch-all route for static HTML files in Public
app.get('/:page', (req, res) => {
  const file = path.join(__dirname, 'Public', req.params.page);
  res.sendFile(file, err => {
    if (err) res.status(404).send('Page not found');
  });
});

// =================
// TEACHERS
// Get all teachers
app.get('/api/teachers', (req, res) => {
  const sql = `SELECT Teacher_Id, teacher_name FROM Teacher_Log_Info`;
  con.query(sql, (err, results) => {
    if (err) return res.json({ success: false, message: 'DB error.' });
    res.json({ success: true, teachers: results });
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

// =================
// STUDENTS
// Get all students
app.get('/api/students', (req, res) => {
  const sql = `SELECT Roll, Student_Name, Registration, sem_No, Session FROM Student_Table`;
  con.query(sql, (err, results) => {
    if (err) return res.json({ success: false, message: 'DB error.' });
    res.json({ success: true, students: results });
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
// Get all courses
app.get('/api/courses', (req, res) => {
  const sql = `SELECT Course_Code, Course_Name, sem_No FROM Course_Info`;
  con.query(sql, (err, results) => {
    if (err) return res.json({ success: false, message: 'DB error.' });
    res.json({ success: true, courses: results });
  });
});

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
// TEACHERS_COURSE
// Get all teacher courses
app.get('/api/teacher_courses', (req, res) => {
  const { teacherId } = req.query;
  if (!teacherId) {
    return res.json({ success: false, message: "Missing teacherId" });
  }

  const sql = `SELECT * FROM Teachers_Course WHERE Teacher_Id = ?`;
  con.query(sql, [teacherId], (err, results) => {
    if (err) {
      console.error("Error fetching teacher courses:", err);
      return res.json({ success: false, message: "DB error." });
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
// DAILY_SCHEDULE
// Get all schedules
app.get('/api/daily_schedule', (req,res)=>{
  const sql = `SELECT * FROM Daily_Schedule`;
  con.query(sql,(err,results)=>{
    if(err) return res.json({success:false,message:'DB error.'});
    res.json({success:true, schedules:results});
  });
});

// Add schedule
app.post('/api/daily_schedule',(req,res)=>{
  const {
    Day, Course_Code, Session, Class_Room, Teacher_Short_Name,
    Start_Time, End_Time, sem_No, Teacher_Id
  } = req.body;
  if(!Day || !Course_Code || !Session || !Class_Room || !Teacher_Short_Name)
    return res.json({success:false,message:'Missing required fields.'});
  const sql = `INSERT INTO Daily_Schedule 
    (Day, Course_Code, Session, Class_Room, Teacher_Short_Name, Start_Time, End_Time, sem_No, Teacher_Id)
    VALUES (?,?,?,?,?,?,?,?,?)`;
  con.query(sql,[Day, Course_Code, Session, Class_Room, Teacher_Short_Name, Start_Time||null, End_Time||null, sem_No||null, Teacher_Id||null],
    (err,result)=>{
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


// Get all batches
app.get('/api/batches', (req, res) => {
  const sql = `SELECT id, password, session, sem_No FROM Batch_Log_Info`;
  con.query(sql, (err, results) => {
    if(err) return res.json({success:false, message:"DB error"});
    res.json({success:true, batches: results});
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



// =================
// Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
