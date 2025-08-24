module.exports = function(app, con) {
  // console.log("✅ Result backend module loaded");

  // Internal Marks API only
  app.get('/api/internal_marks', (req, res) => {
    // console.log("📌 /api/internal_marks called with query:", req.query);
    const { courseCode, session } = req.query;
    // console.log("📌 Received parameters:", req.query);
    if (!courseCode || !session) {
      return res.json({ success: false, message: 'Missing parameters123' });
    }   

    // console.log("📌 Fetching marks for courseCode:", courseCode, "session:", session);

    const sql = `
      SELECT Roll, Mid_1, Mid_2, Assign_Mark
      FROM Mark_Table
      WHERE Course_Code = ? AND Session = ?
    `;
    con.query(sql, [courseCode, session], (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.json({ success: false, message: 'DB error' });
      }
      res.json({ success: true, marks: result });
    });
  });
};
