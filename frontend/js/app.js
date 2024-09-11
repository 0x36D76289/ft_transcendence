import { SPAEngine } from './SPAEngine.js';
import { API } from './api.js';

// Import views
import { home } from './pages/home.js';
import { about } from './pages/about.js';
import { account } from './pages/account.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const engine = new SPAEngine(app);
  const api = new API('http://127.0.0.1:8000');

  // Initialize views
  engine.registerView('home', home);
  engine.registerView('about', about);
  engine.registerView('account', account);

  // Handle button click event in account view
  const handleButtonClick = (action) => {
    const usernameInput = document.getElementById('usernameInput').value;
    const passwordInput = document.getElementById('passwordInput').value;
    
    if (action === 'login') {
      api.login(usernameInput, passwordInput)
        .then(response => {
          console.log('Login successful');
        })
        .catch(error => {
          console.error('Login failed:', error);
        });
    } else if (action === 'register') {
      api.register(usernameInput, passwordInput)
        .then(response => {
          console.log('Registration successful');
        })
        .catch(error => {
          console.error('Registration failed:', error);
        });
    }
  };

  document.getElementById('loginBtn').addEventListener('click', () => handleButtonClick('login'));
  document.getElementById('registerBtn').addEventListener('click', () => handleButtonClick('register'));
});
