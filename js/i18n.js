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


