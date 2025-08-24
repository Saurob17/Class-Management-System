// ✅ student login-এর সময় অবশ্যই sessionStorage.setItem("session", "2022-2023") করে রাখবেন
const sessionVal = sessionStorage.getItem("session");

function createCard(a, idx) {
  return `
    <div class="assignment-card" style="animation-delay:${Math.min(idx * 60, 600)}ms">
      <span class="pill">${a.course_code ?? ""}</span>
      <div class="course-name" title="${a.course_name ?? ""}">${a.course_name ?? ""}</div>
      <div class="topic" title="${a.topic ?? ""}">${a.topic ?? ""}</div>
      <div class="row"><b>Session:</b> ${a.session ?? ""}</div>
      <div class="row"><b>Teacher ID:</b> ${a.Teacher_Id ?? ""}</div>
    </div>
  `;
}

async function loadAssignments() {
  const wrap = document.getElementById("assignmentContainer");

  if (!sessionVal) {
    wrap.innerHTML = `
      <div class="no-assignments">
        ⚠️ Session not found. Please log in again.
      </div>`;
    return;
  }

  try {
    const qs = new URLSearchParams();
    qs.set("session", sessionVal);
console.log("Fetching assignments for session:", sessionVal);
    const res = await fetch(`/api/assignments?${qs.toString()}`, {
      headers: { "Accept": "application/json" }
    });
    console.log(res);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (data?.success && Array.isArray(data.assignments) && data.assignments.length > 0) {
      wrap.innerHTML =
        `<div class="assignments-grid">
          ${data.assignments.map((a, i) => createCard(a, i)).join("")}
        </div>`;
    } else {
      wrap.innerHTML = `
        <div class="no-assignments">
          📋 No assignments found for session <b>${sessionVal}</b>.
        </div>`;
    }
  } catch (err) {
    console.error("Error loading assignments:", err);
    wrap.innerHTML = `
      <div class="no-assignments">
        ⚠️ Error loading assignments. Please try again.
      </div>`;
  }
}

loadAssignments();
