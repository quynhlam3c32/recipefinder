import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js"; // Import Realtime Database
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js"; // Add setDoc and doc
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyCl6HGqapzjn5efENa8cxGV9Fj0SAsJj1A",
    authDomain: "recipefinder-14491.firebaseapp.com",
    projectId: "recipefinder-14491",
    storageBucket: "recipefinder-14491.appspot.com",
    messagingSenderId: "1074557766873",
    appId: "1:1074557766873:web:6482bc755343614e5f02c8",
    databaseURL: "https://recipefinder-14491-default-rtdb.firebaseio.com/" 
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const database = getDatabase(app); 
const auth = getAuth();
const suggestionBox = document.getElementById('suggestionBox');
const ingredientInput = document.getElementById('ingredients');
const ingredientTagsContainer = document.getElementById('ingredientTags');
let availableIngredients = [];
let selectedIngredients = []; 


async function fetchIngredients() {
    try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const allIngredients = [];

        querySnapshot.forEach((doc) => {
            const recipe = doc.data();
            if (Array.isArray(recipe.ingredients)) {
                allIngredients.push(...recipe.ingredients); 
            }
        });

       
        availableIngredients = [...new Set(allIngredients.map(ingredient => ingredient.toLowerCase()))];
        console.log('Available ingredients loaded:', availableIngredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
    }
}
fetchIngredients(); 


ingredientInput.addEventListener('input', () => {
    const query = ingredientInput.value.toLowerCase();
    suggestionBox.innerHTML = ''; 

    if (query.length > 0) {
        const filteredIngredients = availableIngredients.filter(ingredient =>
            ingredient.includes(query)
        );

        filteredIngredients.forEach(ingredient => {
            const suggestion = document.createElement('div');
            suggestion.classList.add('suggestion-item');
            suggestion.textContent = ingredient;
            suggestionBox.appendChild(suggestion);

            
            suggestion.addEventListener('click', () => {
                addTag(ingredient); 
                ingredientInput.value = ''; 
                suggestionBox.innerHTML = ''; 
            });
        });
    }
});


function addTag(ingredient) {
    if (!selectedIngredients.includes(ingredient.toLowerCase())) {
        selectedIngredients.push(ingredient.toLowerCase());

        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.innerHTML = `${ingredient} <span class="remove-tag">&times;</span>`;
        ingredientTagsContainer.appendChild(tag);

        tag.querySelector('.remove-tag').addEventListener('click', () => {
            tag.remove();
            selectedIngredients = selectedIngredients.filter((item) => item !== ingredient.toLowerCase());
        });

        ingredientInput.focus();
    }
}



document.getElementById('ingredientForm').addEventListener('submit', async function (e) {
    e.preventDefault(); 

    if (selectedIngredients.length === 0) {
        alert('Please add at least one ingredient.');
        return;
    }

    const ingredientsRef = push(ref(database, 'userIngredients')); 
    set(ingredientsRef, {
        ingredients: selectedIngredients,
        timestamp: new Date().toISOString() 
    }).then(() => {
        console.log("Ingredients saved to Firebase Realtime Database.");
    }).catch((error) => {
        console.error("Error saving ingredients:", error);
    });

    fetchAndDisplayMatchingRecipes(); 
});


async function fetchAndDisplayMatchingRecipes() {
    const recipeCollection = collection(db, 'recipes');
    const recipeResults = document.getElementById('recipeResults');

    try {
        const querySnapshot = await getDocs(recipeCollection);
        recipeResults.innerHTML = ''; 
        let found = false;

        querySnapshot.forEach((doc) => {
            const recipe = doc.data();
            const recipeIngredients = recipe.ingredients.map(ingredient => ingredient.toLowerCase());
            const isMatch = selectedIngredients.every(ingredient => recipeIngredients.includes(ingredient));

            if (isMatch) {
                displayRecipe(recipe);
                found = true;
            }
        });

        if (!found) {
            recipeResults.innerHTML = '<p class="text-danger">No matching recipes found. Please try different ingredients.</p>';
        }
    } catch (error) {
        console.error("Error fetching recipes: ", error);
    }
}


async function saveRecipe(recipe) {
    const user = auth.currentUser; 
    if (user) {
        try {
            await setDoc(doc(db, 'users', user.uid, 'favorites', recipe.name), recipe);
            alert('Recipe saved!');
        } catch (error) {
            console.error('Error saving recipe:', error);
        }
    } else {
        alert('Please log in to save recipes.');
    }
}


function displayRecipe(recipe) {
    const recipeResults = document.getElementById('recipeResults');
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('card', 'mt-2');
    recipeCard.setAttribute('data-recipe', JSON.stringify(recipe));

    recipeCard.innerHTML = `
        <div class="card-body d-flex align-items-center">
            <img 
                src="${recipe.image || 'assets/img/default-recipe.jpg'}" 
                alt="${recipe.name}" 
                class="recipe-img" 
                style="width: 150px; height: 150px; object-fit: cover; border-radius: 10px; margin-right: 15px;">
            <div>
                <h3>${recipe.name}</h3>
                <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                <p><strong>Calories:</strong> ${recipe.calories ? recipe.calories : 'N/A'}</p>
                <p><strong>Preferences:</strong> ${recipe.preferences ? recipe.preferences.join(', ') : 'None'}</p>
                <div class="text-end">
                    <button class="save-recipe-btn btn btn-primary btn-sm" data-recipe='${JSON.stringify(recipe)}'>Save Recipe</button>
                </div>
            </div>
        </div>
    `;

    recipeResults.appendChild(recipeCard);

    
    recipeCard.querySelector('.save-recipe-btn').addEventListener('click', function () {
        saveRecipe(recipe);
    });
}


document.getElementById('applyFiltersBtn').addEventListener('click', () => {
    const selectedPreference = document.getElementById('preferences').value;
    const maxCalories = parseInt(document.getElementById('calories').value, 10);
    const recipeResults = document.getElementById('recipeResults');
    const allRecipes = Array.from(recipeResults.children);

    allRecipes.forEach((recipeCard) => {
        const recipe = JSON.parse(recipeCard.getAttribute('data-recipe'));
        const matchesPreference = selectedPreference === "All" || (recipe.preferences && recipe.preferences.includes(selectedPreference.toLowerCase()));
        const withinCalorieLimit = isNaN(maxCalories) || (recipe.calories && recipe.calories <= maxCalories);

        recipeCard.style.display = matchesPreference && withinCalorieLimit ? "" : "none";
    });
});
function displayActiveFilters() {
    const filterContainer = document.getElementById('activeFilters');
    filterContainer.innerHTML = `
        <p>Active Filters:</p>
        <ul>
            ${selectedIngredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
    `;
}


document.addEventListener('DOMContentLoaded', () => {
    const authLinks = document.getElementById('auth-links');

    onAuthStateChanged(auth, (user) => {
        authLinks.innerHTML = user
            ? `<li class="nav-item"><button class="nav-link btn btn-link" id="logout-btn">Log Out</button></li>`
            : `<li class="nav-item"><a class="nav-link" href="signup.html">Sign Up</a></li><li class="nav-item"><a class="nav-link" href="login.html">Log In</a></li>`;

        if (user) {
            document.getElementById('logout-btn').addEventListener('click', () => {
                signOut(auth).then(() => window.location.reload()).catch(console.error);
            });
        }
    });
});
