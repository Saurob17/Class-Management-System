// loginPage.js
// ...existing code from login.js...

async function handleTeacherLogin(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  try {
    const response = await fetch('/teacher_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData)
    });
    const data = await response.json();
    if (data.success) {
      sessionStorage.setItem('teacherId', data.teacherId);
      sessionStorage.setItem('teacherName', data.teacherName);
      window.location.href = data.redirect;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again.');
  }
}

async function handleStudentLogin(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  try {
    const response = await fetch('/batch_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData)
    });
    const data = await response.json();
    if (data.success) {
      sessionStorage.setItem('batchId', data.batchId);
      // Fetch session and sem_No using batchId and store in SessionStorage
      try {
        const batchInfoRes = await fetch(`/api/batch_info?id=${data.batchId}`);
        const batchInfo = await batchInfoRes.json();
        if (batchInfo.success) {
          sessionStorage.setItem('session', batchInfo.session);
          sessionStorage.setItem('sem_No', batchInfo.sem_No);
        }
      } catch (err) {
        console.error('Failed to fetch batch info:', err);
      }
      window.location.href = data.redirect;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Student login error:', error);
    alert('An error occurred during login. Please try again.');
  }
}

document.getElementById('teacherLoginForm').addEventListener('submit', handleTeacherLogin);

const studentLoginForm = document.getElementById('studentLoginForm');
if (studentLoginForm) {
  studentLoginForm.addEventListener('submit', handleStudentLogin);
}
