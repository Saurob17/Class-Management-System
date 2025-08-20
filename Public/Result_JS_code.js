// Dynamically fetch subjects (courses) and marks for current batch/session/semester from backend
const batchId = sessionStorage.getItem('batchId');
let semester = sessionStorage.getItem('semester');
let session = sessionStorage.getItem('session');

const internalResultBody = document.getElementById('internalResultBody');
const subjectSelect = document.getElementById('subjectSelect');

// If semester or session is missing, fetch from batch info
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
  } catch (err) {}
}

async function fetchCourses() {
  // Get all courses for this semester
  if (!semester) return [];
  try {
    const res = await fetch(`/api/courses?sem_No=${semester}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.courses)) return [];
    return data.courses;
  } catch (err) {
    return [];
  }
}

async function fetchMarks(courseCode) {
  // Get marks for all students for this course, session, semester
  if (!session || !semester) return [];
  try {
    const res = await fetch(`/api/marks?courseCode=${courseCode}&session=${session}&sem_No=${semester}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.marks)) return [];
    return data.marks;
  } catch (err) {
    return [];
  }
}

async function setupInternalResults() {
  await getBatchInfo(); // Ensure semester/session are set
  subjectSelect.innerHTML = '';
  internalResultBody.innerHTML = '';
  const courses = await fetchCourses();
  if (courses.length === 0) {
    subjectSelect.innerHTML = '<option>No subjects found</option>';
    return;
  }

  
  for (const course of courses) {
    const option = document.createElement('option');
    option.value = course.Course_Code;
    option.textContent = course.Course_Name;
    subjectSelect.appendChild(option);
  }
  // Show first subject by default
  if (subjectSelect.options.length > 0) {
    subjectSelect.selectedIndex = 0;
    renderInternalResults(subjectSelect.value);
  }
}

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

subjectSelect.addEventListener('change', e => {
  renderInternalResults(e.target.value);
});

// Initial setup
window.addEventListener('DOMContentLoaded', setupInternalResults);
