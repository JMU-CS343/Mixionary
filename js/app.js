const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');

const BASE_URL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`;

let local = JSON.parse(localStorage.getItem("saved"));
if (local == null) {
  localStorage.setItem("saved", JSON.stringify(local));
}

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

  img.addEventListener('click', (ev) => {
    ev.stopPropagation();
    if (handleLocal(drink.strDrink) == 0) {
      img.src = "assets/bookmarkGray.png";
    } else {
      img.src = "assets/bookmarkPurple.png";
    }
  })
  
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