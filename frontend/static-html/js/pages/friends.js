// JavaScript
import { loadPage } from '../spa.js';
import { initSidebar, sidebarEvent } from '../utils/sidebar.js';
import { eventBackground, initBackground } from '../utils/background.js';

const HTML = `
<div class="friends-page">
  <div class="central-element">
    <h1>My Friends</h1>
    <div class="search-bar">
      <input type="text" placeholder="Search friends..." />
    </div>
  </div>
  <div class="friends-grid"></div>
  <div class="pagination">
    <button class="prev-page">←</button>
    <span class="page-info">Page <span class="current-page">1</span> of <span class="total-pages">1</span></span>
    <button class="next-page">→</button>
  </div>
</div>
`;

const CSS = `
.friends-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: var(--bg-dark);
  color: var(--text-light);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, var(--colora) 0%, transparent 70%);
    opacity: 0.1;
    z-index: 0;
  }

  .central-element {
    backdrop-filter: blur(8px);
    background-color: rgba(var(--colora-rgb), 0.1);
    border-radius: 64px;
    padding: var(--padding-xl);
    margin-bottom: var(--padding-xxl);
    text-align: center;
    z-index: 1;

    h1 {
      font: var(--h1);
      color: var(--text-light);
      margin-bottom: var(--padding-l);
    }

    .search-bar {
      input {
        width: 300px;
        padding: var(--padding-s) var(--padding-m);
        border-radius: 32px;
        border: 2px solid var(--gray50);
        background-color: rgba(var(--bg-dark-rgb), 0.5);
        color: var(--text-light);
        font: var(--pui);
        transition: all var(--transition);

        &:focus {
          outline: none;
          border-color: var(--colora);
          box-shadow: 0 0 20px rgba(var(--colora-rgb), 0.3);
          width: 350px;
        }
      }
    }
  }

  .friends-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--padding-l);
    max-width: 80%;
    z-index: 1;
  }

  .friend-card {
    backdrop-filter: blur(4px);
    background-color: rgba(var(--bg-light-rgb), 0.1);
    border-radius: 32px;
    padding: var(--padding-m);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform-style: preserve-3d;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
    cursor: pointer;

    &:hover {
      transform: translateY(-10px) rotateX(10deg) rotateY(10deg);
      box-shadow: 0 30px 50px -10px rgba(0, 0, 0, 0.5);
    }

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-bottom: var(--padding-s);
      border: 3px solid var(--colora);
      transition: all var(--transition);
    }

    .friend-username {
      font: var(--h4ui);
      color: var(--text-light);
      margin-bottom: var(--padding-s);
    }

    .friend-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--padding-xs);
      
      button {
        padding: var(--padding-xs) var(--padding-s);
        border: none;
        border-radius: 20px;
        background-color: var(--colora);
        color: var(--gray10);
        font: var(--smallui);
        transition: all var(--transition);
        cursor: pointer;

        &:hover {
          background-color: var(--colora2);
          transform: scale(1.05);
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }
  }

  .pagination {
    margin-top: var(--padding-xl);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--padding-m);
    z-index: 1;

    button {
      padding: var(--padding-xs) var(--padding-m);
      border: none;
      border-radius: 20px;
      background-color: var(--colora);
      color: var(--gray10);
      font: var(--pui);
      transition: all var(--transition);
      cursor: pointer;

      &:hover {
        background-color: var(--colora2);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .page-info {
      font: var(--pui);
      color: var(--text-light);
    }
  }
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
`;

export function friends() {
  const [backgroundHTML, backgroundCSS] = initBackground();
  const [sidebarHTML, sidebarCSS] = initSidebar();

  const loadHTML = `
  ${sidebarHTML}
  ${backgroundHTML}
  ${HTML}
  `;
  const loadCSS = `
  ${sidebarCSS}
  ${backgroundCSS}
  ${CSS}
  `;

  loadPage(loadHTML, loadCSS);
  sidebarEvent();
  eventBackground();

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

  for (let i = 0; i < 20; i++) {
    friends_data[i] = {
      username: `username${i}`,
      avatar: `https://randomuser.me/api/portraits/lego/${i % 10}.jpg`
    };
  }

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
          window.location.href = `/user/${friend.username}`;
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