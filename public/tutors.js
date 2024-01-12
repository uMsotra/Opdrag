
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
  
  // Reference to the "tutors" node in Firebase database
  const tutorsRef = firebase.database().ref('users');
  
  function fetchAndDisplayAllTutors() {
    tutorsRef.on('value', (snapshot) => {
      const tutors = snapshot.val();
  
      if (tutors) {
        const tutorsSection = document.getElementById('tutors');
        tutorsSection.innerHTML = ''; // Clear previous content
  
        for (const tutorId in tutors) {
          const tutor = tutors[tutorId];
          const tutorListing = createTutorListingElement(tutor);
          tutorsSection.appendChild(tutorListing);
        }
      }
    });
  }
  
  function createTutorListingElement(tutor) {
     
    const tutorTile = document.createElement('div');
    tutorTile.className = 'tutor-tile';
  
    const tutorInfo = document.createElement('div');
    tutorInfo.className = 'tutor-info';
  
    const tutorName = document.createElement('h3');
    tutorName.textContent = tutor.name;
  
    const university = document.createElement('p');
    university.innerHTML = `<strong>University:</strong> ${tutor.university}`;
  
    const subject = document.createElement('p');
    subject.innerHTML = `<strong>Course:</strong> ${tutor.subject}`;
  
    const grade = document.createElement('p');
    grade.innerHTML = `<strong>Grade:</strong> ${tutor.marks}%`;
  
    const whatsappLink = document.createElement('a');
    whatsappLink.href = `https://wa.me/${tutor.number}?text=Hey%20${tutor.name}%20can%20you%20help%20me%20with%20a%20${tutor.subject}%20assignment%20`;
    whatsappLink.target = '_blank';
    whatsappLink.textContent = 'WhatsApp';
  
    tutorInfo.appendChild(tutorName);
    tutorInfo.appendChild(university);
    tutorInfo.appendChild(subject);
    tutorInfo.appendChild(grade);
    tutorInfo.appendChild(whatsappLink);
  
    tutorTile.appendChild(tutorInfo);
  
    return tutorTile;
  }
  
  
  
  
  
  // Load all tutors when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayAllTutors();
  });
  // Add this code below your existing code in script.js
  
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  
  let searchTimeout;
  
  function filterTutors(searchTerm) {
    clearTimeout(searchTimeout);
  
    searchTimeout = setTimeout(() => {
      tutorsRef.on('value', (snapshot) => {
        const tutors = snapshot.val();
  
        if (tutors) {
          const tutorsSection = document.getElementById('tutors');
          tutorsSection.innerHTML = ''; // Clear previous content
  
          for (const tutorId in tutors) {
            const tutor = tutors[tutorId];
            if (
              tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              tutor.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
              tutor.university.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              const tutorListing = createTutorListingElement(tutor);
              tutorsSection.appendChild(tutorListing);
            }
          }
        }
      });
    }, 300); // Delay in milliseconds before filtering
  }
  
  
  // Replace the existing searchButton event listener code
  
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value;
    filterTutors(searchTerm);
  });
  
  
  // Load all tutors when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayAllTutors();
  });
  
  
  
  