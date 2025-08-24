// attendancePage.js
// Handles teacher's course list and attendance view

// ...existing code from attendence_front.js...

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
      <button class="details-btn" data-session="${course.Session}">for details</button>
    `;
    // Add event listener for details button if needed

    // Integrate backend attendance API
    courseCard.querySelector('.details-btn').addEventListener('click', () => {
      showAttendanceDetails(course.Session, courseCard);
    });
    container.appendChild(courseCard);
  });
}

/**
 * Fetch attendance for a course/session from backend
 * @param {string} session
 * @returns {Promise<Array>} Array of attendance records
 */
async function fetchAttendance(session) {
  const response = await fetch(`/api/attendance?session=${encodeURIComponent(session)}`);
  if (!response.ok) throw new Error('Failed to fetch attendance');
  return await response.json();
}

/**
 * Show attendance details below the course card
 * @param {string} session
 * @param {HTMLElement} courseCard
 */
function showAttendanceDetails(session, courseCard) {
  // Remove previous details if any
  const prevDetails = courseCard.querySelector('.attendance-details');
  if (prevDetails) prevDetails.remove();
  fetchAttendance(session)
    .then(attendanceRecords => {
      let detailsHtml = '<div class="attendance-details"><h4>Attendance</h4><ul>';
      attendanceRecords.forEach(record => {
        detailsHtml += `<li>${record.studentId}: ${record.status} (${record.date})</li>`;
      });
      detailsHtml += '</ul></div>';
      courseCard.insertAdjacentHTML('beforeend', detailsHtml);
    })
    .catch(err => {
      courseCard.insertAdjacentHTML('beforeend', '<div class="attendance-details">Error loading attendance.</div>');
    });
}
