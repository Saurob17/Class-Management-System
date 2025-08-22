module.exports = function(app, con) {
  console.log("✅ Result backend module loaded");

  // Internal Marks API
  app.get('/api/internal_results', (req, res) => {
    const { courseCode, session, sem_No } = req.query;
    if (!courseCode || !session || !sem_No) {
      return res.json({ success: false, message: 'Missing parameters' });
    }

    const sql = `
      SELECT m.Roll, m.Mid_1, m.Mid_2, m.Assign_Mark
      FROM Mark_Table m
      JOIN Student_Table s ON m.Roll = s.Roll
      WHERE m.Course_Code = ? AND s.Session = ? AND s.sem_No = ?
    `;
    con.query(sql, [courseCode, session, sem_No], (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.json({ success: false, message: 'DB error' });
      }
      res.json({ success: true, internal: result });
    });
  });

  // External Results API (CGPA/Grade)
  app.get('/api/external_results', (req, res) => {
    const { session, sem_No } = req.query;
    if (!session || !sem_No) {
      return res.json({ success: false, message: 'Missing parameters' });
    }

    const sql = `
      SELECT s.Roll, m.Sem_CGPA
      FROM Mark_Table m
      JOIN Student_Table s ON m.Roll = s.Roll
      WHERE s.Session = ? AND s.sem_No = ?
    `;
    con.query(sql, [session, sem_No], (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.json({ success: false, message: 'DB error' });
      }
      res.json({ success: true, external: result });
    });
  });
};
