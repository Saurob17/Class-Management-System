// resourcePage.js
// ...existing code from Resource_.js...

document.addEventListener('DOMContentLoaded', () => {
  const resourceList = document.getElementById('resourceList');
  if (!resourceList) return;

  resourceList.innerHTML = '<span class="spinner">⏳</span> Loading resources...';

  fetch('/api/resources')
    .then(res => res.json())
    .then(data => {
      resourceList.innerHTML = '';
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(resource => {
          const div = document.createElement('div');
          div.className = 'resource-item';
          div.innerHTML = `
            <h3>${resource.title}</h3>
            <a href="${resource.url}" target="_blank">${resource.url}</a>
            <p>${resource.description || ''}</p>
          `;
          resourceList.appendChild(div);
        });
      } else {
        resourceList.innerHTML = '<div>No resources found.</div>';
      }
    })
    .catch(err => {
      console.error('Error loading resources:', err);
      resourceList.innerHTML = '<div>Error loading resources. Try again later.</div>';
    });
});
