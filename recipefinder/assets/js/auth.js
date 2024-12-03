
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

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

document.addEventListener('DOMContentLoaded', () => {
    const authLinks = document.getElementById('auth-links');

   
    onAuthStateChanged(auth, (user) => {
        if (user) {
            
            authLinks.innerHTML = `
                
                <li class="nav-item">
                    <button class="nav-link btn btn-link" id="logout-btn">Log Out</button>
                </li>
            `;

            document.getElementById('logout-btn').addEventListener('click', () => {
                signOut(auth).then(() => {
                   
                    window.location.href = 'index.html'; 
                }).catch((error) => {
                    console.error('Error logging out:', error);
                });
            });
        } else {
           
            authLinks.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="signup.html">Sign Up</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="login.html">Log In</a>
                </li>
            `;
        }
    });
});
