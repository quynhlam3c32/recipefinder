// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl6HGqapzjn5efENa8cxGV9Fj0SAsJj1A",
  authDomain: "recipefinder-14491.firebaseapp.com",
  projectId: "recipefinder-14491",
  storageBucket: "recipefinder-14491.appspot.com",
  messagingSenderId: "1074557766873",
  appId: "1:1074557766873:web:6482bc755343614e5f02c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(); // Initialize Firebase Authentication

// Grab form elements
const submitButton = document.getElementById('submit');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

// Event listener for the submit button
submitButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission

    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Use Firebase Authentication to create a new user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            alert("Creating Account...");
            console.log('User signed up:', user);

            alert('Sign up successful!');
            window.location.href = "signedin.html"; // Redirect to signed-in page
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error signing up:', errorCode, errorMessage);
            alert(`Error: ${errorMessage}`);
        });
});
