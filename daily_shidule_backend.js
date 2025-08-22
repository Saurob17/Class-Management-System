module.exports = (app, con) => {
  app.get('/api/daily_schedule', (req, res) => {
    const day = req.query.day;

    console.log("📌 Fetching schedule for day_here:", day);

    if (!day) {
      return res.json({ success: false, message: "Day is required" });
    }

    con.query(
      "SELECT * FROM Daily_Schedule WHERE Day = ? ORDER BY Start_Time",
      [day],
      (err, result) => {
        if (err) {
          console.error("❌ DB Error:", err);
          return res.json({ success: false, message: "Database error" });
        }

        console.log("response data_> ", result);

        res.json({
          success: true,
          schedule: result
        });
      }
    );
  });
};
