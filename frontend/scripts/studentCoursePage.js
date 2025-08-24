// studentCoursePage.js
// ...existing code from student_cource_front.js...

document.addEventListener('DOMContentLoaded', () => {
  const sem_No = sessionStorage.getItem('sem_No');
  const courseList = document.getElementById('courseList');

  if (!courseList) return;

  if (!sem_No) {
    courseList.innerHTML = '<div>No semester selected. Please login/select batch first.</div>';
    return;
  }

  courseList.innerHTML = '<span class="spinner">⏳</span> Loading courses...';

  fetch(`/api/batch_courses?sem_No=${sem_No}`)
    .then(res => res.json())
    .then(data => {
      courseList.innerHTML = '';
      if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
        data.courses.forEach(course => {
          const div = document.createElement('div');
          div.className = 'course-item';
          div.innerHTML = `
            <strong>${course.Course_Code}</strong> - ${course.Course_Name} 
            (Semester: ${course.sem_No})
          `;
          courseList.appendChild(div);
        });
      } else {
        courseList.innerHTML = '<div>No courses found for this semester.</div>';
      }
    })
    .catch(err => {
      console.error('Error loading courses:', err);
      courseList.innerHTML = '<div>Error loading courses. Try again later.</div>';
    });
});
// ...existing code...
