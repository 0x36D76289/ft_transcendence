import { UserAPI } from '../api/user.js';
import { getUsername, getToken, getLanguages } from '../utils/cookies.js';
import { i18n } from '../services/i18n.js';

export async function initSidebar() {
    await i18n.init(getLanguages());
    const data = await UserAPI.getProfile(getUsername());

    const data_json = JSON.stringify(data);
    console.log(data_json);

    const SIDEBAR = `
<nav id="sidebar" class="sidebar">
  <div class="sidebar-header">
      <span class="logo-text">${i18n.t('sidebar.title')}</span>
  </div>

  <div class="nav-items">
      <a href="/" class="nav-item active">
          <span class="material-icons nav-icon">home</span>
          <span class="nav-text">${i18n.t('sidebar.home')}</span>
      </a>
      <a href="/friends" class="nav-item">
          <span class="material-icons nav-icon">group</span>
          <span class="nav-text">${i18n.t('sidebar.friends')}</span>
      </a>
      <a href="/tournaments" class="nav-item">
          <span class="material-icons nav-icon">emoji_events</span>
          <span class="nav-text">${i18n.t('sidebar.tournaments')}</span>
      </a>
      <a href="/messages" class="nav-item">
          <span class="material-icons nav-icon">message</span>
          <span class="nav-text">${i18n.t('sidebar.messages')}</span>
      </a>
      <a href="/settings" class="nav-item">
          <span class="material-icons nav-icon">settings</span>
          <span class="nav-text">${i18n.t('sidebar.settings')}</span>
      </a>
  </div>

  <a href="/user" class="profile">
      <img src="/media/pfp/default_pfp.svg" alt="${i18n.t('sidebar.profile.alt')}" class="profile-image">
      <div class="status-led ${data.is_online ? 'online' : 'offline'}"></div>
      <div class="profile-info">
        <span class="profile-name">${data.username}</span>
      </div>
  </a>
</nav>
`;

    const sidebar = document.createElement("div");
    sidebar.innerHTML = SIDEBAR;
    document.body.appendChild(sidebar);

    if (getToken() === null) {
        const profileElement = sidebar.querySelector('.profile');
        if (profileElement) {
            profileElement.style.display = 'none';
        }
    }
}
