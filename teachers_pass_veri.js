// teachers_pass_veri.js

const path = require('path');

module.exports = function(app, con) {
  app.post("/teacher_login", (req, res) => {
    const { teacher_user, teacher_pass } = req.body;

    console.log(req.body); // Log the request body for debugging



    const query = "SELECT * FROM Teacher_Log_Info WHERE teacher_name = ? AND password = ?";
    con.query(query, [teacher_user, teacher_pass], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "❌ Database Error" });
      }

      if (result.length > 0) {
        // Send teacher data as JSON
        res.json({
          success: true,
          teacherId: result[0].Teacher_Id,
          teacherName: result[0].teacher_name,
          redirect: '/Teachers_page.html'
        });
      } else {
        res.json({
          success: false,
          message: "Invalid Teacher Username or Password"
        })
      }
    });
  });
};
