// ...existing code...
if (window.location.pathname.endsWith('teachers_cources.html')) { // <-- fixed typo

  const teacherId = sessionStorage.getItem('teacherId');
  console.log("📌 Teachers_cources_backend.js loaded22", teacherId);
  
  const courseList = document.getElementById('teacherCourseList');

  if (!teacherId) {
 
    courseList.innerHTML = '<div>Please login first to view your courses.</div>';
  } else {
    // Fetch teacher courses from backend
   console.log("📌 Teachers_cources_backend.js loaded99", teacherId);
    fetch(`/api/teacher_courses?teacherId=${teacherId}`)
    
      .then(res => res.json())
      .then(data => {
  
          console.log("📌 API Response:", data);
        courseList.innerHTML = '';

        if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          data.courses.forEach(course => {
            const div = document.createElement('div'); // <-- fixed variable name
            div.className = 'course-item';
            div.innerHTML = `
              <div class="course-name">${course.Course_Code}</div>
              <div class="course-session">Session: ${course.Session}</div>
              <div class="class-confirm">Class: ${course.Class_Confirmation}</div>
            `;
            courseList.appendChild(div);
          });
        } else {
          courseList.innerHTML = '<div>No courses found for you.</div>';
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        console.log(err);
        courseList.innerHTML = '<div>Error loading courses. Try again later.</div>';
      });
  }
}
// ...existing code...