// filter.js

// Function to filter assignments by days remaining
function filterByDaysRemaining() {
    const maxDays = document.getElementById('daysFilterInput').value;
    const currentTime = new Date().getTime();
  
    assignmentsRef.once('value', (snapshot) => {
      const assignments = snapshot.val();
  
      const filteredAssignments = Object.entries(assignments)
        .filter(([key, assignment]) => {
          const dueDateTime = new Date(assignment.dueDate).getTime();
          const timeDifference = dueDateTime - currentTime;
          const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
          return remainingDays <= maxDays;
        })
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
  
      renderAllAssignments(filteredAssignments);
    });
  }
  