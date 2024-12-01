import { setCookie, getLanguages, getTheme, getAccentColor, setLanguages, setTheme, setAccentColor } from '../utils/cookies.js';
import { i18n } from '../services/i18n.js';
import { currentSettings } from '../app.js';

export function render() {
  return `
<div class="settings-container">
  <header class="settings-header">
    <h1>${i18n.t('settings.title')}</h1>
  </header>

  <div class="settings-grid">
    <!-- Langue -->
    <section class="settings-section">
      <h2>${i18n.t('settings.language.title')}</h2>
      <div class="settings-group">
        <div class="setting-item">
          <div class="setting-info">
            <label for="language">${i18n.t('settings.language.label')}</label>
            <span class="setting-description">${i18n.t('settings.language.description')}</span>
          </div>
          <select id="language" class="setting-control">
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="it">Italiano</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Apparence -->
    <section class="settings-section">
      <h2>${i18n.t('settings.appearance.title')}</h2>
      <div class="settings-group">
        <div class="setting-item">
          <div class="setting-info">
            <label for="theme">${i18n.t('settings.appearance.theme.label')}</label>
            <span class="setting-description">${i18n.t('settings.appearance.theme.description')}</span>
          </div>
          <select id="theme" class="setting-control">
            <option value="dark">${i18n.t('settings.appearance.theme.options.dark')}</option>
            <option value="light">${i18n.t('settings.appearance.theme.options.light')}</option>
          </select>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <label for="accent">${i18n.t('settings.appearance.accentColor.label')}</label>
            <span class="setting-description">${i18n.t('settings.appearance.accentColor.description')}</span>
          </div>
          <div class="color-picker">
            <input type="color" id="accent" value="#3245ff">
            <button id="reset-accent" class="button">${i18n.t('settings.appearance.accentColor.reset')}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Notifications -->
    <section class="settings-section">
      <h2>${i18n.t('settings.notifications.title')}</h2>
      <div class="settings-group">
        <div class="setting-item">
          <div class="setting-info">
            <label for="notifications">${i18n.t('settings.notifications.push.label')}</label>
            <span class="setting-description">${i18n.t('settings.notifications.push.description')}</span>
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
      <button id="reset-settings" class="button">${i18n.t('settings.actions.reset')}</button>
    </div>
  </div>
</div>
  `;
}

const DEFAULT_SETTINGS = {
  language: getLanguages(),
  theme: getTheme(),
  accentColor: getAccentColor(),
  notifications: false
};

export class Settings {
  constructor(settings = DEFAULT_SETTINGS) {
    this.language = settings.language;
    this.theme = settings.theme;
    this.accentColor = settings.accentColor;
    this.notifications = settings.notifications;
  }

  static getCurrentFromCookies() {
    const settings = new Settings({
      language: getLanguages(),
      theme: getTheme(),
      accentColor: getAccentColor(),
      notifications: false
    });
    return settings;
  }

  applyToDOM() {
    document.documentElement.setAttribute('data-theme', this.theme);
    document.documentElement.style.setProperty('--accent-color', this.accentColor);
  }

  updateSettingsPage() {
    if (window.location.pathname === '/settings') {
      const themeSelect = document.querySelector('#theme');
      const accentInput = document.querySelector('#accent');
      const languageSelect = document.querySelector('#language');
      const notificationsCheckbox = document.querySelector('#notifications');

      if (themeSelect) themeSelect.value = this.theme;
      if (accentInput) accentInput.value = this.accentColor;
      if (languageSelect) languageSelect.value = this.language;
      if (notificationsCheckbox) notificationsCheckbox.checked = this.notifications;
    }
  }

  set() {
    setLanguages(this.language);
    setTheme(this.theme);
    setAccentColor(this.accentColor);

    this.applyToDOM();
    this.updateSettingsPage();
  }

  reset() {
    Object.assign(this, DEFAULT_SETTINGS);
    this.set();
  }
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

export async function init() {
  await i18n.init(currentSettings.language);
  currentSettings.updateSettingsPage();
  currentSettings.applyToDOM();

  document.querySelector('#language').addEventListener('change', async (e) => {
    currentSettings.language = e.target.value;
    await i18n.setLanguage(currentSettings.language);
    currentSettings.set();
    window.location.reload();
  });

  document.querySelector('#theme').addEventListener('change', (e) => {
    currentSettings.theme = e.target.value;
    currentSettings.set();
  });

  document.querySelector('#accent').addEventListener('input', (e) => {
    currentSettings.accentColor = e.target.value;
    currentSettings.set();
  });

  document.querySelector('#reset-accent').addEventListener('click', () => {
    currentSettings.accentColor = DEFAULT_SETTINGS.accentColor;
    currentSettings.set();
  });

  document.querySelector('#notifications').addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    currentSettings.notifications = await handleNotifications(enabled);
    currentSettings.set();
  });

  document.querySelector('#reset-settings').addEventListener('click', () => {
    currentSettings.reset();
    navigate('/settings');
  });

  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = (e) => {
    if (currentSettings.theme === 'system') {
      currentSettings.theme = e.matches ? 'dark' : 'light';
      currentSettings.set();
    }
  };
  darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
}