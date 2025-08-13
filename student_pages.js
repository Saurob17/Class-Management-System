// student_pages.js
// API endpoint to get batch info by id
module.exports = function(app, con) {
  app.get('/api/batch_info', (req, res) => {
    const batchId = req.query.id;
    if (!batchId) return res.json({ success: false, message: 'No batch id provided' });
    con.query('SELECT session, sem_No FROM Batch_Log_Info WHERE id = ?', [batchId], (err, result) => {
      if (err) return res.json({ success: false, message: 'DB error' });
      if (result.length > 0) {
        res.json({ success: true, session: result[0].session, sem_No: result[0].sem_No });
      } else {
        res.json({ success: false, message: 'Batch not found' });
      }
    });
  });

  // API endpoint to get course count by semester number
  app.get('/api/course_count', (req, res) => {
    const sem_No = req.query.sem_No;
    if (!sem_No) return res.json({ success: false, message: 'No semester provided' });
    con.query('SELECT COUNT(*) AS count FROM Course_Info WHERE sem_No = ?', [sem_No], (err, result) => {
      if (err) return res.json({ success: false, message: 'DB error' });
      res.json({ success: true, count: result[0].count });
    });
  });

  // API endpoint to get all courses for a semester
  app.get('/api/courses', (req, res) => {
    const sem_No = req.query.sem_No;
    if (!sem_No) return res.json({ success: false, message: 'No semester provided' });
    con.query('SELECT Course_Code, Course_Name FROM Course_Info WHERE sem_No = ?', [sem_No], (err, result) => {
      if (err) return res.json({ success: false, message: 'DB error' });
      res.json({ success: true, courses: result });
    });
  });
};
