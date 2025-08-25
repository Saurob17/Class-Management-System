// Public/Teacher_cource_front.js
if (window.location.pathname.endsWith('teachers_cources.html')) { 

  const teacherId = sessionStorage.getItem('teacherId');
  // console.log("📌 Teacher ID from session:", teacherId);
  
  const courseList = document.getElementById('teacherCourseList');
  const courseCountDiv = document.getElementById('courseCount');

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
        let total = 0;
        if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          total = data.courses.length;
          courseCountDiv.textContent = `Total Courses: ${total}`;
          data.courses.forEach(course => {
            const div = document.createElement('div');
            div.className = 'course-item';
            div.innerHTML = `
              <div class="course-name">${course.Course_Code || 'N/A'}</div>
              <div class="course-session">Session: ${course.Session || 'N/A'}</div>
              <div class="class-confirm">Class: ${course.Class_Confirmation || 'N/A'}</div>
              <button class="details-btn" data-course='${JSON.stringify(course)}'>for details</button>
            `;
            // Add click handler for details button
            div.querySelector('.details-btn').addEventListener('click', (e) => {
              const courseData = JSON.parse(e.target.getAttribute('data-course'));
              alert(`Course Details:\nCode: ${courseData.Course_Code}\nSession: ${courseData.Session}\nClass: ${courseData.Class_Confirmation || 'N/A'}`);
            });
            courseList.appendChild(div);
          });
        } else {
          courseCountDiv.textContent = 'Total Courses: 0';
          courseList.innerHTML = '<div>No courses found for you.</div>';
        }
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
        courseList.innerHTML = '<div>Error loading courses. Try again later.</div>';
      });
  }
}
