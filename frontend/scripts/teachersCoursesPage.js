// teachersCoursesPage.js
// ...existing code from teachers_cources.html (if any JS logic)...

document.addEventListener('DOMContentLoaded', () => {
  const teacherId = sessionStorage.getItem('teacherId');
  const courseList = document.getElementById('teacherCourseList');

  if (!courseList) return;

  if (!teacherId) {
    courseList.innerHTML = '<div>Please login first to view your courses.';
    return;
  }

  courseList.innerHTML = '<span class="spinner">⏳</span> Loading courses...';

  fetch(`/api/teacher_courses?teacherId=${teacherId}`)
    .then(res => res.json())
    .then(data => {
      courseList.innerHTML = '';
      if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
        data.courses.forEach(course => {
          const div = document.createElement('div');
          div.className = 'course-item';
          div.innerHTML = `
            <div class="course-name">${course.Course_Code}</div>
            <div class="course-session">Session: ${course.Session}</div>
            <div class="class-confirm">Class: ${course.Class_Confirmation}</div>
            <button class="details-btn" data-session="${course.Session}">for details</button>
            <div class="course-details" style="display:none;"></div>
          `;
          const detailsBtn = div.querySelector('.details-btn');
          const detailsDiv = div.querySelector('.course-details');
          detailsBtn.addEventListener('click', async () => {
            if (detailsDiv.style.display === 'block') {
              detailsDiv.style.display = 'none';
              return;
            }
            detailsDiv.style.display = 'block';
            detailsDiv.innerHTML = '<span class="spinner">⏳</span> Loading details...';
            try {
              // Example: fetch more details if endpoint exists
              const res = await fetch(`/api/course_details?courseCode=${course.Course_Code}`);
              const data = await res.json();
              if (data.success && data.details) {
                detailsDiv.innerHTML = `<pre>${JSON.stringify(data.details, null, 2)}</pre>`;
              } else {
                detailsDiv.innerHTML = 'No details found.';
              }
            } catch (err) {
              detailsDiv.innerHTML = 'Error loading details.';
            }
          });
          courseList.appendChild(div);
        });
      } else {
        courseList.innerHTML = '<div>No courses found for you.</div>';
      }
    })
    .catch(err => {
      console.error('Error loading courses:', err);
      courseList.innerHTML = '<div>Error loading courses. Try again later.</div>';
    });
});
