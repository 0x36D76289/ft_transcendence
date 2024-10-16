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

    <!-- Logged Out State -->
    <div class="auth-cards">
      <a href="#" class="auth-card login">
        <svg xmlns="http://www.w3.org/2000/svg" class="auth-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        <span>Sign In</span>
      </a>
      <a href="#" class="auth-card register">
        <svg xmlns="http://www.w3.org/2000/svg" class="auth-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="20" y1="8" x2="20" y2="14"/>
          <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
        <span>Register</span>
      </a>
    </div>

    <ul class="nav-links">
      <li class="nav-item">
        <a href="#" class="nav-link" title="Home">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span class="link-text">Home</span>
          <div class="nav-indicator"></div>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link" title="Search">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <span class="link-text">Search</span>
          <div class="nav-indicator"></div>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link" title="Friends">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
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
  z-index: 1000;
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

/* Auth Cards Styles */
.auth-cards {
  margin: var(--margin-m);
  display: flex;
  flex-direction: column;
  gap: var(--margin-s);
}

.auth-card {
  display: flex;
  align-items: center;
  gap: var(--margin-s);
  padding: var(--padding-m);
  border-radius: 12px;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.auth-card.login {
  background: var(--colora2);
  color: white;
}

.auth-card.register {
  background: transparent;
  border: 1px solid var(--colora2);
  color: var(--colora2);
}

.auth-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.auth-icon {
  min-width: 20px;
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
  
  .user-card, .auth-cards {
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
  
  .user-card, .auth-cards {
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


const showError = (message) => {
	console.error(message);
};

const showSuccess = (message) => {
	console.log(message);
};

const updateSidebarState = (isLoggedIn, userData = null) => {
	const userCard = document.querySelector('.user-card');
	const authCards = document.querySelector('.auth-cards');
	const username = document.querySelector('.username');
	const joinDate = document.querySelector('.join-date');
	const userAvatar = document.querySelector('.user-avatar img');

	if (isLoggedIn && userData) {
		userCard.style.display = 'block';
		authCards.style.display = 'none';
		username.textContent = userData.username;
		joinDate.textContent = `Member since ${new Date(userData.joinDate).toLocaleDateString('en-US', {
			month: 'short',
			year: 'numeric'
		})}`;
		if (userData.avatar) {
			userAvatar.src = userData.avatar;
		}
	} else {
		userCard.style.display = 'none';
		authCards.style.display = 'flex';
	}
};

const validateForm = (username, password) => {
	const errors = [];
	
	if (!username || username.length < 3) {
		errors.push('Username must be at least 3 characters long');
	}
	
	if (!password || password.length < 6) {
		errors.push('Password must be at least 6 characters long');
	}
	
	return errors;
};

export async function sidebarEvent() {
	const loginForm = document.getElementById('loginForm');
	if (loginForm) {
		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			
			const username = loginForm.querySelector('input[name="username"]').value;
			const password = loginForm.querySelector('input[name="password"]').value;
			
			const errors = validateForm(username, password);
			if (errors.length > 0) {
				showError(errors.join('\n'));
				return;
			}
			
			try {
				const response = await loginUser(username, password);
				if (response.token) {
					showSuccess('Successfully logged in!');
					updateSidebarState(true, {
						username: username,
						joinDate: new Date(),
					});
					
					const loginModal = document.getElementById('loginModal');
					if (loginModal) {
						loginModal.style.display = 'none';
					}
				}
			} catch (error) {
				showError(error.message || 'Failed to login. Please try again.');
			}
		});
	}
	
	const registerForm = document.getElementById('registerForm');
	if (registerForm) {
		registerForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			
			const username = registerForm.querySelector('input[name="username"]').value;
			const password = registerForm.querySelector('input[name="password"]').value;
			const bio = registerForm.querySelector('textarea[name="bio"]')?.value || '';
			
			const errors = validateForm(username, password);
			if (errors.length > 0) {
				showError(errors.join('\n'));
				return;
			}
			
			try {
				await registerUser(username, password, bio);
				showSuccess('Registration successful! Please log in.');
				
				const registerModal = document.getElementById('registerModal');
				if (registerModal) {
					registerModal.style.display = 'none';
				}
				
				const loginModal = document.getElementById('loginModal');
				if (loginModal) {
					loginModal.style.display = 'block';
				}
			} catch (error) {
				showError(error.message || 'Failed to register. Please try again.');
			}
		});
	}
	
	document.querySelector('.auth-card.login')?.addEventListener('click', (e) => {
		e.preventDefault();
		const loginModal = document.getElementById('loginModal');
		if (loginModal) {
			loginModal.style.display = 'block';
		}
	});
	
	document.querySelector('.auth-card.register')?.addEventListener('click', (e) => {
		e.preventDefault();
		const registerModal = document.getElementById('registerModal');
		if (registerModal) {
			registerModal.style.display = 'block';
		}
	});
	
	const token = document.cookie
		.split('; ')
		.find(row => row.startsWith('token='))
		?.split('=')[1];
		
	const username = document.cookie
		.split('; ')
		.find(row => row.startsWith('username='))
		?.split('=')[1];
		
	if (token && username) {
		updateSidebarState(true, {
			username: decodeURIComponent(username),
			joinDate: new Date(),
		});
	} else {
		updateSidebarState(false);
	}
}

export function initSidebar() {
	return [HTML, CSS, getModalTemplates(), getModalStyles()];
}

const getModalTemplates = () => `
	<div id="loginModal" class="modal" style="display: none;">
		<div class="modal-content">
			<h2>Login</h2>
			<form id="loginForm">
				<input type="text" name="username" placeholder="Username" required>
				<input type="password" name="password" placeholder="Password" required>
				<button type="submit">Login</button>
			</form>
		</div>
	</div>

	<div id="registerModal" class="modal" style="display: none;">
		<div class="modal-content">
			<h2>Register</h2>
			<form id="registerForm">
				<input type="text" name="username" placeholder="Username" required>
				<input type="password" name="password" placeholder="Password" required>
				<textarea name="bio" placeholder="Tell us about yourself"></textarea>
				<button type="submit">Register</button>
			</form>
		</div>
	</div>
`;

const getModalStyles = () => `
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1001;
	}

	.modal-content {
		background-color: var(--gray10);
		padding: var(--padding-xl);
		border-radius: 16px;
		width: 90%;
		max-width: 400px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.modal-content h2 {
		margin-bottom: var(--margin-l);
		color: var(--gray90);
	}

	.modal-content form {
		display: flex;
		flex-direction: column;
		gap: var(--margin-m);
	}

	.modal-content input,
	.modal-content textarea {
		padding: var(--padding-m);
		border: 1px solid var(--gray30);
		border-radius: 8px;
		background-color: var(--gray20);
		color: var(--gray90);
		font: var(--p);
	}

	.modal-content button {
		padding: var(--padding-m);
		background-color: var(--colora2);
		color: white;
		border: none;
		border-radius: 8px;
		font: var(--p);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.modal-content button:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}
`;
