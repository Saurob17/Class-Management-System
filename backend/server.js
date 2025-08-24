const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Import routes
const assignmentRoutes = require('./routes/assignmentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const resultRoutes = require('./routes/resultRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

// Use routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);

app.get('/', (req, res) => {
  res.send('Class Management System Backend Running');
});

const sequelize = require('./config/db');

const mariadb = require('mariadb');

// Ensure database exists before Sequelize connects
async function ensureDatabase() {
  const dbName = 'class_management_db';
  const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    connectionLimit: 1
  });
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' ensured.`);
  } catch (err) {
    console.error('Failed to ensure database:', err.message);
    process.exit(1);
  } finally {
    if (conn) conn.release();
    pool.end();
  }
}

ensureDatabase().then(() => {
  sequelize.authenticate()
    .then(() => {
      console.log('Database connected successfully.');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Database connection failed:', err.message);
    });
});
