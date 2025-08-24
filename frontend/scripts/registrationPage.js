// registrationPage.js

document.getElementById('registrationForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const messageDiv = document.getElementById('registrationMessage');
  try {
  const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData)
    });
    const data = await response.json();
    if (response.ok) {
      // Store JWT token
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      messageDiv.textContent = 'Registration successful! You can now log in.';
      messageDiv.style.color = 'green';
      setTimeout(() => {
        window.location.href = '/pages/index.html';
      }, 1500);
    } else {
      messageDiv.textContent = data.error || data.message || 'Registration failed.';
      messageDiv.style.color = 'red';
    }
  } catch (error) {
    messageDiv.textContent = 'An error occurred. Please try again.';
    messageDiv.style.color = 'red';
  }
});
