// Teachers_cources_backend.js
module.exports = function(app, con) {
  // ✅ Teacher এর course গুলো fetch করার API
  app.get('/api/teacher_courses', (req, res) => {
    const teacherId = req.query.teacherId;  // frontend থেকে query হিসেবে আসবে
    
    console.log("📌 teacherId received:", teacherId);

    if (!teacherId) {
      return res.status(400).json({ success: false, message: 'No teacher ID provided' });
    }

    con.query(
      'SELECT Course_Code, Session, Class_Confirmation FROM Teachers_Course WHERE Teacher_Id = ?', 
      [teacherId],
      (err, result) => {
        if (err) {
          console.error("❌ DB error:", err);
          return res.status(500).json({ success: false, message: 'DB error' });
        }
        console.log("📌 Courses fetched for teacher:", result);
        res.json({ success: true, courses: result });
      }
    );
  });
};
