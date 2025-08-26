// daily_schedule.js (backend)
module.exports = (app, con) => {
  app.get('/api/daily_schedule', (req, res) => {
    const { day, session, sem_No } = req.query;

    // console.log("📌 Fetching schedu99le for:", day, session, sem_No);

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
      // console.log("📌 Schedule fetch8ed:", result);

      res.json({ success: true, schedule: result });
    });
  });



app.get('/api/next_class', (req, res) => {
  const { session, sem_No, day, currentTime } = req.query;
  // console.log("📌 Fetching next class for:", { session, sem_No, day, currentTime });
  if (!session || !sem_No || !day || !currentTime) {
    // console.log("❌ Missing parameters:", { session, sem_No, day, currentTime });
    return res.json({ success: false, message: "Missing required parameters" });
  }

  const sql = `
    SELECT * 
    FROM Daily_Schedule
    WHERE Session = ? AND sem_No = ? AND Day = ? AND Start_Time > ?
    ORDER BY Start_Time ASC
    LIMIT 1
  `;

  // console.log("✅ Running query with:", { session, sem_No, day, currentTime });

  con.query(sql, [session, sem_No, day, currentTime], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.json({ success: false, message: "Database error" });
    }

    // console.log("Query result:", result);

    if (result.length > 0) {
      res.json({ success: true, nextClass: result[0] });
    } else {
      res.json({ success: true, nextClass: null, message: "No more classes today" });
    }
  });
});



};
