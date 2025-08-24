// controllers/studentController.js
const db = require('../config/db');

exports.getBatchInfo = (req, res) => {
  const batchId = req.query.id;
  if (!batchId) return res.status(400).json({ success: false, message: 'No batch id provided' });
  db.query('SELECT session, sem_No FROM Batch_Log_Info WHERE id = ?', [batchId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });
    if (result.length > 0) {
      res.json({ success: true, session: result[0].session, sem_No: result[0].sem_No });
    } else {
      res.status(404).json({ success: false, message: 'Batch not found' });
    }
  });
};

exports.getCourseCount = (req, res) => {
  const semNo = req.query.sem_No;
  if (!semNo) return res.status(400).json({ success: false, message: 'No semester provided' });
  db.query('SELECT COUNT(*) AS count FROM Course_Info WHERE sem_No = ?', [semNo], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });
    res.json({ success: true, count: result[0].count });
  });
};

exports.getCourses = (req, res) => {
  const semNo = req.query.sem_No;
  if (!semNo) return res.status(400).json({ success: false, message: 'No semester provided' });
  db.query('SELECT Course_Code, Course_Name FROM Course_Info WHERE sem_No = ?', [semNo], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'DB error' });
    res.json({ success: true, courses: result });
  });
};

exports.getMarks = (req, res) => {
  const { courseCode, session, sem_No } = req.query;
  if (!courseCode || !session || !sem_No) {
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }
  db.query(
    'SELECT Roll, Attend, Mid_1, Mid_2, Assign_Mark FROM Student_Internal_Marks WHERE Course_Code = ? AND session = ? AND sem_No = ?',
    [courseCode, session, sem_No],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'DB error' });
      res.json({ success: true, marks: result });
    }
  );
};
