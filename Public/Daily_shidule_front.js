// =====================
// Frontend: daily_schedule_front.js
// =====================

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayTabs = document.getElementById('dayTabs');
const scheduleContainer = document.getElementById('scheduleContainer');
const currentDayElem = document.getElementById('currentDay');

// Helper: ensure session info
function ensureSessionInfo(callback) {
  const sess = sessionStorage.getItem("session");
  const sem = sessionStorage.getItem("sem_No");
  callback(sess, sem);
}

function createDayTabs() {
  dayTabs.innerHTML = '';
  days.forEach(day => {
    const btn = document.createElement('button');
    btn.className = 'day-tab';
    btn.textContent = day;
    btn.onclick = () => {
      document.querySelectorAll(".day-tab").forEach(tab => tab.classList.remove("active"));
      btn.classList.add("active");
      loadScheduleData(day);
    };
    dayTabs.appendChild(btn);
  });
}

function loadScheduleData(selectedDay) {
  currentDayElem.textContent = selectedDay;
  scheduleContainer.innerHTML = `
    <div class="loading">
      <h3>Loading schedule data...</h3>
      <p>Please wait while we fetch your class schedule from the database.</p>
    </div>`;

  ensureSessionInfo((sess, sem) => {
    if (!sess || !sem) {
      scheduleContainer.innerHTML = `<div class="error">Session info missing. Please login again.</div>`;
      return;
    }

    fetch(`/api/daily_schedule?day=${encodeURIComponent(selectedDay)}&session=${encodeURIComponent(sess)}&sem_No=${encodeURIComponent(sem)}`)
      .then(res => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then(data => {
        if (data.success && Array.isArray(data.schedule) && data.schedule.length > 0) {
          renderSchedule(data.schedule, selectedDay);
        } else {
          scheduleContainer.innerHTML = `<div class="no-classes">No classes scheduled for ${selectedDay}.</div>`;
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        scheduleContainer.innerHTML = `<div class="error">Error loading schedule. Try again later.</div>`;
      });
  });
}

function renderSchedule(schedule, day) {
  let html = `<div class="schedule-content active"><h2>${day} Schedule</h2>`;
  schedule.forEach(item => {
    html += `
      <div class="time-slot">
        <div class="time">${item.Start_Time} - ${item.End_Time}</div>
        <div class="subject">${item.Course_Code}</div>
        <div class="teacher">${item.Teacher_Short_Name}</div>
        <div class="room">${item.Class_Room}</div>
        <div class="session">${item.Session}</div>
      </div>
    `;
  });
  html += `</div>`;
  scheduleContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  createDayTabs();
  const today = days[new Date().getDay()];
  const todayBtn = [...document.querySelectorAll(".day-tab")].find(btn => btn.textContent === today);
  if (todayBtn) todayBtn.classList.add("active");
  loadScheduleData(today);
});
