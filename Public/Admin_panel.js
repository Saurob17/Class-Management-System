// Modal logic
const modal = document.getElementById("crudModal");
const modalContent = document.getElementById("modalContent");

function openModal(html) {
  modalContent.innerHTML = html;
  modal.style.display = "flex";

  const cancelBtn = modalContent.querySelector(".cancelBtn");
  if(cancelBtn) cancelBtn.addEventListener("click", closeModal);
}

function closeModal() {
  modal.style.display = "none";
  modalContent.innerHTML = "";
}

modal.addEventListener("click", e => {
  if(e.target === modal) closeModal();
});

// ------------------
// Navigation logic
const sections = document.querySelectorAll(".admin-section");
const navLinks = document.querySelectorAll(".admin-nav a");

function showSection(id) {
  sections.forEach(sec => sec.style.display = "none");
  const section = document.getElementById(id);
  if(section) section.style.display = "block";
}

// Initially show dashboard
showSection("dashboard");

// Nav click
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.getAttribute("href").replace("#","");
    if(target) showSection(target);
  });
});

// Logout
document.getElementById("adminLogoutBtn").addEventListener("click", e => {
  e.preventDefault();
  sessionStorage.removeItem("adminId");
  window.location.href = "Login_page.html";
});

// ------------------
// Add Teacher Modal
document.getElementById("addTeacherBtn").addEventListener("click", () => {
  const html = `
    <h2>Add Teacher</h2>
    <form id="teacherForm">
      <label>Teacher Name:</label><input type="text" name="teacher_name" required>
      <label>Password:</label><input type="password" name="password" required>
      <div>
        <button type="submit" class="saveBtn">Save</button>
        <button type="button" class="cancelBtn">Cancel</button>
      </div>
    </form>
  `;
  openModal(html);

  const form = document.getElementById("teacherForm");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch('/api/teachers', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
    });
    const result = await res.json();
    if(result.success) alert("Teacher added!");
    else alert(result.message || "Error");
    closeModal();
  });
});

// ------------------
// Add Student Modal
document.getElementById("addStudentBtn").addEventListener("click", () => {
  const html = `
    <h2>Add Student</h2>
    <form id="studentForm">
      <label>Roll:</label><input type="text" name="Roll" required>
      <label>Name:</label><input type="text" name="Student_Name" required>
      <label>Registration:</label><input type="text" name="Registration" required>
      <label>Semester No:</label><input type="number" name="sem_No" required>
      <label>Session:</label><input type="text" name="Session" required>
      <div>
        <button type="submit" class="saveBtn">Save</button>
        <button type="button" class="cancelBtn">Cancel</button>
      </div>
    </form>
  `;
  openModal(html);

  const form = document.getElementById("studentForm");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch('/api/students', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
    });
    const result = await res.json();
    if(result.success) alert("Student added!");
    else alert(result.message || "Error");
    closeModal();
  });
});

// ------------------
// Add Course Modal
document.getElementById("addCourseBtn").addEventListener("click", () => {
  const html = `
    <h2>Add Course</h2>
    <form id="courseForm">
      <label>Course Code:</label><input type="text" name="Course_Code" required>
      <label>Course Name:</label><input type="text" name="Course_Name" required>
      <label>Semester No:</label><input type="number" name="sem_No" required>
      <div>
        <button type="submit" class="saveBtn">Save</button>
        <button type="button" class="cancelBtn">Cancel</button>
      </div>
    </form>
  `;
  openModal(html);

  const form = document.getElementById("courseForm");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch('/api/courses', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
    });
    const result = await res.json();
    if(result.success) alert("Course added!");
    else alert(result.message || "Error");
    closeModal();
  });
});

// ------------------
// Add Teacher-Course Modal
document.getElementById("addTeacherCourseBtn").addEventListener("click", () => {
  const html = `
    <h2>Assign Teacher to Course</h2>
    <form id="teacherCourseForm">
      <label>Teacher ID:</label><input type="number" name="Teacher_Id" required>
      <label>Course Code:</label><input type="text" name="Course_Code" required>
      <label>Session:</label><input type="text" name="Session" required>
      <div>
        <button type="submit" class="saveBtn">Save</button>
        <button type="button" class="cancelBtn">Cancel</button>
      </div>
    </form>
  `;
  openModal(html);

  const form = document.getElementById("teacherCourseForm");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch('/api/teacher_courses', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)
    });
    const result = await res.json();
    if(result.success) alert("Teacher-Course assigned!");
    else alert(result.message || "Error");
    closeModal();
  });
});

// ------------------
// Add Daily Schedule Modal
document.getElementById("addScheduleBtn").addEventListener("click", () => {
  const html = `
    <h2>Add Daily Schedule</h2>
    <form id="scheduleForm">
      <label>Day:</label><input type="text" name="Day" required>
      <label>Course Code:</label><input type="text" name="Course_Code" required>
      <label>Session:</label><input type="text" name="Session" required>
      <label>Class Room:</label><input type="text" name="Class_Room" required>
      <label>Teacher Short Name:</label><input type="text" name="Teacher_Short_Name" required>
      <label>Start Time:</label><input type="time" name="Start_Time">
      <label>End Time:</label><input type="time" name="End_Time">
      <label>Semester No:</label><input type="number" name="sem_No">
      <label>Teacher ID:</label><input type="number" name="Teacher_Id">
      <div>
        <button type="submit" class="saveBtn">Save</button>
        <button type="button" class="cancelBtn">Cancel</button>
      </div>
    </form>
  `;
  openModal(html);

  const form = document.getElementById("scheduleForm");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch('/api/daily_schedule', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)
    });
    const result = await res.json();
    if(result.success) alert("Schedule added!");
    else alert(result.message || "Error");
    closeModal();
  });
});