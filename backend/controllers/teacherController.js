// controllers/teacherController.js
const db = require('../config/db');

exports.teacherLogin = async (req, res) => {
  const { teacherUser, teacherPass } = req.body;
  if (!teacherUser || !teacherPass) {
    return res.status(400).json({ success: false, message: "Missing credentials" });
  }
  db.query(
    "SELECT * FROM Teacher_Log_Info WHERE teacher_name = ? AND password = ?",
    [teacherUser, teacherPass],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database Error" });
      }
      if (result.length > 0) {
        // TODO: Issue JWT token for session management
        res.json({
          success: true,
          teacherId: result[0].Teacher_Id,
          teacherName: result[0].teacher_name,
          // token: jwtToken
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid Teacher Username or Password"
        });
      }
    }
  );
};
