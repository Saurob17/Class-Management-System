
const teacher_Id = sessionStorage.getItem("teacherId");
//console.log("Teacher ID from sessionStorage:", teacherId);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  const taskList = document.getElementById("tasksList");

  // Load assignments
const teacher_Id = sessionStorage.getItem("teacherId");

fetch(`/api/assignments?teacherId=${teacher_Id}`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // Only show assignments where Teacher_Id matches logged-in teacher
      data.assignments
        .filter(task => task.Teacher_Id == teacher_Id)
        .forEach(addTaskToUI);
    }
  });

  // Form submit → Add new assignment
form.addEventListener("submit", e => {
  e.preventDefault();

  const Teacher_Id = document.getElementById("teacherId").value;
  const course_code = document.getElementById("courseCode").value;
  const course_name = document.getElementById("courseName").value;
  const deadline = document.getElementById("deadline").value;
  console.log("Deadline", deadline);
  const session = document.getElementById("session").value;
  const topic = document.getElementById("topic").value;

  console.log("Adding assignment:", { Teacher_Id, course_code, course_name, deadline, session, topic });
  fetch("/api/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Teacher_Id, course_code, course_name, deadline, session, topic })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        addTaskToUI({ id: data.id, Teacher_Id, course_code, course_name, deadline, session, topic });
        form.reset();
      }
    });
});

  // Add Assignment to UI
  function addTaskToUI(task) {

    console.log("Adding task to UI:", task);
    const div = document.createElement("div");
    div.className = "task-card";
    // ...existing code...
  div.innerHTML = `
    <h3>${task.course_name} (${task.course_code})</h3>
    <p><b>Teacher ID:</b> ${task.Teacher_Id}</p>
    <p><b>Session:</b> ${task.session}</p>
    <p><b>Topic:</b> ${task.topic}</p>
    <p><b>Deadline:</b> ${new Date(task.deadline).toLocaleString()}</p>
    <button class="deleteBtn">❌ Delete</button>
    <div class="countdown" id="countdown-${task.id}">⏳ Calculating...</div>
  `;
  // ...existing code...


  //delete button
  div.querySelector(".deleteBtn").addEventListener("click", () => {
    fetch("/api/assignments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_code: task.course_code,
        session: task.session,
        deadline: task.deadline
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          div.remove();
        }
      });
  });
          

// ...existing code...

    taskList.appendChild(div);

    // countdown update
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
    }, 60000); // প্রতি মিনিটে updateTopic: // teacher_assignment.js let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Render tasks function renderTasks() { const taskList = document.getElementById("taskList"); taskList.innerHTML = ""; tasks.forEach((task, index) => { const card = document.createElement("div"); card.className = "task-card"; const info = document.createElement("div"); info.className = "task-info"; const title = document.createElement("div"); title.className = "task-title"; title.textContent = task.title; const deadline = document.createElement("div"); deadline.className = "task-deadline"; deadline.textContent = "Deadline: " + new Date(task.deadline).toLocaleString(); info.appendChild(title); info.appendChild(deadline); const countdown = document.createElement("div"); countdown.className = "countdown"; countdown.setAttribute("data-deadline", task.deadline); const delBtn = document.createElement("button"); delBtn.className = "delete-btn"; delBtn.textContent = "Delete"; delBtn.onclick = () => deleteTask(index); card.appendChild(info); card.appendChild(countdown); card.appendChild(delBtn);


  }
});
