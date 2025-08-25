// teacher_assignment_backend.js
module.exports = (app, con) => {
  // নতুন assignment insert
  app.post("/api/assignments", (req, res) => {
    const { teacher_id, course_code, course_name, deadline, session, topic } = req.body;

    if (!teacher_id || !course_code || !course_name || !deadline || !session || !topic) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const sql = `INSERT INTO Assignments 
      (teacher_id, course_code, course_name, deadline, session, topic) 
      VALUES (?, ?, ?, ?, ?, ?)`;

    con.query(sql, [teacher_id, course_code, course_name, deadline, session, topic], (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return res.json({ success: false, message: "DB Error" });
      }
      res.json({ success: true, id: result.insertId });
    });
  });

  // সব assignment load
  app.get("/api/assignments", (req, res) => {
    con.query("SELECT * FROM Assignments ORDER BY deadline ASC", (err, rows) => {
      if (err) {
        console.error("Fetch Error:", err);
        return res.json({ success: false, message: "DB Error" });
      }
      res.json({ success: true, assignments: rows });
    });
  });

  // assignment delete
  app.delete("/api/assignments/:id", (req, res) => {
    const id = req.params.id;
    con.query("DELETE FROM Assignments WHERE id = ?", [id], (err) => {
      if (err) {
        console.error("Delete Error:", err);
        return res.json({ success: false, message: "DB Error" });
      }
      res.json({ success: true });
    });
  });
};
