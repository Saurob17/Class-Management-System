// controllers/authController.js
const db = require('../config/db');

exports.batchLogin = async (req, res) => {
  try {
    const { batchUser, batchPass } = req.body;
    const query = "SELECT * FROM Batch_Log_Info WHERE id = ? AND password = ?";
    db.query(query, [batchUser, batchPass], (err, result) => {
      if (err) {
        console.error("SQL ERROR:", err);
        return res.status(500).json({ success: false, message: "Database Error" });
      }
      if (result.length > 0) {
        // TODO: Issue JWT token here for session management
        return res.json({
          success: true,
          batchId: result[0].id,
          semester: result[0].semester,
          // token: jwtToken
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid Batch Login."
        });
      }
    });
  } catch (error) {
    console.error("Batch login error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
