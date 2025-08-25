// ========== CONFIG ==========
const scheduleContainer = document.getElementById("scheduleContainer");
const currentDayElem = document.getElementById("currentDay");
const dayTabsElem = document.getElementById("dayTabs");
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Default session & semester (if not in localStorage yet)
function initSessionInfo() {
  if (!localStorage.getItem("session")) {
    localStorage.setItem("session", "2023-2024"); 
  }
  if (!localStorage.getItem("sem_No")) {
    localStorage.setItem("sem_No", "3"); 
  }
}
function getSessionInfo() {
  const session = sessionStorage.getItem("session");
  const sem_No = sessionStorage.getItem("sem_No");

  if (!session || !sem_No) {
    // If missing, force login
    window.location.href = "/login.html";
    return null;
  }

  return { session, sem_No };
}


// Auto-detect today
let selectedDay = days[new Date().getDay()];

// ========== RENDER TABS ==========
function renderDayTabs() {
  dayTabsElem.innerHTML = "";
  days.forEach(day => {
    const btn = document.createElement("button");
    btn.className = "day-tab" + (day === selectedDay ? " active" : "");
    btn.textContent = day;
    btn.addEventListener("click", () => {
      selectedDay = day;
      document.querySelectorAll(".day-tab").forEach(tab => tab.classList.remove("active"));
      btn.classList.add("active");
      loadScheduleData(day);
    });
    dayTabsElem.appendChild(btn);
  });
}

// ========== FETCH & DISPLAY ==========
function loadScheduleData(day) {
  const sessionInfo = getSessionInfo();
  if (!sessionInfo) return; // prevent crash if redirected

  const { session, sem_No } = sessionInfo;
  currentDayElem.textContent = day;

  scheduleContainer.innerHTML = `
    <div class="loading">
      <h3>Loading schedule data...</h3>
      <p>Please wait while we fetch your class schedule from the database.</p>
    </div>
  `;

  fetch(`/api/daily_schedule?day=${encodeURIComponent(day)}&session=${encodeURIComponent(session)}&sem_No=${encodeURIComponent(sem_No)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        scheduleContainer.innerHTML = `<div class="error">${data.message}</div>`;
        return;
      }
      if (data.schedule.length === 0) {
        scheduleContainer.innerHTML = `<div class="no-classes">No classes today 🎉</div>`;
        return;
      }

      scheduleContainer.innerHTML = "";
      const content = document.createElement("div");
      content.className = "schedule-content active";

      data.schedule.forEach(item => {
        const slot = document.createElement("div");
        slot.className = "time-slot";

        if (item.Course_Code.toLowerCase().includes("break")) slot.classList.add("break-slot");
        if (item.Course_Code.toLowerCase().includes("lunch")) slot.classList.add("lunch-slot");

        slot.innerHTML = `
          <div class="time">${item.Start_Time} - ${item.End_Time}</div>
          <div class="subject">${item.Course_Code}</div>
          <div class="teacher">${item.Teacher_Short_Name}</div>
          <div class="room">${item.Class_Room}</div>
        `;
        content.appendChild(slot);
      });

      scheduleContainer.appendChild(content);
    })
    .catch(err => {
      console.error("Error fetching schedule:", err);
      scheduleContainer.innerHTML = `<div class="error">Failed to load schedule.</div>`;
    });
}

// ========== INIT ==========
initSessionInfo();
renderDayTabs();
loadScheduleData(selectedDay);