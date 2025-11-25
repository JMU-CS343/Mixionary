const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');
const settingsBtn = document.getElementById('settings');
const loadMoreBtn = document.getElementById('loadMoreButton');

const DEFAULT_CARD_AMOUNT = '10';
const BASE_URL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`;

let local = JSON.parse(localStorage.getItem('saved'));
if (!Array.isArray(local)) {
  local = [];
  localStorage.setItem('saved', JSON.stringify(local));
}

let allDrinks = [];
let displayedCount = 0;

document.addEventListener('change', (e) => {
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
  if (e.target.id === 'cardAmountSelect') {
    const newAmount = e.target.value;
    localStorage.setItem('cardAmount', newAmount);
    if (allDrinks.length) {
      resetDisplayedResults();
      resultsDiv.innerHTML = '';
      renderNextBatch();
    } else {
      updateLoadMoreVisibility();
    }
  }
});

function loadSettings() {
  const themeSelect = document.getElementById('themeSelect');
  const cardViewSelect = document.getElementById('cardViewSelect');
  const cardAmountSelect = document.getElementById('cardAmountSelect');

  const savedTheme = localStorage.getItem('theme') || 'dark';
  const savedCardView = localStorage.getItem('cardView') || 'grid';
  const savedCardAmount = localStorage.getItem('cardAmount') || DEFAULT_CARD_AMOUNT;

  if (themeSelect) themeSelect.value = savedTheme;
  if (cardViewSelect) cardViewSelect.value = savedCardView;
  if (cardAmountSelect) cardAmountSelect.value = savedCardAmount;

  applyTheme(savedTheme);
  applyCardView(savedCardView);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function applyCardView(view) {
  resultsDiv.setAttribute('data-card-view', view);
}

const restoreDefaultsBtn = document.getElementById('restoreDefaultsBtn');
if (restoreDefaultsBtn) {
  restoreDefaultsBtn.addEventListener('click', () => {
    localStorage.setItem('theme', 'dark');
    applyTheme('dark');

    localStorage.setItem('cardView', 'grid');
    applyCardView('grid');

    localStorage.setItem('cardAmount', DEFAULT_CARD_AMOUNT);
    if (document.getElementById('themeSelect')) document.getElementById('themeSelect').value = 'dark';
    if (document.getElementById('cardViewSelect')) document.getElementById('cardViewSelect').value = 'grid';
    if (document.getElementById('cardAmountSelect')) document.getElementById('cardAmountSelect').value = DEFAULT_CARD_AMOUNT;

    resetDisplayedResults();
    if (allDrinks.length) {
      resultsDiv.innerHTML = '';
      renderNextBatch();
    } else {
      updateLoadMoreVisibility();
    }

    const modalEl = document.getElementById('settingModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadSavedDrinks();
});

if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('settingModal'));
    modal.show();
  });
}

function handleSearch() {
  const query = searchInput.value.trim();
  if (query === '') {
    loadSavedDrinks();
    return;
  }
  fetchCocktails(query);
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSearch();
  }
});

async function loadSavedDrinks() {
  local = JSON.parse(localStorage.getItem('saved')) || [];
  if (!local.length) {
    setCurrentDrinks([], '<p>No saved drinks.</p>');
    return;
  }

  try {
    const drinkLists = await Promise.all(local.map(fetchCocktailByName));
    const flattened = drinkLists.flat().filter(Boolean);
    setCurrentDrinks(flattened, '<p>No saved drinks.</p>');
  } catch (error) {
    console.error('Error loading saved drinks:', error);
    setCurrentDrinks([], '<p>Unable to load saved drinks.</p>');
  }
}

async function fetchCocktails(query) {
  try {
    const res = await fetch(BASE_URL + encodeURIComponent(query));
    const data = await res.json();
    if (!data.drinks) {
      setCurrentDrinks([], '<p>No matching saved drinks.</p>');
      return;
    }
    const common = data.drinks.filter((drink) => local.includes(drink.strDrink));
    setCurrentDrinks(common, '<p>No matching saved drinks.</p>');
  } catch (error) {
    console.error('Error fetching data:', error);
    setCurrentDrinks([], '<p>Unable to search saved drinks.</p>');
  }
}

async function fetchCocktailByName(name) {
  try {
    const res = await fetch(BASE_URL + encodeURIComponent(name));
    const data = await res.json();
    return data.drinks || [];
  } catch (error) {
    console.error('Error fetching saved drink:', error);
    return [];
  }
}

function setCurrentDrinks(drinks, emptyMessage) {
  allDrinks = Array.isArray(drinks) ? drinks : [];
  resetDisplayedResults();
  resultsDiv.innerHTML = '';

  if (!allDrinks.length) {
    resultsDiv.innerHTML = emptyMessage || '<p>No results.</p>';
    updateLoadMoreVisibility();
    return;
  }

  renderNextBatch();
}

function renderNextBatch() {
  if (!allDrinks.length) {
    updateLoadMoreVisibility();
    return;
  }

  const cardAmountSetting = getCardAmountSetting();
  const batchSize = cardAmountSetting === 'ALL' ? allDrinks.length : Math.max(parseInt(cardAmountSetting, 10) || 0, 0);

  if (batchSize === 0) {
    updateLoadMoreVisibility();
    return;
  }

  const nextDrinks = allDrinks.slice(displayedCount, displayedCount + batchSize);
  nextDrinks.forEach((drink) => {
    const card = createDrinkCard(drink);
    resultsDiv.appendChild(card);
  });
  displayedCount += nextDrinks.length;
  updateLoadMoreVisibility();
}

function createDrinkCard(drink) {
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

  const img = document.createElement('img');
  img.src = local.includes(drink.strDrink) ? '../assets/bookmarkPurple.png' : '../assets/bookmarkGray.png';

  card.innerHTML = `
    <h3 style="margin-left:10px">${drink.strDrink}</h3>
    <p style="margin-left:20px"><strong>Ingredients:</strong> ${ingredients.join(', ')}</p>
  `;
  card.appendChild(img);

  card.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('drinkModal'));
    document.getElementById('drinkModalLabel').textContent = drink.strDrink;
    const imgEl = document.getElementById('drinkImage');
    imgEl.src = drink.strDrinkThumb;
    imgEl.alt = `Photo of ${drink.strDrink}`;
    document.getElementById('drinkInstructions').textContent = drink.strInstructions;
    modal.show();
  });

  img.addEventListener('pointerdown', (ev) => {
    ev.stopPropagation();
    img.classList.add('pressed');
  });
  const clearPressed = (ev) => {
    ev.stopPropagation();
    img.classList.remove('pressed');
  };
  img.addEventListener('pointerup', clearPressed);
  img.addEventListener('pointercancel', clearPressed);
  img.addEventListener('pointerleave', clearPressed);

  img.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const result = handleLocal(drink.strDrink);
    img.src = result === 0 ? '../assets/bookmarkGray.png' : '../assets/bookmarkPurple.png';
    local = JSON.parse(localStorage.getItem('saved')) || [];
    if (result === 0) {
      allDrinks = allDrinks.filter((d) => d.strDrink !== drink.strDrink);
      if (!allDrinks.length) {
        resultsDiv.innerHTML = '<p>No saved drinks.</p>';
        resetDisplayedResults();
        updateLoadMoreVisibility();
      } else {
        resultsDiv.innerHTML = '';
        resetDisplayedResults();
        renderNextBatch();
      }
    }
  });

  return card;
}

function updateLoadMoreVisibility() {
  if (!loadMoreBtn) return;

  const cardAmountSetting = getCardAmountSetting();
  const shouldHide = !allDrinks.length || cardAmountSetting === 'ALL' || displayedCount >= allDrinks.length;

  loadMoreBtn.style.display = shouldHide ? 'none' : 'block';
}

function resetDisplayedResults() {
  displayedCount = 0;
}

function getCardAmountSetting() {
  return localStorage.getItem('cardAmount') || DEFAULT_CARD_AMOUNT;
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', renderNextBatch);
}

function handleLocal(drink) {
  let curr = JSON.parse(localStorage.getItem('saved')) || [];

  if (curr.includes(drink)) {
    curr = curr.filter((d) => d !== drink);
    localStorage.setItem('saved', JSON.stringify(curr));
    return 0;
  } else {
    curr.push(drink);
    localStorage.setItem('saved', JSON.stringify(curr));
    return 1;
  }
}
