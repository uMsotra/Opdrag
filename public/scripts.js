
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
    // Get a reference to the Firebase storage service
    const storage = firebase.storage();

    document.getElementById('assignment-form').addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission
      
      // Get form values including the phone number
      const assignmentName = document.getElementById('assignmentName').value;
      const courseCode = document.getElementById('courseCode').value;
      const university = document.getElementById('university').value;
      const dueDate = document.getElementById('dueDate').value;
      const priceOffer = document.getElementById('priceOffer').value;
      const file = document.getElementById('assignmentFile').files[0];
      let phoneNumber = document.getElementById('number').value; // Retrieve the phone number value
  
      // Remove initial '0' and add '27' at the beginning of the number
      phoneNumber = phoneNumber.replace(/^0/, '27');
  
      // Form validation
      if (assignmentName === '' || courseCode === '' || university === '' || dueDate === '' || priceOffer === '' || !file || phoneNumber === '') {
          alert('Please fill in all fields including the phone number and select a file.');
          return;
      }
      var phoneNumberPattern = /^27\d{9}$/; // Corrected regex pattern for phone number validation
      if (!phoneNumberPattern.test(phoneNumber)) {
          alert('Please enter your number starting with "27" followed by 9 digits.');
          document.getElementById('number').value = ''; // Clear the phone number field
          return; // Return to prevent further execution if validation fails
      }
    
    
    // Create a unique file name using a timestamp
    const timestamp = new Date().getTime(); // Get current timestamp
    const uniqueFileName = `${timestamp}_${file.name}`; // Append timestamp to file name
    
    // Upload file to Firebase Storage with the unique file name
    const storageRef = storage.ref(`assignments/${uniqueFileName}`);
    const uploadTask = storageRef.put(file);
    const loadingSpinner = document.getElementById('loadingSpinner');

// Show the loading spinner when upload starts
loadingSpinner.style.display = 'block';
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        function (snapshot) {
          // Handle progress
        },
        function (error) {
          // Handle unsuccessful uploads
          console.error('Error uploading file:', error);
          alert('Error uploading file. Please try again.');
          loadingSpinner.style.display = 'none';
        },
        function () {
          // Handle successful uploads on complete
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            loadingSpinner.style.display = 'none'; 
            // Save assignment data including phone number to Firebase Realtime Database
            const database = firebase.database();
            database.ref('assignments').push({
              assignmentName: assignmentName,
              courseCode: courseCode,
              university: university,
              dueDate: dueDate,
              priceOffer: priceOffer,
              downloadURL: downloadURL,
              phoneNumber: phoneNumber, // Include phone number in the data being stored
            });
  
            // Update the upload count for the university
    const universityRef = database.ref('uploadCounts').child(university);
    universityRef.transaction((currentCount) => {
      // If there's no count for this university yet, start at 1, else increment the count
      return (currentCount || 0) + 1;
    });
    
            alert('Assignment uploaded successfully!');
            // Clear form fields after successful upload
            document.getElementById('assignment-form').reset();
            document.getElementById('selectedFileName').textContent = '';
          });
        }
      );
    });
    
    
    window.onload = function() {
      firebase.auth().signInAnonymously()
        .then((userCredential) => {
          // The signed-in user info is stored in userCredential.user
          const user = userCredential.user;
          console.log("Anonymous user:", user.uid); // You can access the UID here
        })
        .catch((error) => {
          // Handle Errors here
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
        });
    };
    
  




// Function to fetch and display uploads by university
function displayUploadsByUniversity() {
    const uploadsGrid = document.getElementById('uploadsGrid');
    const uploadsRef = firebase.database().ref('uploadCounts');

    uploadsRef.on('value', (snapshot) => {
        uploadsGrid.innerHTML = ''; // Clear previous content
        const uploadCounts = snapshot.val();
        for (const university in uploadCounts) {
            if (uploadCounts.hasOwnProperty(university)) {
                const count = uploadCounts[university];
                const universityUpload = document.createElement('p');
                universityUpload.textContent = `${university}: ${count}`;
                uploadsGrid.appendChild(universityUpload);
            }
        }
    });
}

function showAssignmentForm() {
    const formSection = document.getElementById('assignmentFormSection');
    formSection.style.display = 'block';
}


// Call the function to display uploads by university on window load
window.onload = function () {
    // Your existing Firebase initialization code

    displayUploadsByUniversity(); // Call the function to initially display the uploads
};
