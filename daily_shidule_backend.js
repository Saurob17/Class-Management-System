// daily_schedule.js (backend)
module.exports = (app, con) => {
  app.get('/api/daily_schedule', (req, res) => {
    const { day, session, sem_No } = req.query;

    console.log("📌 Fetching schedu99le for:", day, session, sem_No);

    if (!day || !session || !sem_No) {
      return res.json({ success: false, message: "Day, Session, and sem_No are required" });
    }

    const sql = `
      SELECT * 
      FROM Daily_Schedule 
      WHERE Day = ? AND Session = ? AND sem_No = ?
      ORDER BY Start_Time
    `;

    con.query(sql, [day, session, sem_No], (err, result) => {
      if (err) {
        console.error("❌ DB Error:", err);
        return res.json({ success: false, message: "Database error" });
      }
      console.log("📌 Schedule fetch8ed:", result);

      res.json({ success: true, schedule: result });
    });
  });
};
