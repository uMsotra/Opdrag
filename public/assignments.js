// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6xjkAKkZVuxrlv9N3z0y27MrLI5KE03o",
  authDomain: "opdragtutors.firebaseapp.com",
  projectId: "opdragtutors",
  storageBucket: "opdragtutors.appspot.com",
  messagingSenderId: "808596846769",
  appId: "1:808596846769:web:5617c3df116419332e4a90",
  measurementId: "G-17Q03YHCZ3"
};
  firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const assignmentsRef= firebase.database().ref('assignments');


assignmentsRef.on('value', (snapshot) => {
    const assignments = snapshot.val();
  
    const mainContainer = document.querySelector('.assignments-grid');
    mainContainer.innerHTML = ''; // Clear previous content
  
    for (let key in assignments) {
      const assignment = assignments[key];
      const assignmentCard = createAssignmentCard(assignment);
      mainContainer.appendChild(assignmentCard);
    }
  });
  
  // Function to create assignment card HTML
function createAssignmentCard(assignment) {
    const { assignmentName, courseCode, university, dueDate, priceOffer, downloadURL } = assignment;
  
    const card = document.createElement('div');
    card.classList.add('assignment-card');
  
    // Helper function to create the details element
    function createDetailElement(label, value) {
      const detail = document.createElement('p');
      detail.innerHTML = `<strong>${label}:</strong> ${value}`;
      return detail;
    }
  
    // Create elements for assignment details
    const title = document.createElement('h2');
    title.textContent = assignmentName;
  
    const course = createDetailElement('Course Code', courseCode);
    const universityText = createDetailElement('University', university);
    const due = createDetailElement('Due Date', dueDate);
    const price = createDetailElement('Price Offer (ZAR)', priceOffer);
  
  
    // Create container for PDF viewer and link
    const pdfContainer = document.createElement('div');
    pdfContainer.classList.add('pdf-container');
  
    // Create PDF viewer iframe
    const pdfViewer = document.createElement('embed');
    pdfViewer.classList.add('pdf-viewer');
    pdfViewer.setAttribute('src', downloadURL); // Set the source to the PDF URL
    pdfViewer.setAttribute('type', 'application/pdf');
    pdfViewer.setAttribute('width', '100%');
    pdfViewer.setAttribute('height', '600px');
  
    // Create View Full PDF hyperlink
    const viewFullPdfLink = document.createElement('a');
    viewFullPdfLink.textContent = 'View Full PDF';
    viewFullPdfLink.classList.add('view-pdf-link');
    viewFullPdfLink.href = downloadURL;
    viewFullPdfLink.target = '_blank';

    // Create WhatsApp link
    const whatsappLink = document.createElement('a');
    whatsappLink.textContent = 'Contact via WhatsApp';
    whatsappLink.classList.add('whatsapp-link'); // Add class for styling
    whatsappLink.href = `https://wa.me/${assignment.phoneNumber}`; // Link to WhatsApp using the phone number
    whatsappLink.target = '_blank';
  
    // Append elements to the card
    pdfContainer.appendChild(pdfViewer);
    card.appendChild(title);
    card.appendChild(course);
    card.appendChild(universityText);
    card.appendChild(due);
    card.appendChild(price);
    card.appendChild(pdfContainer);
    card.appendChild(viewFullPdfLink);
    card.appendChild(whatsappLink);
  
const dueDateTime = new Date(dueDate).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = dueDateTime - currentTime;
  const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

  // Create element for remaining days
  const daysRemaining = createDetailElement('Days Remaining', `${remainingDays} day(s)`);

  // Append remaining days to the card
  card.appendChild(daysRemaining);

  return card;
  }
  
  let searchTimeout; // Declare searchTimeout variable
  
  function fetchAndDisplayAllAssignments() {
    assignmentsRef.on('value', (snapshot) => {
        const assignments = snapshot.val();

        const mainContainer = document.querySelector('.assignments-grid');
        mainContainer.innerHTML = ''; // Clear previous content

        if (!assignments || Object.keys(assignments).length === 0) {
            // If there are no assignments, display a note
            const noAssignmentsNote = document.createElement('p');
            noAssignmentsNote.textContent = 'No assignments available at the moment.';
            noAssignmentsNote.classList.add('no-assignments-note'); 
            mainContainer.appendChild(noAssignmentsNote);
        }else {
        for (let key in assignments) {
          const assignment = assignments[key];
          const remainingDays = calculateRemainingDays(assignment.dueDate);
  
          if (remainingDays === 0) {
            // Delete assignment with 0 days remaining
            deleteAssignment(key);
          } else {
            const assignmentCard = createAssignmentCard(assignment);
            mainContainer.appendChild(assignmentCard);
          }
        }
      }
    });
  }
  
  function calculateRemainingDays(dueDate) {
    const dueDateTime = new Date(dueDate).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = dueDateTime - currentTime;
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  }
  
  function deleteAssignment(key) {
    assignmentsRef.child(key)
      .remove()
      .then(() => {
        console.log(`Assignment with key ${key} has been removed.`);
      })
      .catch((error) => {
        console.error(`Error removing assignment: ${error}`);
      });
  }
  
  // Call the function to fetch assignments and display them when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayAllAssignments();
  });
  
  function filterAssignments(searchTerm) {
    clearTimeout(searchTimeout);
  
    searchTimeout = setTimeout(() => {
      assignmentsRef.on('value', (snapshot) => {
        const assignments = snapshot.val();
  
        if (assignments) {
          const mainContainer = document.querySelector('.assignments-grid');
          mainContainer.innerHTML = ''; // Clear previous content
  
          for (let key in assignments) {
            const assignment = assignments[key];
            if (
              assignment.assignmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              assignment.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
              assignment.university.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              const assignmentCard = createAssignmentCard(assignment);
              mainContainer.appendChild(assignmentCard);
            }
          }
        }
      });
    }, 300); // Delay in milliseconds before filtering
  }
  
  const searchInput = document.getElementById('searchInput');
  
  // Search input event listener
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value;
    filterAssignments(searchTerm);
  });
  
  // Load all assignments when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayAllAssignments();
  });
  

  // Function to delete assignments that have passed their due date
function deleteExpiredAssignments() {
  const today = new Date().getTime();

  assignmentsRef.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key;
      const assignment = childSnapshot.val();
      const dueDate = new Date(assignment.dueDate).getTime();

      if (dueDate < today) {
        assignmentsRef.child(key).remove()
          .then(() => {
            console.log(`Assignment with key ${key} has been removed.`);
          })
          .catch((error) => {
            console.error(`Error removing assignment: ${error}`);
          });
      }
    });
  });
}

// Call the function to delete expired assignments when the page loads
document.addEventListener('DOMContentLoaded', () => {
  deleteExpiredAssignments();
});
