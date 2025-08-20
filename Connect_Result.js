// Connect_Result.js
// This file should contain backend code to connect to the database and serve result-related APIs.
// Example: Node.js/Express code for result endpoints

module.exports = function(app, con) {
  // Get marks for all students for a course, session, semester
  app.get('/api/marks', (req, res) => {
    const { courseCode, session, sem_No } = req.query;
    if (!courseCode || !session || !sem_No) {
      return res.json({ success: false, message: 'Missing parameters' });
    }
    // Join Mark_Table and Student_Table to get marks and student info
    const sql = `SELECT m.Roll, m.Attend, m.Mid_1, m.Mid_2, m.Assign_Mark
                 FROM Mark_Table m
                 JOIN Student_Table s ON m.Roll = s.Roll
                 WHERE m.Course_Code = ? AND s.Session = ? AND s.sem_No = ?`;
    con.query(sql, [courseCode, session, sem_No], (err, result) => {
      if (err) {
        console.log('DB error:', err);
        return res.json({ success: false, message: 'DB error' });
      }
      console.log('Result data:', JSON.stringify(result, null, 2)); // Print data to console
      res.json({ success: true, marks: result });
    });
  });
};
