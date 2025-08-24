// studentAssignmentPage.js
// ...existing code from student_assignment_front.js...

document.addEventListener("DOMContentLoaded", () => {
  const assignmentContainer = document.getElementById("assignmentContainer");

  // Get student session from sessionStorage
  const studentSession = sessionStorage.getItem("session");
  if (!studentSession) {
    assignmentContainer.innerHTML = "<p>Session not found. Please log in.</p>";
    return;
  }

  // Fetch assignments for this session only
  fetch(`/api/student_assignment?session=${encodeURIComponent(studentSession)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        assignmentContainer.innerHTML = `<p>Error loading assignments: ${data.message}</p>`;
        return;
      }

      if (data.assignments.length === 0) {
        assignmentContainer.innerHTML = "<p>No assignments for your session.</p>";
        return;
      }

      assignmentContainer.innerHTML = "";

      data.assignments.forEach(task => {
        const div = document.createElement("div");
        div.className = "task-card";

        const formattedDeadline = new Date(task.deadline);
        const yyyy = formattedDeadline.getFullYear();
        const mm = String(formattedDeadline.getMonth() + 1).padStart(2, "0");
        const dd = String(formattedDeadline.getDate()).padStart(2, "0");
        const deadlineStr = `${yyyy}-${mm}-${dd}`;

        div.innerHTML = `
          <h3>${task.course_name} (${task.course_code})</h3>
          <p><b>Teacher ID:</b> ${task.Teacher_Id}</p>
          <p><b>Session:</b> ${task.session}</p>
          <p><b>Topic:</b> ${task.topic}</p>
          <p><b>Deadline:</b> ${deadlineStr}</p>
          <div class="countdown" id="countdown-${task.id}">⏳ Calculating...</div>
        `;

        assignmentContainer.appendChild(div);

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
      });
    });
});
