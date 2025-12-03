// Load theme and language on startup
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) themeSelect.value = savedTheme;

  // Apply language-specific UI to help page
  applyLanguageToPage('main');
  applyHelpPageTranslations();
});

// Theme change handler
document.addEventListener('change', (e) => {
  if (e.target.id === 'themeSelect') {
    const newTheme = e.target.value;
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }
  if (e.target.id === 'language-dropdown') {
    const dropdownValue = e.target.value;
    let langCode = 'en';
    if (dropdownValue === 'Spanish') langCode = 'es';
    if (dropdownValue === 'French') langCode = 'fr';
    setStoredLanguage(langCode);
    applyLanguageToPage('main');
    applyHelpPageTranslations();
  }
});

// Apply theme to <html>
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// Restore default button
const restoreDefaultsBtn = document.getElementById('restoreDefaultsBtn');
if (restoreDefaultsBtn) {
  restoreDefaultsBtn.addEventListener('click', () => {
    localStorage.setItem('theme', 'dark');
    applyTheme('dark');

    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = 'dark';

    // Close modal if using Bootstrap
    const modalEl = document.getElementById('settingModal');
    if (modalEl && bootstrap) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
  });
}

// Settings button (optional)
const settingsBtn = document.getElementById('settings');
if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('settingModal'));
    modal.show();
    // Apply translations when modal opens
    applyHelpPageTranslations();
  });
}

// Apply help page translations
function applyHelpPageTranslations() {
  const bundle = getI18nBundle();
  if (!bundle.help) return;

  const help = bundle.help;

  // Search section
  const searchHeading = document.getElementById('searchHeading');
  if (searchHeading) searchHeading.textContent = help.searchHeading;

  const searchHowToUse = document.getElementById('searchHowToUse');
  if (searchHowToUse) searchHowToUse.textContent = help.searchHowToUse;

  const searchHowToUseText = document.getElementById('searchHowToUseText');
  if (searchHowToUseText) searchHowToUseText.textContent = help.searchHowToUseText;

  const searchFAQs = document.getElementById('searchFAQs');
  if (searchFAQs) searchFAQs.textContent = help.searchFAQs;

  const searchQ1 = document.getElementById('searchQ1');
  if (searchQ1) searchQ1.textContent = help.searchQ1;

  const searchA1 = document.getElementById('searchA1');
  if (searchA1) searchA1.textContent = help.searchA1;

  const searchQ2 = document.getElementById('searchQ2');
  if (searchQ2) searchQ2.textContent = help.searchQ2;

  const searchA2 = document.getElementById('searchA2');
  if (searchA2) searchA2.textContent = help.searchA2;

  const searchQ3 = document.getElementById('searchQ3');
  if (searchQ3) searchQ3.textContent = help.searchQ3;

  const searchA3 = document.getElementById('searchA3');
  if (searchA3) searchA3.textContent = help.searchA3;

  // Saved section
  const savedHeading = document.getElementById('savedHeading');
  if (savedHeading) savedHeading.textContent = help.savedHeading;

  const savedHowToUse = document.getElementById('savedHowToUse');
  if (savedHowToUse) savedHowToUse.textContent = help.savedHowToUse;

  const savedHowToUseText = document.getElementById('savedHowToUseText');
  if (savedHowToUseText) savedHowToUseText.textContent = help.savedHowToUseText;

  const savedFAQs = document.getElementById('savedFAQs');
  if (savedFAQs) savedFAQs.textContent = help.savedFAQs;

  const savedQ1 = document.getElementById('savedQ1');
  if (savedQ1) savedQ1.textContent = help.savedQ1;

  const savedA1 = document.getElementById('savedA1');
  if (savedA1) savedA1.textContent = help.savedA1;

  const savedQ2 = document.getElementById('savedQ2');
  if (savedQ2) savedQ2.textContent = help.savedQ2;

  const savedA2 = document.getElementById('savedA2');
  if (savedA2) savedA2.textContent = help.savedA2;

  const savedQ3 = document.getElementById('savedQ3');
  if (savedQ3) savedQ3.textContent = help.savedQ3;

  const savedA3 = document.getElementById('savedA3');
  if (savedA3) savedA3.textContent = help.savedA3;

  // Help section
  const helpHeading = document.getElementById('helpHeading');
  if (helpHeading) helpHeading.textContent = help.helpHeading;

  const helpHowToUse = document.getElementById('helpHowToUse');
  if (helpHowToUse) helpHowToUse.textContent = help.helpHowToUse;

  const helpHowToUseText = document.getElementById('helpHowToUseText');
  if (helpHowToUseText) helpHowToUseText.textContent = help.helpHowToUseText;

  // Settings modal
  const chooseThemeLabel = document.getElementById('chooseThemeLabel');
  if (chooseThemeLabel) chooseThemeLabel.textContent = help.chooseTheme;

  const lightOption = document.getElementById('lightOption');
  if (lightOption) lightOption.textContent = help.light;

  const darkOption = document.getElementById('darkOption');
  if (darkOption) darkOption.textContent = help.dark;

  const restoreDefaultsBtn = document.getElementById('restoreDefaultsBtn');
  if (restoreDefaultsBtn) restoreDefaultsBtn.textContent = help.restoreDefaults;
}
