const path = require("path");

module.exports = function(app, con) {
  app.post("/batch_login", (req, res) => {
    const { batch_user, batch_pass } = req.body;

    const query = "SELECT * FROM Batch_Log_Info WHERE id = ? AND password = ?";
    con.query(query, [batch_user, batch_pass], (err, result) => {
      if (err) {
        console.error("SQL ERROR:", err);
        return res.status(500).send("❌ Database Error");
      }

      if (result.length > 0) {
        res.sendFile(path.join(__dirname, 'Public', 'student_page.html'));
      } else {
        res.send("❌ Invalid Batch Login.");
      }
    });
  });
};
