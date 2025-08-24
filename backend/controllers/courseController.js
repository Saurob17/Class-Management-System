// controllers/courseController.js
const db = require('../config/db');

exports.getBatchCourses = (req, res) => {
  const semNo = req.query.sem_No;
  if (!semNo) return res.status(400).json({ success: false, message: 'No semester provided' });
  db.query(
    'SELECT Course_Code, Course_Name, sem_No FROM Course_Info WHERE sem_No = ?',
    [semNo],
    (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ success: false, message: 'DB error' });
      }
      res.json({ success: true, courses: result });
    }
  );
};
