module.exports = (app, con) => {
  app.get("/api/assignments", (req, res) => {
    const { session } = req.query;
console.log("Received session:", session);
    const sql = `SELECT * FROM Course_Assignments WHERE session = ?`;

    con.query(sql, [session], (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.json({ success: false, error: "Database error" });
      }
      res.json({ success: true, assignments: result });
    });
  });
};
