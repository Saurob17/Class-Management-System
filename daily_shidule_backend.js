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


// ================= Next Class =================

  app.get('/api/next_class', (req, res) => {
    const { session, sem_No } = req.query;

    if (!session || !sem_No) 
      return res.json({ success:false, message:"Session and sem_No required" });

    const now = new Date();
    const currentDayIndex = now.getDay(); // 0=Sunday, 1=Monday...
    const currentMinutes = now.getHours()*60 + now.getMinutes();

    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    // 1️⃣ DB থেকে সমস্ত ক্লাস নিয়ে আসা
    const sql = `SELECT * FROM Daily_Schedule WHERE Session=? AND sem_No=? ORDER BY Day ASC, Start_Time ASC`;
    con.query(sql, [session, sem_No], (err, results) => {
      if (err) return res.json({ success:false, message:"DB error" });
      if (!results || results.length === 0) return res.json({ success:false, message:"No classes found" });

      // 2️⃣ প্রতিটি ক্লাসকে dayIndex এবং minutes সহ map করা
      const allClasses = results.map(c => {
        let [h,m] = c.Start_Time.split(':').map(Number);
        let [eh, em] = c.End_Time.split(':').map(Number);
        const dayIndex = days.findIndex(d => d.toLowerCase() === c.Day.toLowerCase());
        return { ...c, dayIndex, startMinutes: h*60+m, endMinutes: eh*60+em };
      }).filter(c => c.dayIndex !== -1); // invalid day remove

      // 3️⃣ আজকের বাকি ক্লাস খোঁজা
      let nextClass = allClasses.find(c => c.dayIndex === currentDayIndex && c.endMinutes > currentMinutes);

      // 4️⃣ যদি আজকের কোনো বাকি ক্লাস না থাকে, পরবর্তী দিনের প্রথম ক্লাস
      if (!nextClass) {
        for(let i=1; i<=7; i++) {
          const nextDayIndex = (currentDayIndex + i) % 7;
          nextClass = allClasses.find(c => c.dayIndex === nextDayIndex);
          if(nextClass) break;
        }
      }

      if (nextClass) {
        res.json({ success:true, nextClass });
      } else {
        res.json({ success:true, nextClass:null });
      }
    });
  });

};
