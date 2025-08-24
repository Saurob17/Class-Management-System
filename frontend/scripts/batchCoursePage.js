// batchCoursePage.js
document.addEventListener('DOMContentLoaded', () => {
	const courseList = document.getElementById('courseList');
	const sem_No = sessionStorage.getItem('sem_No');

	if (!courseList) return;

	if (!sem_No) {
		courseList.innerHTML = '<div>No semester selected. Please login/select batch first.</div>';
		return;
	}

	courseList.innerHTML = '<span class="spinner">⏳</span> Loading courses...';

	fetch(`/api/batch_courses?sem_No=${sem_No}`)
		.then(res => res.json())
		.then(data => {
			courseList.innerHTML = '';
			if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
				data.courses.forEach(course => {
					const div = document.createElement('div');
					div.className = 'course-item';
					div.innerHTML = `
						<strong>${course.Course_Code}</strong> - ${course.Course_Name} 
						(Semester: ${course.sem_No})
						<button class="details-btn" data-course="${course.Course_Code}">Details</button>
						<div class="course-details" style="display:none;"></div>
					`;
					const detailsBtn = div.querySelector('.details-btn');
					const detailsDiv = div.querySelector('.course-details');
					detailsBtn.addEventListener('click', async () => {
						if (detailsDiv.style.display === 'block') {
							detailsDiv.style.display = 'none';
							return;
						}
						detailsDiv.style.display = 'block';
						detailsDiv.innerHTML = '<span class="spinner">⏳</span> Loading details...';
						try {
							// Example: fetch more details if endpoint exists
							const res = await fetch(`/api/course_details?courseCode=${course.Course_Code}`);
							const data = await res.json();
							if (data.success && data.details) {
								detailsDiv.innerHTML = `<pre>${JSON.stringify(data.details, null, 2)}</pre>`;
							} else {
								detailsDiv.innerHTML = 'No details found.';
							}
						} catch (err) {
							detailsDiv.innerHTML = 'Error loading details.';
						}
					});
					courseList.appendChild(div);
				});
			} else {
				courseList.innerHTML = '<div>No courses found for this semester.</div>';
			}
		})
		.catch(err => {
			console.error('Error loading courses:', err);
			courseList.innerHTML = '<div>Error loading courses. Try again later.</div>';
		});
});
