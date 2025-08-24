
// student_assignment_backend.js
module.exports = (app, con) => {
  // Fetch assignments for a specific student session
  app.get("/api/student_assignment", (req, res) => {
    console.log("Received request for /api/student_assignment with query:", req.query); // optional log
    const studentSession = req.query.session;
    console.log("Fetching assignments for session:", studentSession); // optional log
    if (!studentSession) {
      return res.json({ success: false, message: "Missing session parameter" });
    }

    const sql = "SELECT * FROM Course_Assignments WHERE session = ? ORDER BY deadline";
    con.query(sql, [studentSession], (err, rows) => {
      if (err) {
        console.error("DB Fetch Error:", err);
        return res.json({ success: false, message: "DB Error" });
      }

      console.log("Assignments returned:", rows); // optional log
      res.json({ success: true, assignments: rows });
    });
  });
};
