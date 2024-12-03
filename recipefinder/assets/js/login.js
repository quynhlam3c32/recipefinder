
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";


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
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');


submitButton.addEventListener("click", function(event) {
    event.preventDefault(); 
    
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
       
            const user = userCredential.user;
            alert("Logging in...");
            console.log('User logged in:', user);

            
            window.location.href = "index.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error logging in:', errorCode, errorMessage);
            alert(`Error: ${errorMessage}`);
        });
});

const forgotPasswordLink = document.getElementById('forgot-password');
const forgotPasswordSection = document.getElementById('forgot-password-section');
const loginForm = document.getElementById('login-form');
const resetPasswordForm = document.getElementById('reset-password-form');
const resetPasswordBtn = document.getElementById('reset-password-btn');
const resetEmailInput = document.getElementById('reset-email');
const backToLoginLink = document.getElementById('back-to-login');


forgotPasswordLink.addEventListener('click', function(event) {
    event.preventDefault();
    loginForm.style.display = 'none';
    forgotPasswordSection.style.display = 'block';
});


backToLoginLink.addEventListener('click', function(event) {
    event.preventDefault();
    loginForm.style.display = 'block';
    forgotPasswordSection.style.display = 'none';
});


resetPasswordBtn.addEventListener('click', function(event) {
    event.preventDefault();
    
    const email = resetEmailInput.value;


    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent! Check your inbox.");
            resetPasswordForm.reset();
       
            loginForm.style.display = 'block';
            forgotPasswordSection.style.display = 'none';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error sending password reset email:', errorCode, errorMessage);
            alert(`Error: ${errorMessage}`);
        });
});
