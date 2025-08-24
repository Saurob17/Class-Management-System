// teacherAssignmentPage.js
// ...existing code from teacher_assignment.js...

const API_BASE_URL = '/api/assignments';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  const taskList = document.getElementById("tasksList");
  const teacherId = sessionStorage.getItem("teacherId");

  // Load assignments for this teacher only
  fetch(`${API_BASE_URL}?teacherId=${teacherId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && Array.isArray(data.assignments)) {
        data.assignments.forEach(addTaskToUI);
      } else {
        taskList.innerHTML = '<div>No assignments found.</div>';
      }
    })
    .catch(() => {
      taskList.innerHTML = '<div>Error loading assignments.</div>';
    });

  // Form submit → Add new assignment
  if (form) {
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
          if (data.success && data.id) {
            addTaskToUI({ id: data.id, Teacher_Id, course_code, course_name, deadline, session, topic });
            form.reset();
          } else {
            alert('Failed to add assignment.');
          }
        })
        .catch(() => {
          alert('Error adding assignment.');
        });
    });
  }

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
        })
        .catch(() => {
          alert('Error deleting assignment.');
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
