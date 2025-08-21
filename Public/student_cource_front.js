// student_cource_front.js
if (window.location.pathname.endsWith('batch_cource.html')) {
  const sem_No = sessionStorage.getItem('sem_No');
  console.log("📌 sem_No from sessionStorage:", sem_No);

  const courseList = document.getElementById('courseList');

  if (!sem_No) {
    console.error("❌ No sem_No found in sessionStorage!");
    courseList.innerHTML = '<div>No semester selected. Please login/select batch first.</div>';
  } 
  
  else {

    console.log("📌 Fetching courses for semester:", sem_No);

    fetch(`/api/batch_courses?sem_No=${sem_No}`)
      .then(res => res.json())
      .then(data => {
        console.log("📌 API Response:", data);
        courseList.innerHTML = ''; // Clear old content

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
        console.error("❌ Fetch error:", err);
        courseList.innerHTML = '<div>Error loading courses. Try again later.</div>';
      });
  }
}
