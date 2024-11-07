import { UserAPI } from '../api/user.js';
import { navigate } from '../app.js';

export function render() {
	return `
		<div class="auth-container">
			<div class="auth-form">
				<h1>Connexion</h1>
				<form id="loginForm">
					<div class="form-group">
						<label for="loginUsername">Nom d'utilisateur</label>
						<input type="text" id="loginUsername" name="username" required>
					</div>
					<div class="form-group">
						<label for="loginPassword">Mot de passe</label>
						<input type="password" id="loginPassword" name="password" required>
					</div>
					<button type="submit" class="auth-button">Se connecter</button>
				</form>
				<p>Pas encore de compte ? <a href="#" id="showRegister">S'enregistrer</a></p>
			</div>
			<div class="auth-form" style="display: none;">
				<h1>Enregistrement</h1>
				<form id="registerForm">
					<div class="form-group">
						<label for="registerUsername">Nom d'utilisateur</label>
						<input type="text" id="registerUsername" name="username" required>
					</div>
					<div class="form-group">
						<label for="registerPassword">Mot de passe</label>
						<input type="password" id="registerPassword" name="password" required>
					</div>
					<button type="submit" class="auth-button">S'enregistrer</button>
				</form>
				<p>Déjà un compte ? <a href="#" id="showLogin">Se connecter</a></p>
			</div>
		</div>
	`;
}

export function init() {
	document.getElementById('loginForm').addEventListener('submit', async (event) => {
		event.preventDefault();
		const username = document.getElementById('loginUsername').value;
		const password = document.getElementById('loginPassword').value;
		try {
			const data = await UserAPI.login(username, password);
			setCookie('authToken', data.token);
			setCookie('username', data.username);
			setCookie('bio', data.bio);
			alert('Connexion réussie');
			navigate('/');
		} catch (error) {
			alert('Erreur de connexion');
		}
	});

	document.getElementById('registerForm').addEventListener('submit', async (event) => {
		event.preventDefault();
		const username = document.getElementById('registerUsername').value;
		const password = document.getElementById('registerPassword').value;
		try {
			const data = await UserAPI.register(username, password);
			setCookie('authToken', data.token);
			setCookie('username', data.username);
			setCookie('bio', data.bio);
			alert('Compte créé avec succès');
		} catch (error) {
			alert('Erreur d\'enregistrement');
		}
	});


	document.getElementById('showRegister').addEventListener('click', (event) => {
		event.preventDefault();
		document.querySelector('.auth-form:nth-child(1)').style.display = 'none';
		document.querySelector('.auth-form:nth-child(2)').style.display = 'block';
	});

	document.getElementById('showLogin').addEventListener('click', (event) => {
		event.preventDefault();
		document.querySelector('.auth-form:nth-child(1)').style.display = 'block';
		document.querySelector('.auth-form:nth-child(2)').style.display = 'none';
	});
}
