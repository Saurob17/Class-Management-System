// ...existing code...

submitBtn.addEventListener('click', () => {
  const teacherId = sessionStorage.getItem('teacherId'); // Get teacherId from session
  const courseCode = document.getElementById('assignCourseCode').value.trim();
  const courseName = document.getElementById('assignCourseName').value.trim();
  const deadline = document.getElementById('assignDeadline').value;
  const session = document.getElementById('assignSession').value.trim();
  const topic = document.getElementById('assignTopic').value.trim();

  if (!teacherId || !courseCode || !courseName || !deadline || !session || !topic) {
    alert("All fields are required!");
    return;
  }

  // Create object
  const newAssignment = { teacherId, courseCode, courseName, deadline, session, topic };

  // Send to backend
  fetch('/api/teacher_assignment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAssignment)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Assignment submitted successfully!");
      // Clear form
      document.getElementById('assignCourseCode').value = '';
      document.getElementById('assignCourseName').value = '';
      document.getElementById('assignDeadline').value = '';
      document.getElementById('assignSession').value = '';
      document.getElementById('assignTopic').value = '';
      popup.style.display = 'none';
      overlay.style.display = 'none';
    } else {
      alert("Failed to submit assignment: " + data.message);
    }
  })
  .catch(() => {
    alert("Error submitting assignment.");
  });
});

// Remove local assignments array and localStorage code