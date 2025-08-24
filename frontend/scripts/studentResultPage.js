// studentResultPage.js
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
// Render Internal Results
// =======================
async function renderInternalResults(courseCode) {
  internalResultBody.innerHTML = 'Loading...';

  const marks = await fetchMarks(courseCode);
  if (marks.length === 0) {
    internalResultBody.innerHTML = '<tr><td colspan="4">No marks found</td></tr>';
    return;
  }

  // Group marks by assessment type
  const groupedMarks = marks.reduce((acc, mark) => {
    const { Assessment_Type, Marks } = mark;
    if (!acc[Assessment_Type]) {
      acc[Assessment_Type] = [];
    }
    acc[Assessment_Type].push(Marks);
    return acc;
  }, {});

  // Render table rows
  internalResultBody.innerHTML = Object.entries(groupedMarks).map(([type, marks]) => {
    const total = marks.reduce((sum, mark) => sum + mark, 0);
    const avg = (total / marks.length).toFixed(2);
    return `<tr>
      <td>${type}</td>
      <td>${marks.join('</td><td>')}</td>
      <td>${total}</td>
      <td>${avg}</td>
    </tr>`;
  }).join('');
}

// =======================
// Event Listeners
// =======================
subjectSelect.addEventListener('change', (e) => {
  const courseCode = e.target.value;
  renderInternalResults(courseCode);
});

// =======================
// Initial Setup
// =======================
setupInternalResults();
