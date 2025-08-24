// teacherDailySchedulePage.js
// ...existing code from teacher_dailyShi_front.js...

const scheduleContainer = document.getElementById("scheduleContainer");
const dayTabs = document.getElementById("dayTabs");
const currentDayDiv = document.getElementById("currentDay");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = days[new Date().getDay()];
currentDayDiv.textContent = `Today: ${today}`;

const teacherId = sessionStorage.getItem("teacherId");

async function loadSchedule(day) {
  scheduleContainer.innerHTML = `<div class="loading"><h3>Loading schedule for ${day}...</h3></div>`;
  try {
    const res = await fetch(`/api/teacher_daily_schedule?teacherId=${teacherId}&day=${day}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.schedule) || data.schedule.length === 0) {
      scheduleContainer.innerHTML = `<p>No schedule found for ${day}.</p>`;
      return;
    }
    let html = `
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Session</th>
            <th>Room</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
    `;
    data.schedule.forEach(row => {
      html += `
        <tr>
          <td>${row.Course_Code}</td>
          <td>${row.Session}</td>
          <td>${row.Class_Room}</td>
          <td>${row.Start_Time} - ${row.End_Time}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
    scheduleContainer.innerHTML = html;
  } catch (err) {
    console.error("Error fetching schedule:", err);
    scheduleContainer.innerHTML = `<p>⚠️ Error loading schedule</p>`;
  }
}

days.forEach(day => {
  const btn = document.createElement("button");
  btn.textContent = day;
  btn.classList.add("day-tab");
  if (day === today) btn.classList.add("active");
  btn.addEventListener("click", () => {
    document.querySelectorAll(".day-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadSchedule(day);
  });
  dayTabs.appendChild(btn);
});

loadSchedule(today);
// ...existing code...
