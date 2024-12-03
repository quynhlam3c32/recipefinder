
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyCl6HGqapzjn5efENa8cxGV9Fj0SAsJj1A",
  authDomain: "recipefinder-14491.firebaseapp.com",
  projectId: "recipefinder-14491",
  storageBucket: "recipefinder-14491.appspot.com",
  messagingSenderId: "1074557766873",
  appId: "1:1074557766873:web:6482bc755343614e5f02c8"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(); 


const submitButton = document.getElementById('submit');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');



submitButton.addEventListener("click", function(event) {
    event.preventDefault(); 
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    


    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }


    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User signed up:', user);

            
            alert('Sign up successful!');
            document.getElementById('signup-form').reset(); 
            window.location.href = "index.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;


            if (errorCode === 'auth/weak-password') {
                alert('The password is too weak. Please try again with a stronger password.');
            } else if (errorCode === 'auth/email-already-in-use') {
                alert('This email is already registered. Please try logging in.');
            } else if (errorCode === 'auth/invalid-email') {
                alert('The email address is not valid.');
            } else {
                alert(`Error: ${errorMessage}`);
            }

            console.error('Error signing up:', errorCode, errorMessage);
        });
});
