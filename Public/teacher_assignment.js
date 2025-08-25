document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  const taskList = document.getElementById("tasksList");

  // Defensive checks for missing elements
  if (!form) {
    console.warn('taskForm element not found. Assignment form features will not work.');
    return;
  }
  if (!taskList) {
    console.warn('tasksList element not found. Assignment list features will not work.');
    return;
  }

  // sessionStorage থেকে teacherId
  const teacherId = sessionStorage.getItem("teacherId");

  // Load assignments for this teacher only
  fetch(`/api/assignments?teacherId=${teacherId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        data.assignments.forEach(addTaskToUI);
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

    // console.log("deadline sent to backend:", deadline);
    // Teacher_Id sessionStorage থেকে নেওয়া
    const Teacher_Id = teacherId;

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

  // Add Assignment to UI (existing addTaskToUI function)
  function addTaskToUI(task) {
    const div = document.createElement("div");
    div.className = "task-card";
    const formattedDeadline = new Date(task.deadline);
    const yyyy = formattedDeadline.getFullYear();
    const mm = String(formattedDeadline.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const dd = String(formattedDeadline.getDate()).padStart(2, '0');
    const deadline = `${yyyy}-${mm}-${dd}`;
    // console.log("formattedDeadline in frontend:", deadline);

    div.innerHTML = `
      <h3>${task.course_name} (${task.course_code})</h3>
      <p><b>Teacher ID:</b> ${task.Teacher_Id}</p>
      <p><b>Session:</b> ${task.session}</p>
      <p><b>Topic:</b> ${task.topic}</p>
      <p><b>Deadline:</b> ${deadline}</p>
      <button class="deleteBtn">❌ Delete</button>
      <div class="countdown" id="countdown-${task.id}">⏳ Calculating...</div>
    `;
    // console.log("task in frontend:", task);
    // console.log("formattedDeadline in frontend:", deadline);
    // Delete
    div.querySelector(".deleteBtn").addEventListener("click", () => {
      fetch(`/api/assignments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_code: task.course_code,
          session: task.session,
          // deadline: formattedDeadline
        })
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
