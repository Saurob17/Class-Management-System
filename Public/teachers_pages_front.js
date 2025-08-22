  // Get teacher data from localStorage
      const teacherId = localStorage.getItem('teacherId');
      const teacherName = localStorage.getItem('teacherName');

      // Update welcome message with teacher name from sessionStorage
      document.addEventListener('DOMContentLoaded', function() {
        
        const teacherName = sessionStorage.getItem('teacherName');
        const welcomeHeader = document.querySelector('.welcome-section h1');
        if (teacherName && welcomeHeader) {
          welcomeHeader.textContent = `Welcome ${teacherName}`;
        } else if (welcomeHeader) {
          welcomeHeader.textContent = 'Good Morning, Teacher';
        }
      });
      
      // Add logout functionality
      document.querySelector('a[href="#"]:last-child').addEventListener('click', (e) => {
        e.preventDefault();
        // Clear teacher data from localStorage
        localStorage.removeItem('teacherId');
        localStorage.removeItem('teacherName');
        // Redirect to login page
        window.location.href = '/';
      });

document.addEventListener('DOMContentLoaded', function() {
  // sessionStorage থেকে teacherId নিন
  const teacherId = sessionStorage.getItem('teacherId');
  const totalCoursesCount = document.getElementById('totalCoursesCount');

  if (teacherId && totalCoursesCount) {
    fetch(`/api/teacher_courses?teacherId=${teacherId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.courses)) {
          totalCoursesCount.textContent = data.courses.length;
        } else {
          totalCoursesCount.textContent = '0';
        }
      })
      .catch(() => {
        totalCoursesCount.textContent = '0';
      });
  }
});
