// teacher_assignment_backend.js
module.exports = function(app, con) {
  app.post('/api/teacher_assignment', (req, res) => {
    const { teacherId, courseCode, courseName, deadline, session, topic } = req.body;
    if (!teacherId || !courseCode || !courseName || !deadline || !session || !topic) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    con.query(
      'INSERT INTO Course_Assignments (Teacher_Id, course_code, course_name, deadline, session, topic) VALUES (?, ?, ?, ?, ?, ?)',
      [teacherId, courseCode, courseName, deadline, session, topic],
      (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'DB error' });
        }
        res.json({ success: true });
      }
    );
  });
};