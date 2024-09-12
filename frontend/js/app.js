import { SPAEngine } from './SPAEngine.js';
import { API } from './api.js';

const api = new API('https://localhost:8000');
const app = new SPAEngine();

function updateUI() {
	const user = api.getUser();
	const appDiv = document.getElementById('app');

	if (user) {
		appDiv.innerHTML = `
	  <h1>Bienvenue, ${user.username}!</h1>
	  <button id="logout">Déconnexion</button>
	`;
		document.getElementById('logout').addEventListener('click', handleLogout);
	} else {
		appDiv.innerHTML = `
	  <h1>ft_transcendance</h1>
	  <nav>
		<a href="#login">Connexion</a> |
		<a href="#register">Inscription</a> | 
		<a href="#home">Home</a>
	  </nav>
	  <div id="content"></div>
	`;
	}
}

function renderHome() {
	updateUI();
	const content = document.getElementById('content');
	content.innerHTML = `
	<h2>Home</h2>
	<p>Bienvenue sur ft_transcendance!</p>
	`;
}

function renderLoginForm() {
	const content = document.getElementById('content');
	content.innerHTML = `
	<h2>Connexion</h2>
	<form id="loginForm">
	  <input type="text" id="username" placeholder="Nom d'utilisateur" required>
	  <input type="password" id="password" placeholder="Mot de passe" required>
	  <button type="submit">Se connecter</button>
	</form>
  `;
	document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function renderRegisterForm() {
	const content = document.getElementById('content');
	content.innerHTML = `
	<h2>Inscription</h2>
	<form id="registerForm">
	  <input type="text" id="username" placeholder="Nom d'utilisateur" required>
	  <input type="password" id="password" placeholder="Mot de passe" required>
	  <button type="submit">S'inscrire</button>
	</form>
  `;
	document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

async function handleLogin(event) {
	event.preventDefault();
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	try {
		const response = await api.login(username, password);
		if (response.token) {
			localStorage.setItem('user', JSON.stringify({ username }));
			localStorage.setItem('token', response.token);
			api.token = response.token;
			updateUI();
		} else {
			alert('Échec de la connexion');
		}
	} catch (error) {
		console.error('Erreur lors de la connexion:', error);
		alert('Une erreur est survenue lors de la connexion');
	}
}

async function handleRegister(event) {
	event.preventDefault();
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	try {
		const response = await api.register(username, password);
		console.log(response);
		if (response.id) {
			alert('Inscription réussie! Veuillez vous connecter.');
			app.navigate('#login');
		} else {
			alert('Échec de l\'inscription');
		}
	} catch (error) {
		console.error('Erreur lors de l\'inscription:', error);
		alert('Une erreur est survenue lors de l\'inscription');
	}
}

async function handleLogout() {
	try {
		const token = localStorage.getItem('token');
		if (token) {
			await api.logout(token);
		}
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		api.token = null;
		updateUI();
	} catch (error) {
		console.error('Erreur lors de la déconnexion:', error);
		alert('Une erreur est survenue lors de la déconnexion');
	}
}

app.addRoute('home', renderHome);
app.addRoute('login', renderLoginForm);
app.addRoute('register', renderRegisterForm);

document.addEventListener('DOMContentLoaded', () => {
	updateUI();
	app.start();
});
