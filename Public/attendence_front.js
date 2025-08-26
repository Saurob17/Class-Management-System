// Public/Teacher_cource_front.js
if (window.location.pathname.endsWith('teachers_cources.html')) { 

  const teacherId = sessionStorage.getItem('teacherId');
  // console.log("📌 Teacher ID from session:", teacherId);
  
  const courseList = document.getElementById('teacherCourseList');

  if (!teacherId) {
    courseList.innerHTML = '<div>Please login first to view your courses.</div>';
  } else {
    // Fetch teacher courses from backend
    // console.log("📌 Fetching courses for teacher:", teacherId);

    fetch(`/api/teacher_courses?teacherId=${teacherId}`)
      .then(res => {
        if (!res.ok) throw new Error("❌ Network response was not ok");
        return res.json();
      })
      .then(data => {
        // console.log("📌 API Response:", data);
        courseList.innerHTML = '';

        if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          data.courses.forEach(course => {
            const div = document.createElement('div');
            div.className = 'course-item';
            div.innerHTML = `
              <div class="course-name">${course.Course_Code}</div>
              <div class="course-session">Session: ${course.Session}</div>
              <div class="class-confirm">Class: ${course.Class_Confirmation}</div>
              <button class="${course.Session}" >for details</button>
            `;
            courseList.appendChild(div);
          });
        } else {
          courseList.innerHTML = '<div>No courses found for you.</div>';
        }
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
        courseList.innerHTML = '<div>Error loading courses. Try again later.</div>';
      });
  }
}
