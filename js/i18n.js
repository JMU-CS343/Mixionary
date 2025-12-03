// Simple client-side internationalization helper
// Stores language in localStorage and exposes helpers to get current language
// and translated strings for both the search (index) and saved pages.

const SUPPORTED_LANGUAGES = ['en', 'es', 'fr'];
const DEFAULT_LANGUAGE = 'en';

// Shared translation strings
const I18N_STRINGS = {
  en: {
    code: 'en',
    ui: {
      languageLabel: 'Language:',
      header: {
        title: 'Mix-ionary',
        help: 'Help',
        saved: 'Saved',
        search: 'Search',
      },
      searchPlaceholderMain: 'Search for a cocktail',
      searchPlaceholderSaved: 'Search for saved',
      loadMoreResults: 'Load More Results',
      loadMoreSaved: 'Load More Saved',
      settingsNote:
        "Note: settings are stored locally in your browser and are specific to this site (they won't transfer between different domains or devices).",
    },
    messages: {
      noDrinksFound: 'No drinks found',
      wifiError: 'Wifi error, please reconnect and try again.',
      noSavedDrinks: 'No saved drinks.',
      noMatchingSaved: 'No matching saved drinks.',
      unableToLoadSaved: 'Unable to load saved drinks.',
      unableToSearchSaved: 'Unable to search saved drinks.',
    },
    cocktailInstructionsField: 'strInstructions',
    help: {
      searchHeading: 'Search:',
      searchHowToUse: 'How To Use:',
      searchHowToUseText: 'To use the search feature, you first need to click into the search box. Then you need to type in an ingredient into the search box that you would like to search up. Then click the search button on the right or press enter. If there are drinks that have that ingredient you searched, they will be displayed below. You can scroll if there are a lot of drinks that have that ingredient or you can choose in the settings, how many drinks to display on the screen. You can also click on the drink to preview a picture of it and a description on how to make it.',
      searchFAQs: 'FAQs:',
      searchQ1: 'Q: How do I save drinks for later?',
      searchA1: 'A: You will press the flag in the top right of the drink display so that the color is purple, which means that drink is saved for later.',
      searchQ2: 'Q: Can I search up more than one ingredient at a time?',
      searchA2: 'A: No, you can not search up more than one ingredient at a time.',
      searchQ3: 'Q: What if there are no results when I search up my ingredient?',
      searchA3: 'A: That is because there are no drinks containing that ingredient in our database.',
      savedHeading: 'Saved:',
      savedHowToUse: 'How To Use:',
      savedHowToUseText: 'There are multiple ways to use the Saved page. You can edit your saved drinks by removing them from your saved by clicking the purple flag in the top right. You can also search from your list of saved drinks. All you have to do is click into the search box and type in an ingredient you would like to search for. Then you can hit enter or the search icon on the right. You can also click on the saved drink to see a picture and a description on how to make it. If you search up an ingredient and there are no drinks that appear below, that means you have not saved any drinks with that ingredient.',
      savedFAQs: 'FAQs:',
      savedQ1: 'Q: Why did no drinks come up after I searched for an ingredient?',
      savedA1: 'A: The reason no drinks came up when searching that ingredient, is because you have no drinks saved that have that ingredient.',
      savedQ2: 'Q: How do I go back to see all of my saved drinks?',
      savedA2: 'A: All you need to do is go to the search box and click into it. Then delete the searched ingredient from the search box and then hit enter or the search icon on the right.',
      savedQ3: 'Q: How do I remove saved drinks?',
      savedA3: 'A: To remove saved drinks, just click the purple flag in the top right, and it will get removed from your saved.',
      helpHeading: 'Help:',
      helpHowToUse: 'How To Use:',
      helpHowToUseText: 'You can use the scroll bar on the right to go up and down to view the help page that includes helpful information about the other pages. The information that you can see about the other pages is how to use each page. You can also see FAQs about each page with answers right below to the questions.',
      chooseTheme: 'Choose Theme:',
      light: 'Light',
      dark: 'Dark',
      restoreDefaults: 'Restore Defaults',
    },
  },
  es: {
    code: 'es',
    ui: {
      languageLabel: 'Idioma:',
      header: {
        title: 'Mix-ionary',
        help: 'Ayuda',
        saved: 'Guardados',
        search: 'Buscar',
      },
      searchPlaceholderMain: 'Buscar un cóctel',
      searchPlaceholderSaved: 'Buscar guardados',
      loadMoreResults: 'Mostrar más resultados',
      loadMoreSaved: 'Mostrar más guardados',
      settingsNote:
        'Nota: la configuración se guarda localmente en tu navegador y es específica de este sitio (no se transfiere entre dominios ni dispositivos).',
    },
    messages: {
      noDrinksFound: 'No se encontraron bebidas',
      wifiError: 'Error de wifi, vuelve a conectarte e inténtalo de nuevo.',
      noSavedDrinks: 'No hay bebidas guardadas.',
      noMatchingSaved: 'No hay bebidas guardadas que coincidan.',
      unableToLoadSaved: 'No se pueden cargar las bebidas guardadas.',
      unableToSearchSaved: 'No se pueden buscar las bebidas guardadas.',
    },
    cocktailInstructionsField: 'strInstructionsES',
    help: {
      searchHeading: 'Buscar:',
      searchHowToUse: 'Cómo usar:',
      searchHowToUseText: 'Para usar la función de búsqueda, primero debe hacer clic en el cuadro de búsqueda. Luego debe escribir un ingrediente en el cuadro de búsqueda que le gustaría buscar. Luego haga clic en el botón de búsqueda a la derecha o presione enter. Si hay bebidas que tienen ese ingrediente que buscó, se mostrarán a continuación. Puede desplazarse si hay muchas bebidas que tienen ese ingrediente o puede elegir en la configuración cuántas bebidas mostrar en la pantalla. También puede hacer clic en la bebida para obtener una vista previa de una imagen y una descripción de cómo prepararla.',
      searchFAQs: 'Preguntas frecuentes:',
      searchQ1: 'P: ¿Cómo guardo bebidas para más tarde?',
      searchA1: 'R: Presionará la bandera en la parte superior derecha de la visualización de la bebida para que el color sea morado, lo que significa que esa bebida está guardada para más tarde.',
      searchQ2: 'P: ¿Puedo buscar más de un ingrediente a la vez?',
      searchA2: 'R: No, no puede buscar más de un ingrediente a la vez.',
      searchQ3: 'P: ¿Qué pasa si no hay resultados cuando busco mi ingrediente?',
      searchA3: 'R: Eso es porque no hay bebidas que contengan ese ingrediente en nuestra base de datos.',
      savedHeading: 'Guardados:',
      savedHowToUse: 'Cómo usar:',
      savedHowToUseText: 'Hay múltiples formas de usar la página Guardados. Puede editar sus bebidas guardadas eliminándolas de sus guardados haciendo clic en la bandera morada en la parte superior derecha. También puede buscar en su lista de bebidas guardadas. Todo lo que tiene que hacer es hacer clic en el cuadro de búsqueda y escribir un ingrediente que le gustaría buscar. Luego puede presionar enter o el icono de búsqueda a la derecha. También puede hacer clic en la bebida guardada para ver una imagen y una descripción de cómo prepararla. Si busca un ingrediente y no hay bebidas que aparezcan a continuación, eso significa que no ha guardado ninguna bebida con ese ingrediente.',
      savedFAQs: 'Preguntas frecuentes:',
      savedQ1: 'P: ¿Por qué no aparecieron bebidas después de buscar un ingrediente?',
      savedA1: 'R: La razón por la que no aparecieron bebidas al buscar ese ingrediente es porque no tiene bebidas guardadas que tengan ese ingrediente.',
      savedQ2: 'P: ¿Cómo vuelvo a ver todas mis bebidas guardadas?',
      savedA2: 'R: Todo lo que necesita hacer es ir al cuadro de búsqueda y hacer clic en él. Luego elimine el ingrediente buscado del cuadro de búsqueda y luego presione enter o el icono de búsqueda a la derecha.',
      savedQ3: 'P: ¿Cómo elimino las bebidas guardadas?',
      savedA3: 'R: Para eliminar las bebidas guardadas, simplemente haga clic en la bandera morada en la parte superior derecha y se eliminará de sus guardados.',
      helpHeading: 'Ayuda:',
      helpHowToUse: 'Cómo usar:',
      helpHowToUseText: 'Puede usar la barra de desplazamiento a la derecha para subir y bajar para ver la página de ayuda que incluye información útil sobre las otras páginas. La información que puede ver sobre las otras páginas es cómo usar cada página. También puede ver preguntas frecuentes sobre cada página con respuestas justo debajo de las preguntas.',
      chooseTheme: 'Elegir tema:',
      light: 'Claro',
      dark: 'Oscuro',
      restoreDefaults: 'Restaurar valores predeterminados',
    },
  },
  fr: {
    code: 'fr',
    ui: {
      languageLabel: 'Langue :',
      header: {
        title: 'Mix-ionary',
        help: 'Aide',
        saved: 'Enregistrés',
        search: 'Rechercher',
      },
      searchPlaceholderMain: 'Rechercher un cocktail',
      searchPlaceholderSaved: 'Rechercher dans les sauvegardes',
      loadMoreResults: 'Charger plus de résultats',
      loadMoreSaved: 'Charger plus de sauvegardes',
      settingsNote:
        'Remarque : les paramètres sont stockés localement dans votre navigateur et sont propres à ce site (ils ne sont pas transférés entre domaines ou appareils).',
    },
    messages: {
      noDrinksFound: 'Aucune boisson trouvée',
      wifiError: 'Erreur de connexion, veuillez vous reconnecter et réessayer.',
      noSavedDrinks: 'Aucune boisson enregistrée.',
      noMatchingSaved: "Aucune boisson enregistrée ne correspond.",
      unableToLoadSaved: "Impossible de charger les boissons enregistrées.",
      unableToSearchSaved: "Impossible de rechercher dans les boissons enregistrées.",
    },
    cocktailInstructionsField: 'strInstructionsFR',
    help: {
      searchHeading: 'Rechercher :',
      searchHowToUse: 'Comment utiliser :',
      searchHowToUseText: 'Pour utiliser la fonction de recherche, vous devez d\'abord cliquer dans la zone de recherche. Ensuite, vous devez taper un ingrédient dans la zone de recherche que vous souhaitez rechercher. Ensuite, cliquez sur le bouton de recherche à droite ou appuyez sur entrée. S\'il y a des boissons qui contiennent cet ingrédient que vous avez recherché, elles seront affichées ci-dessous. Vous pouvez faire défiler s\'il y a beaucoup de boissons qui ont cet ingrédient ou vous pouvez choisir dans les paramètres combien de boissons afficher à l\'écran. Vous pouvez également cliquer sur la boisson pour prévisualiser une image et une description sur la façon de la préparer.',
      searchFAQs: 'FAQ :',
      searchQ1: 'Q : Comment puis-je enregistrer des boissons pour plus tard ?',
      searchA1: 'R : Vous appuierez sur le drapeau en haut à droite de l\'affichage de la boisson pour que la couleur soit violette, ce qui signifie que cette boisson est enregistrée pour plus tard.',
      searchQ2: 'Q : Puis-je rechercher plus d\'un ingrédient à la fois ?',
      searchA2: 'R : Non, vous ne pouvez pas rechercher plus d\'un ingrédient à la fois.',
      searchQ3: 'Q : Que se passe-t-il s\'il n\'y a pas de résultats lorsque je recherche mon ingrédient ?',
      searchA3: 'R : C\'est parce qu\'il n\'y a pas de boissons contenant cet ingrédient dans notre base de données.',
      savedHeading: 'Enregistrés :',
      savedHowToUse: 'Comment utiliser :',
      savedHowToUseText: 'Il existe plusieurs façons d\'utiliser la page Enregistrés. Vous pouvez modifier vos boissons enregistrées en les supprimant de vos enregistrements en cliquant sur le drapeau violet en haut à droite. Vous pouvez également rechercher dans votre liste de boissons enregistrées. Tout ce que vous avez à faire est de cliquer dans la zone de recherche et de taper un ingrédient que vous souhaitez rechercher. Ensuite, vous pouvez appuyer sur entrée ou sur l\'icône de recherche à droite. Vous pouvez également cliquer sur la boisson enregistrée pour voir une image et une description sur la façon de la préparer. Si vous recherchez un ingrédient et qu\'il n\'y a pas de boissons qui apparaissent ci-dessous, cela signifie que vous n\'avez enregistré aucune boisson avec cet ingrédient.',
      savedFAQs: 'FAQ :',
      savedQ1: 'Q : Pourquoi aucune boisson n\'est apparue après avoir recherché un ingrédient ?',
      savedA1: 'R : La raison pour laquelle aucune boisson n\'est apparue lors de la recherche de cet ingrédient est que vous n\'avez aucune boisson enregistrée qui contient cet ingrédient.',
      savedQ2: 'Q : Comment puis-je revenir pour voir toutes mes boissons enregistrées ?',
      savedA2: 'R : Tout ce que vous devez faire est d\'aller à la zone de recherche et de cliquer dessus. Ensuite, supprimez l\'ingrédient recherché de la zone de recherche, puis appuyez sur entrée ou sur l\'icône de recherche à droite.',
      savedQ3: 'Q : Comment puis-je supprimer les boissons enregistrées ?',
      savedA3: 'R : Pour supprimer les boissons enregistrées, cliquez simplement sur le drapeau violet en haut à droite, et elles seront supprimées de vos enregistrements.',
      helpHeading: 'Aide :',
      helpHowToUse: 'Comment utiliser :',
      helpHowToUseText: 'Vous pouvez utiliser la barre de défilement à droite pour monter et descendre pour voir la page d\'aide qui comprend des informations utiles sur les autres pages. Les informations que vous pouvez voir sur les autres pages concernent la façon d\'utiliser chaque page. Vous pouvez également voir des FAQ sur chaque page avec des réponses juste en dessous des questions.',
      chooseTheme: 'Choisir le thème :',
      light: 'Clair',
      dark: 'Sombre',
      restoreDefaults: 'Restaurer les valeurs par défaut',
    },
  },
};

