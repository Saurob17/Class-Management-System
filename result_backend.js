module.exports = function(app, con) {
  console.log("✅ Result backend module loaded");

  // Internal Marks API only
  app.get('/api/marks', (req, res) => {
    const { courseCode, session } = req.query;
    if (!courseCode || !session) {
      return res.json({ success: false, message: 'Missing parameters' });
    }   

    console.log("📌 Fetching marks for courseCode:", courseCode, "session:", session);

    const sql = `
      SELECT Roll, Attend, Mid_1, Mid_2, Assign_Mark
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
