if (data.success) {
  sessionStorage.setItem('batchId', data.batchId);
  try {
    const batchInfoRes = await fetch(`/api/batch_info?id=${data.batchId}`);
    const batchInfo = await batchInfoRes.json();
    if (batchInfo.success) {
      sessionStorage.setItem('session', batchInfo.session);
      sessionStorage.setItem('sem_No', batchInfo.sem_No);
      console.log('Stored session:', batchInfo.session);
      console.log('Stored semester number:', batchInfo.sem_No);
    }
  } catch (err) {
    console.error('Failed to fetch batch info:', err);
  }
  window.location.href = data.redirect;  // 🚨 This runs before session storage finishes writing
}
