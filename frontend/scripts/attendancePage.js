// attendancePage.js
// Handles teacher's course list and attendance view

document.addEventListener('DOMContentLoaded', () => {
  const courseListContainer = document.getElementById('teacherCourseList');
  const teacherId = sessionStorage.getItem('teacherId');

  if (!courseListContainer) return;

  if (!teacherId) {
    courseListContainer.innerHTML = '<div>Please login first to view your courses.</div>';
    return;
  }

  fetchTeacherCourses(teacherId)
    .then(courses => renderCourseList(courses, courseListContainer))
    .catch(error => {
      console.error('Error fetching courses:', error);
      courseListContainer.innerHTML = '<div>Error loading courses. Try again later.</div>';
    });
});

/**
 * Fetch teacher's courses from backend API
 * @param {string} teacherId
 * @returns {Promise<Array>} Array of course objects
 */
async function fetchTeacherCourses(teacherId) {
  const response = await fetch(`/api/teacher_courses?teacherId=${teacherId}`);
  if (!response.ok) throw new Error('Network response was not ok');
  const data = await response.json();
  if (data.success && Array.isArray(data.courses)) {
    return data.courses;
  }
  return [];
}

/**
 * Render the list of courses in the UI
 * @param {Array} courses
 * @param {HTMLElement} container
 */
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
    let detailsLoaded = false;
    const detailsBtn = courseCard.querySelector('.details-btn');
    const detailsDiv = courseCard.querySelector('.attendance-details');
    detailsBtn.addEventListener('click', async () => {
      if (detailsDiv.style.display === 'block') {
        detailsDiv.style.display = 'none';
        return;
      }
      detailsDiv.style.display = 'block';
      detailsDiv.innerHTML = '<span class="spinner">⏳</span> Loading attendance...';
      if (!detailsLoaded) {
        try {
          const res = await fetch(`/api/attendance?courseCode=${course.Course_Code}&session=${course.Session}`);
          const data = await res.json();
          if (data.success && Array.isArray(data.attendance)) {
            if (data.attendance.length === 0) {
              detailsDiv.innerHTML = 'No attendance data found.';
            } else {
              detailsDiv.innerHTML = '<ul>' + data.attendance.map(a => `<li>${a.date}: ${a.status}</li>`).join('') + '</ul>';
            }
          } else {
            detailsDiv.innerHTML = 'No attendance data found.';
          }
        } catch (err) {
          detailsDiv.innerHTML = 'Error loading attendance.';
        }
        detailsLoaded = true;
      }
    });
    container.appendChild(courseCard);
  });
}
