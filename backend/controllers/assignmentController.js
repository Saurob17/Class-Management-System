// controllers/assignmentController.js
const db = require('../config/db');

exports.createAssignment = async (req, res) => {
  const { teacherId, courseCode, courseName, deadline, session, topic } = req.body;
  if (!teacherId || !courseCode || !courseName || !deadline || !session) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }
  try {
    db.query(
      "INSERT INTO Course_Assignments (Teacher_Id, course_code, course_name, deadline, session, topic) VALUES (?, ?, ?, ?, ?, ?)",
      [teacherId, courseCode, courseName, deadline, session, topic],
      (err, result) => {
        if (err) {
          console.error("DB error:", err);
          return res.status(500).json({ success: false, error: "DB error" });
        }
        res.json({ success: true, id: result.insertId });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getAssignments = (req, res) => {
  const teacherId = req.query.teacherId;
  if (!teacherId) {
    return res.status(400).json({ success: false, message: "Missing teacherId" });
  }
  db.query(
    "SELECT * FROM Course_Assignments WHERE Teacher_Id = ? ORDER BY deadline",
    [teacherId],
    (err, rows) => {
      if (err) {
        console.error("DB Fetch Error:", err);
        return res.status(500).json({ success: false, message: "DB Error" });
      }
      res.json({ success: true, assignments: rows });
    }
  );
};

exports.deleteAssignment = (req, res) => {
  const { courseCode, session } = req.body;
  if (!courseCode || !session) {
    return res.status(400).json({ success: false, message: "Missing delete identifiers" });
  }
  db.query(
    "DELETE FROM Course_Assignments WHERE course_code = ? AND session = ?",
    [courseCode, session],
    (err, result) => {
      if (err) {
        console.error("DB Delete Error:", err);
        return res.status(500).json({ success: false, message: "DB Error" });
      }
      res.json({ success: true, deleted: result.affectedRows });
    }
  );
};
