// teacher_assignment_backend.js
module.exports = (app, con) => {
  // নতুন Assignment যোগ করা
  // Example Node.js/Express
  app.post('/api/assignments', async (req, res) => {


    // console.log("received body:", req.body);
    const { Teacher_Id, course_code, course_name, deadline, session, topic } = req.body;
    // console.log("deadline in backend:", deadline);
    if (!Teacher_Id || !course_code || !course_name || !deadline || !session) {
      return res.json({ success: false, error: "Missing required fields" });
    }
    try {
      const result = await con.query(
        "INSERT INTO Course_Assignments (Teacher_Id, course_code, course_name, deadline, session, topic) VALUES (?, ?, ?, ?, ?, ?)",
        [Teacher_Id, course_code, course_name, deadline, session, topic]
      );
      res.json({ success: true, id: result.insertId });
    } catch (err) {
      res.json({ success: false, error: "DB error" });
    }
  });
  // সব Assignment লোড করা (teacher অনুযায়ী filter)
  app.get("/api/assignments", (req, res) => {
    const teacherId = req.query.teacherId; // frontend থেকে teacherId পাঠানো হবে

      if (!teacherId) {
       return res.json({ success: false, message: "Missing teacherId" });
      }

      con.query(
      "SELECT * FROM Course_Assignments WHERE Teacher_Id = ? ORDER BY deadline",
      [teacherId],
      (err, rows) => {
        if (err) {
          console.error("DB Fetch Error:", err);
          return res.json({ success: false, message: "DB Error" });
        }
        res.json({ success: true, assignments: rows });
      }
    );
  });

  // Assignment ডিলিট করা (course_code + session + deadline দিয়ে identify)
  app.delete("/api/assignments", (req, res) => {
    const { course_code, session } = req.body;
    if (!course_code || !session) {
      return res.json({ success: false, message: "Missing delete identifiers" });
    }
    // console.log("delete success")
    // console.log("course_code:", course_code, "session:", session);

    con.query(

      "DELETE FROM Course_Assignments WHERE course_code = ? AND session = ?",
      [course_code, session],
      (err, result) => {

        if (err) {
          console.error("DB Delete Error:", err);
          return res.json({ success: false, message: "DB Error" });
        }
        res.json({ success: true });
      }
    );
  });
};
