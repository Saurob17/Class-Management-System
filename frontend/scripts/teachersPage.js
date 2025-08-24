// teachersPage.js
// ...existing code from teachers_pages_front.js...

document.addEventListener('DOMContentLoaded', () => {
  // Dashboard stats
  const teacherId = sessionStorage.getItem('teacherId');
  const totalCoursesCount = document.getElementById('totalCoursesCount');

  // Fetch total courses for teacher
  fetch(`/api/teacher_courses?teacherId=${teacherId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && Array.isArray(data.courses)) {
        totalCoursesCount.textContent = data.courses.length;
      } else {
        totalCoursesCount.textContent = '0';
      }
    })
    .catch(() => {
      totalCoursesCount.textContent = '0';
    });

  // Assignment popup logic
  const createAssignmentBtn = document.getElementById('createAssignmentBtn');
  const assignmentPopup = document.getElementById('assignmentPopup');
  const overlay = document.getElementById('overlay');
  const closePopup = document.getElementById('closePopup');
  const submitAssignment = document.getElementById('submitAssignment');

  if (createAssignmentBtn && assignmentPopup && overlay) {
    createAssignmentBtn.addEventListener('click', (e) => {
      e.preventDefault();
      assignmentPopup.style.display = 'block';
      overlay.style.display = 'block';
    });
    closePopup.addEventListener('click', () => {
      assignmentPopup.style.display = 'none';
      overlay.style.display = 'none';
    });
    overlay.addEventListener('click', () => {
      assignmentPopup.style.display = 'none';
      overlay.style.display = 'none';
    });
  }

  // Submit assignment to backend
  if (submitAssignment) {
    submitAssignment.addEventListener('click', async () => {
      const course_code = document.getElementById('assignCourseCode').value;
      const course_name = document.getElementById('assignCourseName').value;
      const deadline = document.getElementById('assignDeadline').value;
      const session = document.getElementById('assignSession').value;
      const topic = document.getElementById('assignTopic').value;
      if (!course_code || !course_name || !deadline || !session || !topic) {
        alert('Please fill all fields.');
        return;
      }
      try {
        const res = await fetch('/api/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Teacher_Id: teacherId, course_code, course_name, deadline, session, topic })
        });
        const data = await res.json();
        if (data.success) {
          alert('Assignment created successfully!');
          assignmentPopup.style.display = 'none';
          overlay.style.display = 'none';
        } else {
          alert('Failed to create assignment.');
        }
      } catch (err) {
        alert('Error creating assignment.');
      }
    });
  }
});
