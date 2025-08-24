
const API_BASE_URL = 'http://localhost:3000/api/assignments';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  const taskList = document.getElementById("tasksList");
  const teacherId = sessionStorage.getItem("teacherId");

  // Load assignments for this teacher only
  fetch(`${API_BASE_URL}?teacherId=${teacherId}`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        data.forEach(addTaskToUI);
      }
    });

  // Form submit → Add new assignment
  form.addEventListener("submit", e => {
    e.preventDefault();
    const course_code = document.getElementById("courseCode").value;
    const course_name = document.getElementById("courseName").value;
    const deadline = document.getElementById("deadline").value;
    const session = document.getElementById("session").value;
    const topic = document.getElementById("topic").value;
    const Teacher_Id = teacherId;

    fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Teacher_Id, course_code, course_name, deadline, session, topic })
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          addTaskToUI({ id: data.id, Teacher_Id, course_code, course_name, deadline, session, topic });
          form.reset();
        }
      });
  });

  // Add Assignment to UI
  function addTaskToUI(task) {
    const div = document.createElement("div");
    div.className = "task-card";
    const formattedDeadline = new Date(task.deadline);
    const yyyy = formattedDeadline.getFullYear();
    const mm = String(formattedDeadline.getMonth() + 1).padStart(2, '0');
    const dd = String(formattedDeadline.getDate()).padStart(2, '0');
    const deadline = `${yyyy}-${mm}-${dd}`;

    div.innerHTML = `
      <h3>${task.course_name} (${task.course_code})</h3>
      <p><b>Teacher ID:</b> ${task.Teacher_Id}</p>
      <p><b>Session:</b> ${task.session}</p>
      <p><b>Topic:</b> ${task.topic}</p>
      <p><b>Deadline:</b> ${deadline}</p>
      <button class="deleteBtn">❌ Delete</button>
      <div class="countdown" id="countdown-${task.id}">⏳ Calculating...</div>
    `;

    div.querySelector(".deleteBtn").addEventListener("click", () => {
      fetch(`${API_BASE_URL}/${task.id}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            div.remove();
          } else {
            alert("Delete failed: " + data.message);
          }
        });
    });

    taskList.appendChild(div);

    // countdown
    const countdownEl = div.querySelector(`#countdown-${task.id}`);
    const deadlineTime = new Date(task.deadline).getTime();
    setInterval(() => {
      const now = new Date().getTime();
      const distance = deadlineTime - now;

      if (distance <= 0) {
        countdownEl.innerText = "⏰ Deadline Passed!";
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      countdownEl.innerText = `⏳ ${days}d ${hours}h ${minutes}m left`;
    }, 60000);
  }
});
