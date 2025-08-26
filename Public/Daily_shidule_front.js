// daily_schedule_front.js

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayTabs = document.getElementById('dayTabs');
const scheduleContainer = document.getElementById('scheduleContainer');
const currentDayElem = document.getElementById('currentDay');

// batch/session info
const session = sessionStorage.getItem("session");
const sem_No = sessionStorage.getItem("sem_No");//sdfyusid


function createDayTabs() {
  dayTabs.innerHTML = '';
  days.forEach(day => {
    const btn = document.createElement('button');
    btn.className = 'day-tab';
    btn.textContent = day;
    btn.onclick = () => loadScheduleData(day);
    dayTabs.appendChild(btn);
  });
}

function loadScheduleData(selectedDay) {
  currentDayElem.textContent = selectedDay;
  scheduleContainer.innerHTML = `<div class="loading"><h3>Loading schedule data...</h3></div>`;
// console.log("Fetching schedule for:", selectedDay, session, sem_No);
  fetch(`/api/daily_schedule?day=${encodeURIComponent(selectedDay)}&session=${encodeURIComponent(session)}&sem_No=${encodeURIComponent(sem_No)}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && Array.isArray(data.schedule) && data.schedule.length > 0) {
        renderSchedule(data.schedule, selectedDay);
      } else {
        scheduleContainer.innerHTML = `<div class="no-classes">No classes scheduled for ${selectedDay}.</div>`;
      }
    })
    .catch(() => {
      scheduleContainer.innerHTML = `<div class="error">Error loading schedule. Try again later.</div>`;
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
  loadScheduleData(today);
});
