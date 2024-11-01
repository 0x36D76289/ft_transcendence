import { getUserProfile } from '../api/user.js';
import { readCookie, eraseCookie } from '../cookie.js';
import { navigate } from '../spa.js';

const HTML = `
<nav class="sidebar">
  <div class="sidebar-content">
    <!-- Logged In State -->
    <div class="user-card">
      <div class="user-info">
        <div class="user-avatar">
          <img src="/api/placeholder/40/40" alt="User Avatar" />
          <span class="status-badge"></span>
        </div>
        <div class="user-details">
          <span class="username">John Doe</span>
          <span class="join-date">Member since Oct 2024</span>
        </div>
      </div>
    </div>

    <ul class="nav-links">
      <li class="nav-item">
        <a href="/" class="nav-link" title="Home">
          <span class="material-icons icon">home</span>
          <span class="link-text">Home</span>
          <div class="nav-indicator"></div>
        </a>
      </li>
      <li class="nav-item">
        <a href="/search" class="nav-link" title="Search">
          <span class="material-icons icon">search</span>
          <span class="link-text">Search</span>
          <div class="nav-indicator"></div>
        </a>
      </li>
      <li class="nav-item">
        <a href="/friends" class="nav-link" title="Friends">
          <span class="material-icons icon">group</span>
          <span class="link-text">Friends</span>
          <div class="nav-indicator"></div>
        </a>
      </li>
    </ul>
  </div>
</nav>
`;

const CSS = `
.sidebar {
  position: fixed;
  background-color: var(--gray10);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all var(--transition);
  z-index: 2;
}

/* User Card Styles */
.user-card {
  margin: var(--margin-m);
  padding: var(--padding-m);
  background: linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-radius: 16px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--margin-m);
}

.user-avatar {
  position: relative;
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #4CAF50;
  border-radius: 50%;
  border: 2px solid var(--gray10);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  color: var(--gray90);
  font-weight: 500;
  font-size: 0.95rem;
}

.join-date {
  color: var(--gray60);
  font-size: 0.75rem;
}

/* Rest of the sidebar styles */
.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.nav-links {
  list-style: none;
  padding: var(--padding-xs);
  margin-top: var(--margin-s);
}

.nav-item {
  position: relative;
  margin-bottom: var(--margin-xs);
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  padding: var(--padding-m);
  color: var(--gray60);
  border-radius: 16px;
  gap: var(--margin-m);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--gray20);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.nav-link:hover {
  color: var(--gray90);
}

.nav-link:hover::before {
  opacity: 0.08;
}

.nav-link:active::before {
  opacity: 0.12;
}

.icon {
  position: relative;
  min-width: 24px;
  transition: transform 0.2s ease;
}

.nav-link:hover .icon {
  transform: scale(1.1);
}

.nav-indicator {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background-color: var(--colora2);
  border-radius: 3px;
  opacity: 0;
  transform: scaleX(0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link:hover .nav-indicator {
  opacity: 1;
  transform: scaleX(0.6);
}

.nav-link.active {
  color: var(--colora2);
}

.nav-link.active .nav-indicator {
  opacity: 1;
  transform: scaleX(1);
}

/* Desktop - Full sidebar */
@media screen and (min-width: 1024px) {
  .sidebar {
    width: var(--sidebar-width);
    height: 100vh;
    left: 0;
    top: 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  .link-text {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
  }
}

/* Tablet - Icon-only sidebar */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .sidebar {
    width: 80px;
    height: 100vh;
    left: 0;
    top: 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  .user-card {
    display: none;
  }
  
  .link-text {
    display: none;
  }
  
  .nav-link {
    justify-content: center;
    padding: var(--padding-s);
  }
  
  .nav-indicator {
    bottom: -4px;
    left: 25%;
    right: 25%;
  }
}

/* Mobile - Bottom navigation bar */
@media screen and (max-width: 767px) {
  .sidebar {
    width: 100%;
    height: 64px;
    bottom: 0;
    left: 0;
    top: auto;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
  }
  
  .user-card {
    display: none;
  }
  
  .sidebar-content {
    flex-direction: row;
    align-items: center;
    height: 100%;
  }
  
  .nav-links {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 0;
    margin: 0;
  }
  
  .nav-item {
    margin: 0;
    flex: 1;
  }
  
  .link-text {
    display: none;
  }
  
  .nav-link {
    justify-content: center;
    padding: var(--padding-xs);
    border-radius: 12px;
    margin: 0 var(--margin-xxs);
  }
  
  .nav-indicator {
    bottom: 8px;
    left: 35%;
    right: 35%;
  }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.35;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.nav-link:active::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--gray70);
  border-radius: 50%;
  animation: ripple 0.6s ease-out;
  opacity: 0;
}
`;

export async function sidebarEvent() {
  const token = readCookie('token');
  if (token) {
    const user = await getUserProfile(token);
    if (user) {
      const username = document.querySelector('.username');
      const joinDate = document.querySelector('.join-date');
      const avatar = document.querySelector('.user-avatar img');
      const statusBadge = document.querySelector('.status-badge');

      username.textContent = user.username;
      joinDate.textContent = `Member since ${new Date(user.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' })}`;
      avatar.src = user.pfp;
      statusBadge.style.backgroundColor = user.status === 'online' ? '#4CAF50' : 'gray';
    }
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      navigate(link.href);
    });
  });
}

export function initSidebar() {
	return [HTML, CSS];
}
