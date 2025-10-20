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
    const card = document.createElement('div');
    card.innerHTML = `
      <h3>${drink.strDrink}</h3>
    `;
    resultsDiv.appendChild(card);
  });
}
