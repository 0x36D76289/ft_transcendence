// JavaScript
import { loadPage } from '../spa.js';
import { initSidebar, sidebarEvent } from '../utils/sidebar.js';
import { backgroundEvent, initBackground } from '../utils/background.js';

const HTML = `
<div class="friends-page">
  <div class="content-wrapper">
    <div class="central-element">
      <h1>My Friends</h1>
      <div class="search-bar">
        <input type="text" placeholder="Search friends..." />
      </div>
    </div>
    <div class="friends-grid"></div>
    <div class="pagination">
      <button class="prev-page"><span class="material-icons">navigate_before</span></button>
      <span class="page-info">Page <span class="current-page">1</span> of <span class="total-pages">1</span></span>
      <button class="next-page"><span class="material-icons">navigate_next</span></button>
    </div>
  </div>
</div>
`;

const CSS = `
.friends-page {
  min-height: 100vh;
  width: 100%;
  background-color: #111111;
  color: #ffffff;
  position: relative;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  padding: var(--padding-xl);
  margin-left: var(--sidebar-width); /* Account for sidebar on desktop */
  min-height: 100vh;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: var(--sidebar-width);
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, var(--colora) 0%, transparent 70%);
    opacity: 0.1;
    z-index: 0;
    pointer-events: none;
  }
}

.central-element {
  background-color: rgba(25, 25, 25, 0.95);
  border-radius: 24px;
  padding: var(--padding-xl);
  margin-bottom: var(--padding-xl);
  text-align: center;
  z-index: 1;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  h1 {
    font: var(--h1);
    color: #ffffff;
    margin-bottom: var(--padding-l);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .search-bar {
    input {
      width: 100%;
      max-width: 350px;
      padding: var(--padding-s) var(--padding-m);
      border-radius: 12px;
      border: 2px solid rgba(255, 255, 255, 0.1);
      background-color: rgba(0, 0, 0, 0.2);
      color: #ffffff;
      font: var(--pui);
      transition: all var(--transition);

      &:focus {
        outline: none;
        border-color: var(--colora);
        box-shadow: 0 0 20px rgba(var(--colora-rgb), 0.2);
        background-color: rgba(0, 0, 0, 0.4);
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--padding-l);
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
  padding: 0 var(--padding-m);
}

.friend-card {
  background-color: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: var(--padding-m);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  backdrop-filter: blur(10px);
  height: 100%;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
    border-color: var(--colora);
    background-color: rgba(40, 40, 40, 0.95);
  }

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: var(--padding-s);
    border: 3px solid var(--colora);
    transition: all var(--transition);
    box-shadow: 0 0 20px rgba(var(--colora-rgb), 0.3);
  }

  .friend-username {
    font: var(--h4ui);
    color: #ffffff;
    margin-bottom: var(--padding-s);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    text-align: center;
    word-break: break-word;
  }

  .friend-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--padding-xs);
    width: 100%;
    
    button {
      padding: var(--padding-xs) var(--padding-s);
      border: none;
      border-radius: 8px;
      background-color: rgba(var(--colora-rgb), 0.2);
      color: #ffffff;
      font: var(--smallui);
      transition: all var(--transition);
      cursor: pointer;
      border: 1px solid rgba(var(--colora-rgb), 0.3);
      width: 100%;

      &:hover {
        background-color: var(--colora);
        transform: scale(1.05);
        box-shadow: 0 0 15px rgba(var(--colora-rgb), 0.4);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

.pagination {
  margin-top: var(--padding-xl);
  margin-bottom: var(--padding-xl);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--padding-m);
  z-index: 1;
  width: 100%;

  button {
    padding: var(--padding-xs) var(--padding-m);
    border: none;
    border-radius: 8px;
    background-color: rgba(var(--colora-rgb), 0.2);
    color: #ffffff;
    font: var(--pui);
    transition: all var(--transition);
    cursor: pointer;
    border: 1px solid rgba(var(--colora-rgb), 0.3);

    &:hover:not(:disabled) {
      background-color: var(--colora);
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(var(--colora-rgb), 0.4);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .material-icons {
      font-size: 1.5rem;
    }
  }

  .page-info {
    font: var(--pui);
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

/* Tablet Styles */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .content-wrapper {
    margin-left: 80px; /* Account for collapsed sidebar */
    padding: var(--padding-l);
  }

  .content-wrapper::before {
    left: 80px;
  }

  .friends-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

/* Mobile Styles */
@media screen and (max-width: 767px) {
  .content-wrapper {
    margin-left: 0;
    padding: var(--padding-m);
    padding-bottom: calc(64px + var(--padding-xl)); /* Account for bottom navigation */
  }

  .content-wrapper::before {
    left: 0;
  }

  .central-element {
    padding: var(--padding-m);
    border-radius: 16px;

    h1 {
      font-size: 1.5rem;
    }

    .search-bar input {
      max-width: 100%;
    }
  }

  .friends-grid {
    grid-template-columns: 1fr;
    gap: var(--padding-m);
    padding: 0;
  }

  .friend-card {
    .friend-actions {
      grid-template-columns: 1fr;
    }
  }

  .pagination {
    margin-bottom: calc(64px + var(--padding-m));
  }
}

@keyframes fadeInScale {
  from { 
    opacity: 0; 
    transform: scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}
`;

