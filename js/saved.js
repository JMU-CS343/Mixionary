const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');

const BASE_URL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`;

let local = JSON.parse(localStorage.getItem("saved"));
// Ensure `local` is an array to avoid runtime errors and simplify checks
if (!Array.isArray(local)) {
    local = [];
    localStorage.setItem("saved", JSON.stringify(local));
}

// Append drinks to the results area without clearing (used when loading saved items)
function displaySavedDrinks(drinks) {
    if (!drinks) return;

    drinks.forEach(drink => {
    const card = document.createElement('button');
    card.className = 'card';
    card.style.position = 'relative';
    card.style.textAlign = 'left';

    let ingredients = [];
    let count = 1;

    while (true) {
        const ingredient = drink[`strIngredient${count}`];
        const measure = drink[`strMeasure${count}`];
        if (!ingredient) break;
        ingredients.push(`${measure ? measure.trim() : ''} ${ingredient}`.trim());
        count++;
    }

    //build img
    const img = document.createElement('img');
    //use local store
    if (local.includes(drink.strDrink)) {
        img.src = "../assets/bookmarkPurple.png";
    } else {
        img.src = "../assets/bookmarkGray.png";
    }
    img.style.width = '30px';
    img.style.position = 'absolute';
    img.style.top = '10px';
    img.style.right = '10px';

    //build card
    card.innerHTML = `
        <h3 style="margin-left:10px">${drink.strDrink}</h3>
        <p style="margin-left:20px"><strong>Ingredients:</strong> ${ingredients.join(', ')}</p>
    `;
    card.appendChild(img);

    card.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('drinkModal'));
        document.getElementById('drinkModalLabel').textContent = drink.strDrink;
        document.getElementById('drinkImage').src = drink.strDrinkThumb;
        document.getElementById('drinkInstructions').textContent = drink.strInstructions;
        modal.show();
    });

    img.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (card.parentNode) card.parentNode.removeChild(card);
        handleLocal(drink.strDrink);
        local = JSON.parse(localStorage.getItem("saved")) || [];
    });

    resultsDiv.appendChild(card);
  });
}

window.addEventListener('DOMContentLoaded', loadSavedDrinks);

function loadSavedDrinks() {
    if (local.length === 0) {
        resultsDiv.innerHTML = '<p>No saved drinks.</p>';
        return;
    }
    // Fetch each saved drink and append results (don't clear existing results each time)
    local.forEach(drinkName => fetchCocktailByName(drinkName));
}

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query !== '') {
        fetchCocktails(query);
    }
    resultsDiv.innerHTML = "";
});

async function fetchCocktails(query) {
    try {
        const res = await fetch(BASE_URL + encodeURIComponent(query));
        const data = await res.json();
        if (!data.drinks) {
        resultsDiv.innerHTML = '<p>No drinks found.</p>';
        return;
        }
        const common = data.drinks.filter(drink => local.includes(drink.strDrink));
        displayCocktails(common);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function fetchCocktailByName(name) {
    try {
        const res = await fetch(BASE_URL + encodeURIComponent(name));
        const data = await res.json();
        if (data.drinks) {
        // Append the returned drinks for saved page instead of replacing the whole results area
        displaySavedDrinks(data.drinks);
        }
    } catch (error) {
        console.error("Error fetching saved drink:", error);
    }
}

function displayCocktails(drinks) {
    // When used from search, replace results. Saved page uses displaySavedDrinks which appends.
    resultsDiv.innerHTML = '';
    if (!drinks) {
        resultsDiv.innerHTML = '<p>No drinks found</p>';
        return;
    }

    drinks.forEach(drink => {
    const card = document.createElement('button');
    card.className = 'card';
    card.style.position = 'relative';
    card.style.textAlign = 'left';

    let ingredients = [];
    let count = 1;

    while (true) {
        const ingredient = drink[`strIngredient${count}`];
        const measure = drink[`strMeasure${count}`];
        if (!ingredient) break;
        ingredients.push(`${measure ? measure.trim() : ''} ${ingredient}`.trim());
        count++;
    }

    //build img
    const img = document.createElement('img');
    //use local store
    if (local.includes(drink.strDrink)) {
        img.src = "../assets/bookmarkPurple.png";
    } else {
        img.src = "../assets/bookmarkGray.png";
    }
    img.style.width = '30px';
    img.style.position = 'absolute';
    img.style.top = '10px';
    img.style.right = '10px';

    //build card
    card.innerHTML = `
        <h3 style="margin-left:10px">${drink.strDrink}</h3>
        <p style="margin-left:20px"><strong>Ingredients:</strong> ${ingredients.join(', ')}</p>
    `;
    card.appendChild(img);

    card.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('drinkModal'));
        document.getElementById('drinkModalLabel').textContent = drink.strDrink;
        document.getElementById('drinkImage').src = drink.strDrinkThumb;
        document.getElementById('drinkInstructions').textContent = drink.strInstructions;
        modal.show();
    });

    img.addEventListener('click', (ev) => {
        ev.stopPropagation();
        // Remove from DOM and from localStorage
        if (card.parentNode) card.parentNode.removeChild(card);
        handleLocal(drink.strDrink);
        // Keep local variable in sync
        local = JSON.parse(localStorage.getItem("saved")) || [];
    });

    resultsDiv.appendChild(card);
  });
}

//if no local storage, create it
//if drink in local storage
  // remove
//else add it
function handleLocal(drink) {
    let curr = JSON.parse(localStorage.getItem("saved")) || [];

    if (curr.includes(drink)) {
        // remove drink
        curr = curr.filter(d => d !== drink);
        localStorage.setItem("saved", JSON.stringify(curr));
        return 0;
    } else {
        // add drink
        curr.push(drink);
        localStorage.setItem("saved", JSON.stringify(curr));
        return 1;
    }
}