function getStoredLanguage() {
  const stored = localStorage.getItem('language');
  if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
    return stored;
  }
  // fall back to browser language if compatible
  const browserLang = (navigator.language || navigator.userLanguage || 'en')
    .slice(0, 2)
    .toLowerCase();
  if (SUPPORTED_LANGUAGES.includes(browserLang)) {
    return browserLang;
  }
  return DEFAULT_LANGUAGE;
}

function setStoredLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    lang = DEFAULT_LANGUAGE;
  }
  localStorage.setItem('language', lang);
}

function getCurrentLanguage() {
  const lang = getStoredLanguage();
  return SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
}

function getI18nBundle() {
  const lang = getCurrentLanguage();
  return I18N_STRINGS[lang] || I18N_STRINGS[DEFAULT_LANGUAGE];
}

function getInstructionFieldForLanguage() {
  const bundle = getI18nBundle();
  return bundle.cocktailInstructionsField || 'strInstructions';
}

// Apply language-dependent UI for a given page type ("main" or "saved")
function applyLanguageToPage(pageType) {
  const bundle = getI18nBundle();

  // Set HTML lang attribute
  document.documentElement.setAttribute('lang', bundle.code || 'en');

  const languageDropdown = document.getElementById('language-dropdown');
  if (languageDropdown) {
    // Normalize stored code to visible value
    if (bundle.code === 'en') languageDropdown.value = 'English';
    if (bundle.code === 'es') languageDropdown.value = 'Spanish';
    if (bundle.code === 'fr') languageDropdown.value = 'French';
  }

  const languageLabel = document.querySelector('label[for="language-dropdown"]');
  if (languageLabel) {
    languageLabel.textContent = bundle.ui.languageLabel;
  }

  // Header buttons
  const titleBtn = document.getElementById('title');
  if (titleBtn) {
    const img = titleBtn.querySelector('img');
    titleBtn.textContent = bundle.ui.header.title;
    if (img) {
      titleBtn.appendChild(img);
    }
  }
  const helpBtn = document.getElementById('help');
  if (helpBtn) {
    helpBtn.textContent = bundle.ui.header.help;
  }
  const savedBtn = document.getElementById('saved');
  if (savedBtn) {
    savedBtn.textContent = bundle.ui.header.saved;
  }
  const searchBtn = document.getElementById('search');
  if (searchBtn) {
    searchBtn.textContent = bundle.ui.header.search;
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder =
      pageType === 'saved'
        ? bundle.ui.searchPlaceholderSaved
        : bundle.ui.searchPlaceholderMain;
  }

  const loadMoreBtn = document.getElementById('loadMoreButton');
  if (loadMoreBtn) {
    loadMoreBtn.textContent =
      pageType === 'saved'
        ? bundle.ui.loadMoreSaved
        : bundle.ui.loadMoreResults;
  }

  const settingsNote = document.querySelector('.settings-note');
  if (settingsNote) {
    settingsNote.textContent = bundle.ui.settingsNote;
  }
}


