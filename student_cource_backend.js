// student_cource_backend.js
module.exports = function(app, con) {
  app.get('/api/batch_courses', (req, res) => {

    const sem_No = req.query.sem_No;   // ✅ Frontend থেকে sem_No query প্যারামিটার নিবে

    if (!sem_No) return res.json({ success: false, message: 'No semester provided' });
    
    console.log("📌 Fetching courses for semester:", sem_No);

    con.query(
      'SELECT Course_Code, Course_Name, sem_No FROM Course_Info WHERE sem_No = ?', // ✅ DB থেকে query করবে
      [sem_No],
      (err, result) => {
        console.log("here")
        if (err) {
          console.error("DB error:", err);
          return res.status(500).json({ success: false, message: 'DB error' });
        }
        console.log("📌 Courses fetched:", result);
        res.json({ success: true, courses: result });
      }
    );
  });
};
