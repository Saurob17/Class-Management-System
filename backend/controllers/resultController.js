// controllers/resultController.js
const db = require('../config/db');

exports.getInternalMarks = (req, res) => {
  const { courseCode, session } = req.query;
  if (!courseCode || !session) {
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }
  const sql = `
    SELECT Roll, Mid_1, Mid_2, Assign_Mark
    FROM Mark_Table
    WHERE Course_Code = ? AND Session = ?
  `;
  db.query(sql, [courseCode, session], (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ success: false, message: 'DB error' });
    }
    res.json({ success: true, marks: result });
  });
};
