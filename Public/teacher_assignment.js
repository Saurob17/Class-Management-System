document.addEventListener("DOMContentLoaded", () => {
  // Get teacherId from sessionStorage
  const teacherId = sessionStorage.getItem("teacherId");
  if (!teacherId) {
    window.location.href = "Login_page.html";
    return;
  }

  // Create a container for assignment list
  let taskList = document.getElementById("tasksList");
  if (!taskList) {
    taskList = document.createElement("div");
    taskList.id = "tasksList";
    document.body.appendChild(taskList); // Append at end, you can adjust
  }

  // Popup and overlay
  const popup = document.getElementById("assignmentPopup");
  const overlay = document.getElementById("overlay");

  // Open popup
  const openPopupBtns = document.querySelectorAll(".quick-action-btn");
  openPopupBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      // Only open popup for "Create Assignment"
      if (btn.textContent.includes("Create Assignment")) {
        popup.style.display = "block";
        overlay.style.display = "block";
      }
    });
  });

  // Close popup
  const closePopupBtn = document.getElementById("closePopup");
  closePopupBtn.addEventListener("click", () => {
    popup.style.display = "none";
    overlay.style.display = "none";
  });

  // Fetch existing assignments
  fetch(`/api/assignments?teacherId=${teacherId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && Array.isArray(data.assignments)) {
        data.assignments.forEach(addTaskToUI);
      }
    })
    .catch(err => console.error("Error fetching assignments:", err));

  // Form submit
  const form = popup.querySelector("form");
  form.addEventListener("submit", e => {
    e.preventDefault();

    const course_code = document.getElementById("assignCourseCode").value.trim();
    const course_name = document.getElementById("assignCourseName").value.trim();
    const deadline = document.getElementById("assignDeadline").value;
    const session = document.getElementById("assignSession").value.trim();
    const topic = document.getElementById("assignTopic").value.trim();

    if (!course_code || !course_name || !deadline || !session || !topic) {
      alert("All fields are required!");
      return;
    }

    const payload = { Teacher_Id: teacherId, course_code, course_name, deadline, session, topic };

    fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          addTaskToUI({ id: data.id, ...payload });
          form.reset();
          popup.style.display = "none";
          overlay.style.display = "none";
        } else {
          alert(data.message || "Failed to add assignment.");
        }
      })
      .catch(err => console.error("Error adding assignment:", err));
  });

  // Add assignment to UI
  function addTaskToUI(task) {
    const div = document.createElement("div");
    div.className = "task-card";
    const deadlineDate = new Date(task.deadline);
    const yyyy = deadlineDate.getFullYear();
    const mm = String(deadlineDate.getMonth() + 1).padStart(2, "0");
    const dd = String(deadlineDate.getDate()).padStart(2, "0");
    const formattedDeadline = `${yyyy}-${mm}-${dd}`;

    div.innerHTML = `
      <h3>${task.course_name} (${task.course_code})</h3>
      <p><b>Teacher ID:</b> ${task.Teacher_Id}</p>
      <p><b>Session:</b> ${task.session}</p>
      <p><b>Topic:</b> ${task.topic}</p>
      <p><b>Deadline:</b> ${formattedDeadline}</p>
      <button class="deleteBtn">❌ Delete</button>
      <div class="countdown" id="countdown-${task.id}">⏳ Calculating...</div>
    `;

    // Delete button
    div.querySelector(".deleteBtn").addEventListener("click", () => {
      fetch("/api/assignments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_code: task.course_code, session: task.session })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            div.remove();
          } else {
            alert("Delete failed: " + (data.message || ""));
          }
        })
        .catch(err => console.error("Error deleting assignment:", err));
    });

    taskList.appendChild(div);

    // Countdown timer
    const countdownEl = div.querySelector(`#countdown-${task.id}`);
    const deadlineTime = new Date(task.deadline).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadlineTime - now;
      if (distance <= 0) {
        countdownEl.innerText = "⏰ Deadline Passed!";
        clearInterval(interval);
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      countdownEl.innerText = `⏳ ${days}d ${hours}h ${minutes}m left`;
    }, 60000);
    // Update immediately
    countdownEl.innerText = (() => {
      const now = new Date().getTime();
      const distance = deadlineTime - now;
      if (distance <= 0) return "⏰ Deadline Passed!";
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      return `⏳ ${days}d ${hours}h ${minutes}m left`;
    })();
  }
});
