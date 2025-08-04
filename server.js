// server.js
const mysql = require('mysql');

const con = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1',
  database: 'Department'
});

module.exports = con;



// const mysql = require('mysql');
// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');

// const app = express();

// // ডাটাবেজ কানেকশন
// const con = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'root',
//   password: '1',         // তোমার MySQL পাসওয়ার্ড
//   database: 'Department' // ডাটাবেজ নাম
// });

// con.connect(err => {
//   if (err) {
//     console.error('DB connection error:', err);
//     return;
//   }
//   console.log('DB connected successfully!');
// });

// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, 'Public')));

// // হোম পেজ (লগইন পেজ)
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'Public', 'Login_page.html'));
// });

// // টিচার লগইন হ্যান্ডেলিং
// app.post('/teacher_login', (req, res) => {
//   const { teacher_user, teacher_pass } = req.body;

//   const sql = 'SELECT * FROM Teacher_Log_Info WHERE teacher_name = ? AND password = ?';

//   con.query(sql, [teacher_user, teacher_pass], (err, results) => {
//     if (err) {
//       console.error('DB query error:', err);
//       res.status(500).send('Internal server error');
//       return;
//     }

//     if (results.length > 0) {
//       // লগইন সফল হলে Teachers_page.html পাঠাও
//       res.sendFile(path.join(__dirname, 'Public', 'Teachers_page.html'));
//     } else {
//       // ভুল ইউজারনেম/পাসওয়ার্ড হলে আবার Login পেজ দেখাও
//       res.sendFile(path.join(__dirname, 'Public', 'Login_page.html'));
//     }
//   });
// });

// // সার্ভার চালানো
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
