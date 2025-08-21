// connected_file.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const con = require('./server');

const teacher_page = require('./teachers_pass_veri');
const batch_page = require('./batch_login');
const student_pages = require('./student_pages');
const student_cource_backend = require('./student_cource_backend');
const teacherCourses = require('./Teachers_cources_backend'); // ✅ ঠিক নাম

const app = express();

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 👉 API Routes আগে register করতে হবে
teacher_page(app, con);
batch_page(app, con);
student_pages(app, con);
student_cource_backend(app, con);
teacherCourses(app, con);   // ✅ এখানে ঠিক নাম ব্যবহার

// 👉 Static files পরে
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

const PORT = 700;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
