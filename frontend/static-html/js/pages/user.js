import { navigate } from "../app.js";
import { i18n } from '../services/i18n.js';
import { UserAPI } from '../api/user.js';
import { getUsername } from "../utils/cookies.js";

export function render() {
  return `
      <div class="profile-container">
          <div class="profile-header">
              <h1>${i18n.t('profile.title')}</h1>
          </div>
          
          <div class="profile-content">
              <div class="profile-section">
                  <div class="profile-card">
                      <div class="profile-avatar">
                          <div class="avatar-placeholder"></div>
                          <div class="status-indicator" id="status-indicator"></div>
                      </div>
                      <div class="profile-info">
                          <h2 id="username-display"></h2>
                          <p class="join-date" id="join-date"></p>
                      </div>
                  </div>

                  <div class="stats-card">
                      <h3>${i18n.t('profile.stats')}</h3>
                      <div class="stats-grid">
                          <div class="stat-item">
                              <span class="stat-value" id="games-played">-</span>
                              <span class="stat-label">${i18n.t('profile.games_played')}</span>
                          </div>
                          <div class="stat-item">
                              <span class="stat-value" id="win-rate">-</span>
                              <span class="stat-label">${i18n.t('profile.win_rate')}</span>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="profile-section">
                  <div class="edit-profile-card">
                      <h3>${i18n.t('profile.edit_profile')}</h3>
                      <form id="profile-form" class="profile-form">
                          <div class="form-group">
                              <label for="username">${i18n.t('profile.username')}</label>
                              <input type="text" id="username" name="username" />
                          </div>
                          <div class="form-group">
                              <label for="bio">${i18n.t('profile.bio')}</label>
                              <textarea id="bio" name="bio" rows="4"></textarea>
                          </div>
                          <button type="submit" class="save-button">
                              ${i18n.t('profile.save')}
                          </button>
                      </form>
                  </div>

                  <div class="danger-zone">
                      <h3>${i18n.t('profile.danger_zone')}</h3>
                      <div class="danger-actions">
                          <button id="logout-button" class="danger-button secondary">
                              ${i18n.t('profile.logout')}
                          </button>
                          <button id="delete-account-button" class="danger-button">
                              ${i18n.t('profile.delete_account')}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div id="confirm-modal" class="modal hidden">
          <div class="modal-content">
              <h3>${i18n.t('profile.confirm_delete')}</h3>
              <p>${i18n.t('profile.delete_warning')}</p>
              <div class="modal-actions">
                  <button id="cancel-delete" class="modal-button secondary">
                      ${i18n.t('profile.cancel')}
                  </button>
                  <button id="confirm-delete" class="modal-button danger">
                      ${i18n.t('profile.confirm')}
                  </button>
              </div>
          </div>
      </div>
  `;
}

export function init() {
  const profileForm = document.getElementById('profile-form');
  const logoutButton = document.getElementById('logout-button');
  const deleteAccountButton = document.getElementById('delete-account-button');
  const confirmModal = document.getElementById('confirm-modal');
  const cancelDelete = document.getElementById('cancel-delete');
  const confirmDelete = document.getElementById('confirm-delete');

  async function loadUserData() {
    try {
      const username = getUsername();
      const [profile, stats] = await Promise.all([
        UserAPI.getProfile(username),
        UserAPI.getStats(username)
      ]);

      document.getElementById('username-display').textContent = profile.username;
      document.getElementById('join-date').textContent = new Date(profile.date_joined).toLocaleDateString();
      document.getElementById('status-indicator').classList.add(profile.is_online ? 'online' : 'offline');

      document.getElementById('games-played').textContent = stats.games_played;
      document.getElementById('win-rate').textContent = `${stats.win_rate}%`;

      document.getElementById('username').value = profile.username;
      document.getElementById('bio').value = profile.bio || '';
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }

  // Save profile changes
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const bio = document.getElementById('bio').value;

    try {
      await UserAPI.updateUser(username, bio);
      showNotification(i18n.t('profile.save_success'), 'success');
      loadUserData();
    } catch (error) {
      console.error('Failed to update profile:', error);
      showNotification(i18n.t('profile.save_error'), 'error');
    }
  });

  // Logout
  logoutButton.addEventListener('click', async () => {
    try {
      await UserAPI.logout();
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error('Failed to logout:', error);
      showNotification(i18n.t('profile.logout_error'), 'error');
    }
  });

  // Delete account modal
  deleteAccountButton.addEventListener('click', () => {
    confirmModal.classList.remove('hidden');
  });

  cancelDelete.addEventListener('click', () => {
    confirmModal.classList.add('hidden');
  });

  confirmDelete.addEventListener('click', async () => {
    try {
      await UserAPI.deleteUser();
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
      showNotification(i18n.t('profile.delete_error'), 'error');
    }
    confirmModal.classList.add('hidden');
  });

  // Notification helper
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Initial load
  loadUserData();
}