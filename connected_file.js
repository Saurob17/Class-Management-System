//connected_file.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const con = require('./server');

const teacher_page = require('./teachers_pass_veri');
const batch_page = require('./batch_login');  // ✅ ব্যাচ লজিক ফাইল ইমপোর্ট
const student_pages = require('./student_pages'); // Student API endpoints

const app = express();

// 👉 EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Static Public Folder
app.use(express.static(path.join(__dirname, 'Public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database connect
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

// Route handler modules
teacher_page(app, con);
batch_page(app, con);  // ✅ ব্যাচ লগইন রাউট যুক্ত
student_pages(app, con); // Register student API endpoints

const PORT = 700;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
