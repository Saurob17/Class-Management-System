//   console.log("📌 sem_No from sessionStorage:", sem_No);
// student_cource_front.js
if (window.location.pathname.endsWith('batch_cource.html')) {
  // Get sem_No from sessionStorage
  const sem_No = sessionStorage.getItem('sem_No');
  console.log("📌 sem_No from sessionStorage:", sem_No);

  if (!sem_No) {
    document.getElementById('courseList').innerHTML = '<div>Semester info missing. Please login again.</div>';
    // return;
  } else {

      console.log("📌 sem_No from sessionStorage:", sem_No);
      fetch(`/api/batch_courses?sem_No=${sem_No}`)
        .then(res => res.json())
        .then(data => {
          console.log("📌 API response:", data);
          const courseList = document.getElementById('courseList');
          courseList.innerHTML = '';
          if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
            try {
              sessionStorage.setItem('myCourses', JSON.stringify(data.courses));
              console.log("✅ Saved to sessionStorage:", sessionStorage.getItem('myCourses'));
            } catch (e) {
              console.error("❌ sessionStorage error:", e);
            }
            data.courses.forEach(course => {
              const div = document.createElement('div');
              div.className = 'course-item';
              div.innerHTML = `
                <div class="course-name">${course.Course_Name}</div>
                <div class="course-code">${course.Course_Code}</div>
                <div class="course-sem">Semester: ${course.sem_No}</div>
              `;
              courseList.appendChild(div);
            });
          } else {
            courseList.innerHTML = '<div>No courses found.</div>';
          }
        })
        .catch(err => {
          console.error("❌ Fetch error:", err);
          document.getElementById('courseList').innerHTML = '<div>Error loading courses.</div>';
        });
  }
}
