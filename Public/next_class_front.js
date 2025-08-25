const sessionn = sessionStorage.getItem("session");
const sem_Noo = sessionStorage.getItem("sem_No");
    function loadNextClass() {
      
      
      fetch(`/api/next_class?session=${sessionn}&sem_No=${sem_Noo}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.nextClass) {
            document.getElementById('nextClassTime').textContent = data.nextClass.Start_Time;
            document.getElementById('nextClassInfo').textContent =
              `${data.nextClass.Course_Code} on ${data.nextClass.Day} in ${data.nextClass.Class_Room}`;
          } else {
            document.getElementById('nextClassTime').textContent = '🎉';
            document.getElementById('nextClassInfo').textContent = 'No upcoming classes.';
          }
        })
        .catch(err => console.error(err));
    }

    document.addEventListener('DOMContentLoaded', () => {
      console.log("currentMinutes:");
      loadWeeklyRoutine(); // আগের মতো
      loadNextClass();     // শুধু call করুন
    });