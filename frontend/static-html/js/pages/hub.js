import { getData } from '../api/utils.js';
import { readCookie } from '../cookie.js';
import { loadPage } from '../spa.js';

const htmlStructure = `
  <div class="hub-container">
    <button id="home-button" class="home-button">Home</button>
    <h1>User Hub</h1>
    <div class="user-grid" id="user-grid"></div>
  </div>
`;

// CSS styles
const styles = `
  .hub-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .home-button {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  h1 {
    text-align: center;
    margin-bottom: 30px;
  }

  .user-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    max-height: 80vh; /* Adjust the height as needed */
    overflow-y: auto;
  }

  .user-card {
    background-color: #111;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }

  .user-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
  }

  .profile-photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
    margin-bottom: 10px;
  }

  .username {
    font-size: 14px;
    margin: 0;
  }

  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 10px auto 0;
  }

  .status-online {
    background-color: #4CAF50;
  }

  .status-offline {
    background-color: #F44336;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .side-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    background-color: var(--panel-bg-color);
    color: var(--text-color);
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    padding: 20px;
    overflow-y: auto;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .side-panel.open {
    transform: translateX(0);
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    color: var(--text-color);
    cursor: pointer;
  }

  .side-panel .profile-photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
  }
`;

// Main rendering function
export async function renderHub() {
  const token = readCookie("authToken");

  // Fetch the list of users
  const users = await getData('/user/list', {
    Authorization: `Token ${token}`
  });

  if (!users || users.length === 0) {
    document.body.innerHTML = "<p>No users found or you are not authorized to view this page.</p>";
    return;
  }

  // Load the HTML structure and CSS
  loadPage(htmlStructure, styles);

  const userGrid = document.getElementById('user-grid');

  // Generate user cards with animation delay
  users.forEach((user, index) => {
    const userCard = createUserCard(user);
    userCard.style.animation = `fadeIn 0.5s ease ${index * 0.05}s both`;
    userGrid.appendChild(userCard);
  });

  // Add event listener for user selection
  userGrid.addEventListener('click', handleUserClick);

  // Add event listener for home button
  document.getElementById('home-button').addEventListener('click', () => {
    window.location.href = '/';
  });

  // Add event listener to close side panel when clicking outside
  document.addEventListener('click', handleOutsideClick);
}

function createUserCard(user) {
  const userCard = document.createElement('div');
  userCard.className = 'user-card';
  userCard.dataset.username = user.username;

  const profilePhoto = user.profile_photo || `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`;
  const statusClass = user.is_online ? 'status-online' : 'status-offline';

  userCard.innerHTML = `
    <img src="${profilePhoto}" alt="${user.username}'s photo" class="profile-photo" />
    <p class="username">${user.username}</p>
    <div class="status-indicator ${statusClass}"></div>
  `;

  return userCard;
}

async function handleUserClick(event) {
  const userCard = event.target.closest('.user-card');
  if (!userCard) return;

  const username = userCard.dataset.username;
  const token = readCookie("authToken");

  // Fetch the profile data of the clicked user
  const profileData = await getData(`/user/profile/${username}`, {
    Authorization: `Token ${token}`
  });

  if (profileData) {
    let sidePanel = document.querySelector('.side-panel');

    if (!sidePanel) {
      // Create a side panel element
      sidePanel = document.createElement('div');
      sidePanel.className = 'side-panel';
      document.body.appendChild(sidePanel);
    }

    // Populate the side panel with user details
    sidePanel.innerHTML = `
      <button class="close-button">&times;</button>
      <h2>${profileData.username}</h2>
      <img src="${profileData.profile_photo || `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`}" alt="${profileData.username}'s photo" class="profile-photo" />
      <p><strong>Status:</strong> ${profileData.is_online ? 'Online' : 'Offline'}</p>
      <p><strong>Bio:</strong> ${profileData.bio || 'No bio available'}</p>
    `;

    // Add event listener to close the side panel
    sidePanel.querySelector('.close-button').addEventListener('click', () => {
      document.body.removeChild(sidePanel);
    });

    // Open the side panel
    requestAnimationFrame(() => {
      sidePanel.classList.add('open');
    });
  }
}

function handleOutsideClick(event) {
  const sidePanel = document.querySelector('.side-panel');
  if (sidePanel && !sidePanel.contains(event.target) && !event.target.closest('.user-card')) {
    document.body.removeChild(sidePanel);
  }
}
