const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');
const settingsBtn = document.getElementById("settings")

// Listen for changes on theme select using event delegation
document.addEventListener('change', function(e) {
    if (e.target.id === 'themeSelect') {
        const newTheme = e.target.value;
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    }
    if (e.target.id === 'cardViewSelect') {
        const newView = e.target.value;
        localStorage.setItem('cardView', newView);
        applyCardView(newView);
    }
});

// Load settings from localStorage on page load
function loadSettings() {
    const themeSelect = document.getElementById('themeSelect');
    const cardViewSelect = document.getElementById('cardViewSelect');
    
  // loadSettings reads saved values and applies them
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedCardView = localStorage.getItem('cardView') || 'grid';
    
  // apply saved settings (or defaults)
    
    if (themeSelect) {
        themeSelect.value = savedTheme;
    }
    if (cardViewSelect) {
        cardViewSelect.value = savedCardView;
    }
    
    applyTheme(savedTheme);
    applyCardView(savedCardView);
}

// Apply theme changes
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Apply card view changes
function applyCardView(view) {
    resultsDiv.setAttribute('data-card-view', view);
}

// Restore defaults button
const restoreDefaultsBtn = document.getElementById('restoreDefaultsBtn');
if (restoreDefaultsBtn) {
  restoreDefaultsBtn.addEventListener('click', () => {
    // Restore defaults: set theme to dark and card view to grid
    localStorage.setItem('theme', 'dark');
    applyTheme('dark');

    localStorage.setItem('cardView', 'grid');
    applyCardView('grid');

    // Update selects in the modal if present
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = 'dark';
    const cardViewSelect = document.getElementById('cardViewSelect');
    if (cardViewSelect) cardViewSelect.value = 'grid';

    // Close the modal
    const modalEl = document.getElementById('settingModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
  });
}

// Load settings when page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    loadSettings();
});

settingsBtn.addEventListener('click', () => {
    console.log('Settings clicked');
    const modal = new bootstrap.Modal(document.getElementById('settingModal'));
    modal.show();
});

// Handle search functionality
function handleSearch() {
    const query = searchInput.value.trim();
    if (query !== '') {
        fetchCocktails(query);
    }
}

const BASE_URL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`;

let local = JSON.parse(localStorage.getItem("saved"));
// Ensure `local` is an array so later `includes` checks won't throw.
if (!Array.isArray(local)) {
  local = [];
  localStorage.setItem("saved", JSON.stringify(local));
}

// Add both click and keyboard (Enter) event handlers for search
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission if within a form
        handleSearch();
    }
});

async function fetchCocktails(query) {
  try {
    const res = await fetch(BASE_URL + encodeURIComponent(query));
    const data = await res.json();
    displayCocktails(data.drinks);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayCocktails(drinks) {
  resultsDiv.innerHTML = '';
  if (!drinks) {
    resultsDiv.innerHTML = '<p>No drinks found</p>';
    return;
  }

  drinks.forEach(drink => {
  const card = document.createElement('button');
  card.className = 'card';

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
  let img = document.createElement('img');
  //use local storage
  if (local.includes(drink.strDrink)) {
    img.src = "assets/bookmarkPurple.png";
  } else {
    img.src = "assets/bookmarkGray.png";
  }
  img.style.width = '30px';
  img.style.position = 'absolute';
  img.style.top = '10px';
  img.style.right = '10px';
  
  //build card
  card.innerHTML = `
  <h3 style="margin-left:10px">${drink.strDrink}</h3>
  <p style="margin-left:20px"><strong>Ingredients:</strong>
  ${ingredients.join(', ')}</p>
  `;
  card.appendChild(img);

  card.addEventListener('click', () => {
      const modal = new bootstrap.Modal(document.getElementById('drinkModal'));
      document.getElementById('drinkModalLabel').textContent = drink.strDrink;
      document.getElementById('drinkImage').src = drink.strDrinkThumb;
      document.getElementById('drinkInstructions').textContent = drink.strInstructions;
      modal.show();
    });

  // Immediate visual feedback for pointer/touch interactions
  img.addEventListener('pointerdown', (ev) => {
    ev.stopPropagation();
    img.classList.add('pressed');
  });
  const clearPressed = (ev) => { ev.stopPropagation(); img.classList.remove('pressed'); };
  img.addEventListener('pointerup', clearPressed);
  img.addEventListener('pointercancel', clearPressed);
  img.addEventListener('pointerleave', clearPressed);

  img.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const result = handleLocal(drink.strDrink);
    if (result == 0) {
      img.src = "assets/bookmarkGray.png";
    } else {
      img.src = "assets/bookmarkPurple.png";
    }
    // keep the local variable in sync with localStorage
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

//