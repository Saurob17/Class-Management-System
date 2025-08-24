// nextClassPage.js
// ...existing code from next_class_front.js...

function loadNextClass() {
  // Get session and sem_No from sessionStorage
  const session = sessionStorage.getItem("session"); // e.g., "2020-2021"
  const sem_No = sessionStorage.getItem("sem_No");   // e.g., "8"

  // Determine current day name
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const todayIndex = new Date().getDay();
  const currentDay = days[todayIndex];

  // Current time in HH:MM:SS format
  const now = new Date();
  const currentTime = now.toTimeString().split(" ")[0];

  // Call backend API with query params
  fetch(`/api/next_class?session=${encodeURIComponent(session)}&sem_No=${encodeURIComponent(sem_No)}&day=${encodeURIComponent(currentDay)}&currentTime=${encodeURIComponent(currentTime)}`)
    .then(res => res.json())
    .then(data => {
      const timeElem = document.getElementById('nextClassTime');
      const infoElem = document.getElementById('nextClassInfo');

      if (data.success && data.nextClass) {
        timeElem.textContent = `${data.nextClass.Start_Time} - ${data.nextClass.End_Time}`;
        infoElem.textContent = `${data.nextClass.Course_Code} (${data.nextClass.Class_Room}) - ${data.nextClass.Teacher_Short_Name || data.nextClass.teacher_name || 'Unknown'}`;
      } else {
        timeElem.textContent = "—";
        infoElem.textContent = data.message || "No upcoming class";
      }
    })
    .catch(err => {
      console.error("Error fetching next class:", err);
      document.getElementById('nextClassTime').textContent = "—";
      document.getElementById('nextClassInfo').textContent = "Error fetching class";
    });
}

// Load next class on page load
document.addEventListener('DOMContentLoaded', loadNextClass);

// Refresh every 30 seconds
setInterval(loadNextClass, 30000);
// ...existing code...
