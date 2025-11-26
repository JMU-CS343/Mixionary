// Load theme and language on startup
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) themeSelect.value = savedTheme;

  // Apply language-specific UI to help page
  applyLanguageToPage('main');
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
  });
}
