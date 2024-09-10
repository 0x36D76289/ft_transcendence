import { SPAEngine } from './SPAEngine.js';
import { API } from './api.js';

// Import views
import { homeView } from './pages/home.js';
import { aboutView } from './pages/about.js';
import { loginView } from './pages/login.js';
import { signupView } from './pages/signup.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const engine = new SPAEngine(app);
  const api = new API('http://127.0.0.1:8000');

  // Initialize views
  engine.registerView('home', homeView);
  engine.registerView('about', aboutView);
  engine.registerView('login', loginView);
  engine.registerView('signup', signupView);

  // Initialize actions
  engine.registerActions({
    goToAbout: () => engine.navigate('about'),
    goToHome: () => engine.navigate('home'),
    goToLogin: () => engine.navigate('login'),
    goToSignup: () => engine.navigate('signup'),
    incrementCounter: () => engine.setState({ counter: engine.state.counter + 1 }),

    login: async (username, password) => {
      try {
        const data = await api.login(username, password);
        engine.setState({ token: data.token, isLoggedIn: true });
        engine.navigate('home');
      } catch (error) {
        engine.setState({ loginError: 'Login failed: ' + error.message });
      }
    },
    signup: async (username, password) => {
      try {
        await api.signup(username, password);
        engine.setState({ signupSuccess: true });
        setTimeout(() => engine.navigate('login'), 2000);
      } catch (error) {
        engine.setState({ signupError: 'Signup failed: ' + error.message });
      }
    },
    logout: async () => {
      try {
        await api.logout();
        engine.setState({ token: null, isLoggedIn: false });
        engine.navigate('home');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  });

  // Set initial state and render view
  engine.setState({ currentView: 'home', counter: 0, isLoggedIn: false, token: null });
});