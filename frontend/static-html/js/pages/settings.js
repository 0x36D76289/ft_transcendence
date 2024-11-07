import { setCookie } from '../utils/cookies.js';

export function render() {
  return `
    <div class="settings-container">
      <header class="settings-header">
        <h1>Paramètres</h1>
        <p class="settings-subtitle">Personnalisez votre expérience</p>
      </header>

      <div class="settings-grid">
        <!-- Apparence -->
        <section class="settings-section">
          <h2>Apparence</h2>
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <label for="theme">Thème</label>
                <span class="setting-description">Choisissez le thème de l'interface</span>
              </div>
              <select id="theme" class="setting-control">
                <option value="dark">Sombre</option>
                <option value="light">Clair</option>
              </select>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label for="accent">Couleur d'accent</label>
                <span class="setting-description">Couleur principale de l'interface</span>
              </div>
              <div class="color-picker">
                <input type="color" id="accent" value="#3245ff">
                <button id="reset-accent" class="button">Réinitialiser</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Notifications -->
        <section class="settings-section">
          <h2>Notifications</h2>
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-info">
                <label for="notifications">Notifications push</label>
                <span class="setting-description">Recevoir des notifications</span>
              </div>
              <label class="switch">
                <input type="checkbox" id="notifications">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- Bouton Réinitialiser -->
        <div class="settings-actions">
          <button id="reset-settings" class="button">Réinitialiser</button>
        </div>
      </div>
    </div>
  `;
}

const DEFAULT_SETTINGS = {
  theme: 'dark',
  accentColor: '#3245ff',
  notifications: false
};

function saveSettings(settings) {
  localStorage.setItem('userSettings', JSON.stringify(settings));
  setCookie('theme', settings.theme, 365);
}

function loadSettings() {
  const savedSettings = localStorage.getItem('userSettings');
  return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector('#theme').value = theme;
}

function applyAccentColor(color) {
  document.documentElement.style.setProperty('--accent-color', color);
  document.querySelector('#accent').value = color;
}

async function handleNotifications(enabled) {
  if (enabled) {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }
  return enabled;
}

export function init() {
  const currentSettings = loadSettings();

  applyTheme(currentSettings.theme);
  applyAccentColor(currentSettings.accentColor);
  document.querySelector('#notifications').checked = currentSettings.notifications;

  document.querySelector('#theme').addEventListener('change', (e) => {
    const newTheme = e.target.value;
    applyTheme(newTheme);
    saveSettings({ ...currentSettings, theme: newTheme });
  });

  document.querySelector('#accent').addEventListener('input', (e) => {
    const newColor = e.target.value;
    applyAccentColor(newColor);
    saveSettings({ ...currentSettings, accentColor: newColor });
  });

  document.querySelector('#reset-accent').addEventListener('click', () => {
    applyAccentColor(DEFAULT_SETTINGS.accentColor);
    saveSettings({ ...currentSettings, accentColor: DEFAULT_SETTINGS.accentColor });
  });

  document.querySelector('#notifications').addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    const notificationsEnabled = await handleNotifications(enabled);
    e.target.checked = notificationsEnabled;
    saveSettings({ ...currentSettings, notifications: notificationsEnabled });
  });

  document.querySelector('#reset-settings').addEventListener('click', () => {
    applyTheme(DEFAULT_SETTINGS.theme);
    applyAccentColor(DEFAULT_SETTINGS.accentColor);
    document.querySelector('#notifications').checked = DEFAULT_SETTINGS.notifications;
    saveSettings(DEFAULT_SETTINGS);
  });

  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = (e) => {
    if (currentSettings.theme === 'system') {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  };
  darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
}