function createTestProfiles(count) {
  const profiles = {};
  for (let i = 0; i < count; i++) {
    profiles[i] = {
      username: `testuser${i}`,
      avatar: `https://randomuser.me/api/portraits/lego/${i % 10}.jpg`
    };
  }
  return profiles;
}

export function friends() {
  const [sidebarHTML, sidebarCSS] = initSidebar();

  const loadHTML = `
  ${sidebarHTML}
  ${HTML}
  `;
  const loadCSS = `
  ${sidebarCSS}
  ${CSS}
  `;

  loadPage(loadHTML, loadCSS);
  sidebarEvent();

  const friendsGrid = document.querySelector('.friends-grid');
  const searchInput = document.querySelector('.search-bar input');
  const prevPageBtn = document.querySelector('.prev-page');
  const nextPageBtn = document.querySelector('.next-page');
  const currentPageSpan = document.querySelector('.current-page');
  const totalPagesSpan = document.querySelector('.total-pages');

  let friends_data = {};
  let filteredFriendsData = {};
  let currentPage = 1;
  let itemsPerPage = 8;

  friends_data = createTestProfiles(20);
  filteredFriendsData = { ...friends_data };

  function renderFriends(page = 1) {
    friendsGrid.innerHTML = '';
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const friendsToShow = Object.values(filteredFriendsData).slice(startIndex, endIndex);

    friendsToShow.forEach((friend, index) => {
      const friendElement = document.createElement('div');
      friendElement.classList.add('friend-card');
      friendElement.innerHTML = `
        <img src="${friend.avatar}" alt="avatar" />
        <div class="friend-username">${friend.username}</div>
        <div class="friend-actions">
          <button class="message-btn">Message</button>
          <button class="play-btn">Play</button>
          <button class="block-btn">Block</button>
          <button class="unfriend-btn">Unfriend</button>
        </div>
      `;
      friendsGrid.appendChild(friendElement);

      // Add animation to friend cards
      friendElement.style.animation = `fadeInScale 0.5s ease forwards ${index * 0.1}s`;
      friendElement.style.opacity = '0';

      // Add click event to redirect to user's page
      friendElement.addEventListener('click', (e) => {
        if (!e.target.classList.contains('message-btn') && 
            !e.target.classList.contains('play-btn') && 
            !e.target.classList.contains('block-btn') && 
            !e.target.classList.contains('unfriend-btn')) {
        }
      });
    });

    updatePagination();
  }

  function updatePagination() {
    const totalPages = Math.ceil(Object.keys(filteredFriendsData).length / itemsPerPage);
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  renderFriends();

  searchInput.addEventListener('input', (e) => {
    const searchValue = e.target.value.toLowerCase();
    filteredFriendsData = Object.fromEntries(
      Object.entries(friends_data).filter(([_, friend]) =>
        friend.username.toLowerCase().includes(searchValue)
      )
    );
    currentPage = 1;
    renderFriends();
  });

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderFriends(currentPage);
    }
  });

  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(Object.keys(filteredFriendsData).length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderFriends(currentPage);
    }
  });

  // Add event listeners for friend actions
  friendsGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('message-btn')) {
      console.log('Message friend');
    } else if (e.target.classList.contains('play-btn')) {
      console.log('Play with friend');
    } else if (e.target.classList.contains('block-btn')) {
      console.log('Block friend');
    } else if (e.target.classList.contains('unfriend-btn')) {
      console.log('Unfriend');
    }
  });
}
