// /home/kali/clone_project/teacher_dailyShi_backend.js

module.exports = (app, con) => {
  // console.log("✅ Teacher Daily Schedule API loaded");

  // 👉 Teacher daily schedule API
  app.get("/api/teacher_daily_schedule", (req, res) => {
    const { teacherId, day } = req.query;

    if (!teacherId || !day) {
      return res.json({ success: false, message: "Missing teacherId or day" });
    }

    const sql = `
      SELECT Day, Course_Code, Session, Class_Room, Teacher_Short_Name,
             Start_Time, End_Time, sem_No, Teacher_Id
      FROM Daily_Schedule
      WHERE Teacher_Id = ? AND Day = ?
      ORDER BY Start_Time ASC
    `;

    con.query(sql, [teacherId, day.toUpperCase()], (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.json({ success: false, message: "Database error" });
      }

      res.json({ success: true, schedule: result });
    });
  });
};
