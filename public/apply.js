
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
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Set database variable
    var database = firebase.database()
    
    function validateForm() {
      // Validate Name
      var nameInput = document.getElementById("name");
      var name = nameInput.value.trim();
      var namePattern = /^[A-Za-z]{1,10}$/; // Allows only letters and up to 10 characters
  
      if (!namePattern.test(name)) {
          alert("Please enter a valid name (up to 10 letters, letters only).");
          nameInput.focus();
          return false;
      }
  
      // Validate Phone Number
      var phoneNumberInput = document.getElementById("number");
      var phoneNumber = phoneNumberInput.value.trim();
      var phoneNumberPattern = /^\d{11}$/; // Allows only 11 digits
  
      if (!phoneNumberPattern.test(phoneNumber)) {
          alert("Please enter a valid phone number (11 digits, numbers only).");
          phoneNumberInput.focus();
          return false;
      }
  
      // Validate Final Mark in Course
      var marksInput = document.getElementById("marks");
      var marks = marksInput.value.trim();
      var marksPattern = /^\d{1,3}$/;
  
  
  
      if (!marksPattern.test(marks)) {
          alert("Please enter a valid final mark (maximum 3 digits, numbers only).");
          marksInput.focus();
          return false;
      }
  
      return true; // Form is valid, can be submitted
  }
    
  function save() {
    var name = document.getElementById('name').value;
    var university = document.getElementById('university').value;
    var number = document.getElementById('number').value;
    var subject = document.getElementById('subject').value;
    var marks = document.getElementById('marks').value;

    // Validate Name
    var namePattern = /^[A-Za-z]{1,10}$/;
    if (!namePattern.test(name)) {
        alert('Please enter a valid name (up to 10 letters, letters only).');
        return;
    }

    // Validate Phone Number
    var phoneNumberPattern = /^\d{10}$/;
    if (!phoneNumberPattern.test(number)) {
        alert('Please enter a valid phone number (10 digits, numbers only).');
        return;
    }

    // Manipulate the phone number
    number = '27' + number.substring(1); // Add '27' to the beginning of the number

    // Validate Marks
    var marksPattern = /^\d{1,3}$/;
    if (!marksPattern.test(marks)) {
        alert('Please enter a valid final mark (max 3 digits, numbers only).');
        return;
    }

    // Check for empty inputs
    if (name === '' || university === '' || number === '' || subject === '' || marks === '') {
        alert('Please fill in all fields');
        return;
    }

    // If all validations pass, push data to Firebase
    database.ref('users').push({
        name: name,
        university: university,
        number: number,
        subject: subject,
        marks: marks
    });

    alert('Application Successful');
    
    // Clear the form after successful submission
    document.getElementById('name').value = '';
    document.getElementById('university').value = '';
    document.getElementById('number').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('marks').value = '';
}

    
  
    function update() {
      var number = document.getElementById('number').value
      var name = document.getElementById('name').value
      var university = document.getElementById('university').value
    
      var updates = {
        email : name,
        password : university
      }
    
      database.ref('users/' + number).update(updates)
    
      alert('updated')
    }
    
    