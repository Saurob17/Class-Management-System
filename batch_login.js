const path = require("path");

module.exports = function(app, con) {
  app.post("/batch_login", (req, res) => {
    const { batch_user, batch_pass } = req.body;

    const query = "SELECT * FROM Batch_Log_Info WHERE id = ? AND password = ?";
    con.query(query, [batch_user, batch_pass], (err, result) => {
      if (err) {
        console.error("SQL ERROR:", err);
        return res.status(500).json({ success: false, message: "❌ Database Error" });
      }

      if (result.length > 0) {
        // Send batch info as JSON (like teacher login)
        res.json({
          success: true,
          batchId: result[0].id,
          semester: result[0].semester, // Make sure your table has this column
          redirect: '/student_page.html'
        });
      } else {
        res.json({
          success: false,
          message: "❌ Invalid Batch Login."
        });
      }
    });
  });
};
