// attendance_front.js
// Handles teacher's course list and attendance view

function renderCourseList(courses, container) {
  container.innerHTML = '';
  if (courses.length === 0) {
    container.innerHTML = '<div>No courses found for you.</div>';
    return;
  }
  courses.forEach(course => {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-item';
    courseCard.innerHTML = `
      <div class="course-name">${course.Course_Code}</div>
      <div class="course-session">Session: ${course.Session}</div>
      <div class="class-confirm">Class: ${course.Class_Confirmation}</div>
      <button class="details-btn" data-course="${course.Course_Code}" data-session="${course.Session}">for details</button>
      <div class="attendance-details" style="display:none;"></div>
    `;
    courseCard.querySelector('.details-btn').addEventListener('click', async () => {
      const detailsDiv = courseCard.querySelector('.attendance-details');
      detailsDiv.style.display = 'block';
      detailsDiv.innerHTML = 'Loading attendance...';
      try {
        const res = await fetch(`/api/attendance?courseCode=${course.Course_Code}&session=${course.Session}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.attendance)) {
          detailsDiv.innerHTML = '<ul>' + data.attendance.map(a => `<li>${a.date}: ${a.status}</li>`).join('') + '</ul>';
        } else {
          detailsDiv.innerHTML = 'No attendance data found.';
        }
      } catch (err) {
        detailsDiv.innerHTML = 'Error loading attendance.';
      }
    });
    container.appendChild(courseCard);
  });
}
