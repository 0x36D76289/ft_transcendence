import { setCookie } from '../utils/cookies.js';

class SettingsController {
  constructor() {
    this.settings = {
      theme: localStorage.getItem('theme') || 'dark',
      accent: localStorage.getItem('accent') || getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim(),
      notifications: localStorage.getItem('notifications') === 'true'
    };
    
    this.init();
  }

  init() {
    this.loadSettings();
    this.bindEvents();
  }

  loadSettings() {
    document.getElementById('theme').value = this.settings.theme;
    document.getElementById('accent').value = this.settings.accent;
    document.getElementById('notifications').checked = this.settings.notifications;
    
    this.applySettings();
  }

  bindEvents() {
    // Thème
    document.getElementById('theme').addEventListener('change', (e) => {
      this.updateSetting('theme', e.target.value);
    });

    // Couleur d'accent
    document.getElementById('accent').addEventListener('change', (e) => {
      this.updateSetting('accent', e.target.value);
    });

    // Notifications
    document.getElementById('notifications').addEventListener('change', (e) => {
      this.updateSetting('notifications', e.target.checked);
    });
  }

  updateSetting(key, value) {
    this.settings[key] = value;
    localStorage.setItem(key, value);
    this.applySettings();
  }

  applySettings() {
    document.documentElement.setAttribute('data-theme', this.settings.theme);
    document.documentElement.style.setProperty('--accent-color', this.settings.accent);
    
    setCookie('theme', this.settings.theme, 365);
    setCookie('accent', this.settings.accent, 365);
  }
}

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
                <option value="system">Système</option>
              </select>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label for="accent">Couleur d'accent</label>
                <span class="setting-description">Couleur principale de l'interface</span>
              </div>
              <div class="color-picker">
                <input type="color" id="accent" value="#3245ff">
                <button class="reset-color">Réinitialiser</button>
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
      </div>
    </div>
  `;
}

export function init() {
  new SettingsController();
}
