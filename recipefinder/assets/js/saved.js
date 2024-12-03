import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCl6HGqapzjn5efENa8cxGV9Fj0SAsJj1A",
    authDomain: "recipefinder-14491.firebaseapp.com",
    projectId: "recipefinder-14491",
    storageBucket: "recipefinder-14491.appspot.com",
    messagingSenderId: "1074557766873",
    appId: "1:1074557766873:web:6482bc755343614e5f02c8"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


async function fetchSavedRecipes() {
    const user = auth.currentUser;
    if (user) {
        const savedRecipesRef = collection(db, 'users', user.uid, 'favorites');
        const querySnapshot = await getDocs(savedRecipesRef);
        const savedRecipesContainer = document.getElementById('saved-recipes');
        savedRecipesContainer.innerHTML = ''; 

        if (querySnapshot.empty) {
            document.getElementById('no-recipes').style.display = 'block'; 
        } else {
            document.getElementById('no-recipes').style.display = 'none';
            querySnapshot.forEach((doc) => {
                const recipe = doc.data();
                const recipeId = doc.id; 
                const recipeCard = `
                    <div class="col-md-4">
                        <div class="card mt-2">
                            <div class="card-body">
                                <h5 class="card-title">${recipe.name}</h5>
                                <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                                <p><strong>Calories:</strong> ${recipe.calories}</p>
                                <button class="btn btn-danger remove-recipe-btn" data-id="${recipeId}">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
                savedRecipesContainer.innerHTML += recipeCard;
            });

            document.querySelectorAll('.remove-recipe-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const recipeId = this.getAttribute('data-id');
                    removeRecipe(recipeId);
                });
            });
        }
    } else {
        document.getElementById('saved-recipes').innerHTML = '<p>Please log in to view your saved recipes.</p>';
    }
}

async function removeRecipe(recipeId) {
    const user = auth.currentUser;
    if (user) {
        try {
           
            await deleteDoc(doc(db, 'users', user.uid, 'favorites', recipeId));
            alert('Recipe removed!');
            fetchSavedRecipes(); 
        } catch (error) {
            console.error('Error removing recipe:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const authLinks = document.getElementById('auth-links'); 

    onAuthStateChanged(auth, (user) => {
        if (user) {
            fetchSavedRecipes(); 

            authLinks.innerHTML = `
                <li class="nav-item">
                    <button class="nav-link btn btn-link" id="logout-btn">Log Out</button>
                </li>
            `;
            
            document.getElementById('logout-btn').addEventListener('click', () => {
                signOut(auth).then(() => {
                    window.location.reload(); 
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
