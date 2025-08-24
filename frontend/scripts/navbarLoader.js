// Reusable Navbar Loader
function loadNavbar() {
  fetch('/frontend/components/navbar.html')
    .then(response => response.text())
    .then(html => {
      document.body.insertAdjacentHTML('afterbegin', html);
    });
}

// Call loadNavbar on page load
window.addEventListener('DOMContentLoaded', loadNavbar);
