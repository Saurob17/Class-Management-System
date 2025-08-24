// Teacher_page_backedn.js
module.exports = function(app, con) {
    app.get('/api/teacher_courses', (req, res) => {
        const teacherId = req.query.teacherId;
        if (!teacherId) {
            return res.status(400).json({ success: false, message: 'No teacher ID provided' });
        }
        con.query(
            'SELECT Course_Code, Session, Class_Confirmation FROM Teachers_Course WHERE Teacher_Id = ?',
            [teacherId],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'DB error' });
                }
                res.json({ success: true, courses: result });
            }
        );
    });
};
