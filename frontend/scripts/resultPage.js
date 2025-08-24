// resultPage.js
// =======================
// Student Result Frontend
// =======================

// Batch, Semester, Session info from sessionStorage
const batchId = sessionStorage.getItem('batchId');
let semester = sessionStorage.getItem('sem_No');
let session = sessionStorage.getItem('session');

// DOM elements
const internalResultBody = document.getElementById('internalResultBody');
const subjectSelect = document.getElementById('subjectSelect');

// =======================
// Fetch Batch Info
// =======================
async function getBatchInfo() {
  if (!batchId) return;
  try {
    const res = await fetch(`/api/batch_info?id=${batchId}`);
    const data = await res.json();
    if (data.success) {
      semester = semester || data.sem_No;
      session = session || data.session;
      sessionStorage.setItem('sem_No', semester);
      sessionStorage.setItem('session', session);
    }
  } catch (err) {
    console.error("❌ Batch info fetch failed:", err);
  }
}

// =======================
// Fetch Courses
// =======================
async function fetchCourses() {
  if (!semester) return [];
  try {
    const res = await fetch(`/api/courses?sem_No=${semester}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.courses)) return [];
    return data.courses;
  } catch (err) {
    console.error("❌ Courses fetch failed:", err);
    return [];
  }
}

// =======================
// Fetch Internal Marks
// =======================
async function fetchMarks(courseCode) {
  if (!session) return [];
  try {
    const res = await fetch(`/api/internal_marks?courseCode=${courseCode}&session=${session}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.marks)) {
      return [];
    }
    return data.marks;
  } catch (err) {
    console.error("❌ Marks fetch failed:", err);
    return [];
  }
}

// =======================
// Setup Internal Results
// =======================
async function setupInternalResults() {
  await getBatchInfo();
  subjectSelect.innerHTML = '';
  internalResultBody.innerHTML = '';

  const courses = await fetchCourses();
  if (courses.length === 0) {
    subjectSelect.innerHTML = '<option>No subjects found</option>';
    return;
  }

  // Populate dropdown
  for (const course of courses) {
    const option = document.createElement('option');
    option.value = course.Course_Code;
    option.textContent = course.Course_Name;
    subjectSelect.appendChild(option);
  }

  // Render first subject by default
  if (subjectSelect.options.length > 0) {
    subjectSelect.selectedIndex = 0;
    renderInternalResults(subjectSelect.value);
  }
}

// =======================
// Render Internal Results Table
// =======================
async function renderInternalResults(courseCode) {
  internalResultBody.innerHTML = '';
  const marks = await fetchMarks(courseCode);

  if (marks.length === 0) {
    internalResultBody.innerHTML = '<tr><td colspan="5">No marks found for this subject.</td></tr>';
    return;
  }

  for (const rec of marks) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${rec.Roll}</td>
      <td>${rec.Attend ?? ''}</td>
      <td>${rec.Mid_1 ?? ''}</td>
      <td>${rec.Mid_2 ?? ''}</td>
      <td>${rec.Assign_Mark ?? ''}</td>
    `;
    internalResultBody.appendChild(tr);
  }
}

// =======================
// Event Listeners
// =======================
subjectSelect.addEventListener('change', e => {
  renderInternalResults(e.target.value);
});

window.addEventListener('DOMContentLoaded', () => {
  setupInternalResults();
});
