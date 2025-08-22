// Result_JS_code.js

// Get sessionStorage data
const batchId = sessionStorage.getItem('batchId');
let semester = sessionStorage.getItem('semester');
let session = sessionStorage.getItem('session');

// DOM elements
const internalResultBody = document.getElementById('internalResultBody');
const externalResultBody = document.getElementById('externalResultBody');
const subjectSelect = document.getElementById('subjectSelect');

// Get batch info to set semester/session
async function getBatchInfo() {
  if (!batchId) return;
  try {
    const res = await fetch(`/api/batch_info?id=${batchId}`);
    const data = await res.json();
    if (data.success) {
      semester = semester || data.sem_No;
      session = session || data.session;
      sessionStorage.setItem('semester', semester);
      sessionStorage.setItem('session', session);
    }
  } catch (err) {
    console.error("Batch info fetch error:", err);
  }
}

// Fetch courses for the semester
async function fetchCourses() {
  if (!semester) return [];
  try {
    const res = await fetch(`/api/courses?sem_No=${semester}`);
    const data = await res.json();
    return data.success ? data.courses : [];
  } catch (err) {
    console.error("Courses fetch error:", err);
    return [];
  }
}

// Fetch internal results for a course
async function fetchInternal(courseCode) {
  try {
    const res = await fetch(`/api/internal_results?courseCode=${courseCode}&session=${session}&sem_No=${semester}`);
    const data = await res.json();
    return data.success ? data.internal : [];
  } catch (err) {
    console.error("Internal result fetch error:", err);
    return [];
  }
}

// Fetch external results for the batch
async function fetchExternal() {
  try {
    const res = await fetch(`/api/external_results?session=${session}&sem_No=${semester}`);
    const data = await res.json();
    return data.success ? data.external : [];
  } catch (err) {
    console.error("External result fetch error:", err);
    return [];
  }
}

// Render internal results table
async function renderInternal(courseCode) {
  internalResultBody.innerHTML = '';
  const rows = await fetchInternal(courseCode);
  if (rows.length === 0) {
    internalResultBody.innerHTML = `<tr><td colspan="4">No internal result found.</td></tr>`;
    return;
  }
  rows.forEach(r => {
    internalResultBody.innerHTML += `
      <tr>
        <td>${r.Roll}</td>
        <td>${r.Mid_1 ?? ''}</td>
        <td>${r.Mid_2 ?? ''}</td>
        <td>${r.Assign_Mark ?? ''}</td>
      </tr>
    `;
  });
}

// Render external results table
async function renderExternal() {
  externalResultBody.innerHTML = '';
  const rows = await fetchExternal();
  if (rows.length === 0) {
    externalResultBody.innerHTML = `<tr><td colspan="2">No external result found.</td></tr>`;
    return;
  }
  rows.forEach(r => {
    externalResultBody.innerHTML += `
      <tr>
        <td>${r.Roll}</td>
        <td>${r.Sem_CGPA ?? ''}</td>
      </tr>
    `;
  });
}

// Setup initial results and populate subject select
async function setupResults() {
  await getBatchInfo();

  const courses = await fetchCourses();
  subjectSelect.innerHTML = '';
  if (courses.length === 0) {
    subjectSelect.innerHTML = '<option>No subjects found</option>';
    return;
  }

  for (const course of courses) {
    const option = document.createElement('option');
    option.value = course.Course_Code;
    option.textContent = course.Course_Name || course.Course_Code;
    subjectSelect.appendChild(option);
  }

  // Render first course internal result by default
  if (subjectSelect.options.length > 0) {
    subjectSelect.selectedIndex = 0;
    renderInternal(subjectSelect.value);
  }

  // Render external results
  renderExternal();
}

// Change event for course selection
subjectSelect.addEventListener('change', e => {
  renderInternal(e.target.value);
});

// Initialize after DOM loaded
window.addEventListener('DOMContentLoaded', setupResults);
