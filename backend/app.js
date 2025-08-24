// Register result routes
const resultRoutes = require('./routes/resultRoutes');
app.use('/api/result', resultRoutes);
// Register schedule routes
const scheduleRoutes = require('./routes/scheduleRoutes');
app.use('/api/schedule', scheduleRoutes);
// Register course routes
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/course', courseRoutes);
// Register student routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/student', studentRoutes);
// Register teacher routes
const teacherRoutes = require('./routes/teacherRoutes');
app.use('/api/teacher', teacherRoutes);
// Register assignment routes
const assignmentRoutes = require('./routes/assignmentRoutes');
app.use('/api/assignments', assignmentRoutes);
const express = require('express');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Register authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Class Management System Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
