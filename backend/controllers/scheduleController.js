// controllers/scheduleController.js
const db = require('../config/db');

exports.getDailySchedule = (req, res) => {
  const { day, session, sem_No } = req.query;
  if (!day || !session || !sem_No) {
    return res.status(400).json({ success: false, message: "Day, Session, and sem_No are required" });
  }
  const sql = `
    SELECT * 
    FROM Daily_Schedule 
    WHERE Day = ? AND Session = ? AND sem_No = ?
    ORDER BY Start_Time
  `;
  db.query(sql, [day, session, sem_No], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, schedule: result });
  });
};

exports.getNextClass = (req, res) => {
  const { session, sem_No, day, currentTime } = req.query;
  if (!session || !sem_No || !day || !currentTime) {
    return res.status(400).json({ success: false, message: "Missing required parameters" });
  }
  const sql = `
    SELECT * 
    FROM Daily_Schedule
    WHERE Session = ? AND sem_No = ? AND Day = ? AND Start_Time > ?
    ORDER BY Start_Time ASC
    LIMIT 1
  `;
  db.query(sql, [session, sem_No, day, currentTime], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    if (result.length > 0) {
      res.json({ success: true, nextClass: result[0] });
    } else {
      res.json({ success: false, message: "No next class found" });
    }
  });
};
