document.addEventListener("DOMContentLoaded", () => {
  const assignmentContainer = document.getElementById("assignmentContainer");

  // Get student session from sessionStorage
  const studentSession = sessionStorage.getItem("session"); 
  if (!studentSession) {
    assignmentContainer.innerHTML = "<div class='no-assignments'>Session not found. Please log in.</div>";
    return;
  }

  // Fetch assignments for this session only
  fetch(`/api/student_assignment?session=${encodeURIComponent(studentSession)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        assignmentContainer.innerHTML = `<div class='no-assignments'>Error loading assignments: ${data.message}</div>`;
        return;
      }

      if (data.assignments.length === 0) {
        assignmentContainer.innerHTML = "<div class='no-assignments'>No assignments for your session.</div>";
        return;
      }

      // Grid container
      assignmentContainer.innerHTML = `<div class="assignments-grid"></div>`;
      const grid = assignmentContainer.querySelector(".assignments-grid");

      data.assignments.forEach(task => {
        const div = document.createElement("div");
        div.className = "assignment-card";

        const formattedDeadline = new Date(task.deadline);
        const yyyy = formattedDeadline.getFullYear();
        const mm = String(formattedDeadline.getMonth() + 1).padStart(2, "0");
        const dd = String(formattedDeadline.getDate()).padStart(2, "0");
        const deadlineStr = `${yyyy}-${mm}-${dd}`;

        div.innerHTML = `
          <div class="pill">${task.course_code}</div>
          <div class="course-name">${task.course_name}</div>
          <div class="topic">${task.topic}</div>
          <div class="row"><b>Teacher:</b> ${task.Teacher_Id}</div>
          <div class="row"><b>Session:</b> ${task.session}</div>
          <div class="row"><b>Deadline:</b> ${deadlineStr}</div>
          <div class="row countdown" id="countdown-${task.id}">⏳ Calculating...</div>
        `;

        grid.appendChild(div);

        // countdown function
        const countdownEl = div.querySelector(`#countdown-${task.id}`);
        const deadlineTime = new Date(task.deadline).getTime();

        function updateCountdown() {
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
        }

        updateCountdown();
        setInterval(updateCountdown, 60000);
      });
    })
    .catch(err => {
      assignmentContainer.innerHTML = "<div class='no-assignments'>Error fetching assignments.</div>";
      console.error(err);
    });
});
