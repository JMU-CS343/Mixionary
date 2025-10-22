const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');

const BASE_URL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`;

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query !== '') {
    fetchCocktails(query);
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
    resultsDiv.innerHTML = '<p>No drinks found 😢</p>';
    return;
  }

  drinks.forEach(drink => {
  const card = document.createElement('button');
  card.className = 'card';
  card.setAttribute('data-bs-toggle', 'modal');
  card.setAttribute('data-bs-target', '#drinkModal');

  let ingredients = [];
  let count = 1;

  while (true) {
    const ingredient = drink[`strIngredient${count}`];
    const measure = drink[`strMeasure${count}`];
    if (!ingredient) break;
    ingredients.push(`${measure ? measure.trim() : ''} ${ingredient}`.trim());
    count++;
  }

  card.innerHTML = `
    <h3 style="margin-left:10px">${drink.strDrink}</h3>
    <p style="margin-left:20px"><strong>Ingredients:</strong>
    ${ingredients.join(', ')}</p>
    <img src="assets/bookmark.png"
      style="width:30px; position:absolute; top:10px; right:10px;">
  `;

  card.addEventListener('click', () => {
      document.getElementById('drinkModalLabel').textContent = drink.strDrink;
      document.getElementById('drinkImage').src = drink.strDrinkThumb;
      document.getElementById('drinkInstructions').textContent = drink.strInstructions;
    });
  
  resultsDiv.appendChild(card);
  });
}
