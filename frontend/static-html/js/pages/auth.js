import { UserAPI } from '../api/user.js';
import { navigate } from '../app.js';
import { popupSystem } from '../services/popup.js';
import { i18n } from '../services/i18n.js';

export function render() {
	return `
<div class="auth-container">
	<div class="auth-form">
		<h1>${i18n.t('auth.login.title')}</h1>
		<form id="loginForm">
			<div class="form-group">
				<label for="loginUsername">${i18n.t('auth.username')}</label>
				<input type="text" id="loginUsername" name="username" required>
			</div>
			<div class="form-group">
				<label for="loginPassword">${i18n.t('auth.password')}</label>
				<input type="password" id="loginPassword" name="password" required>
			</div>
			<button type="submit" class="auth-button">${i18n.t('auth.login.submit')}</button>
		</form>
		<p>${i18n.t('auth.login.no_account')} <a id="showRegister">${i18n.t('auth.login.register')}</a></p>
		<button id="guestButton" class="auth-button">${i18n.t('auth.login.guest')}</button>
	</div>
	<div class="auth-form" style="display: none;">
		<h1>${i18n.t('auth.register.title')}</h1>
		<form id="registerForm">
			<div class="form-group">
				<label for="registerUsername">${i18n.t('auth.username')}</label>
				<input type="text" id="registerUsername" name="username" required>
			</div>
			<div class="form-group">
				<label for="registerPassword">${i18n.t('auth.password')}</label>
				<input type="password" id="registerPassword" name="password" required>
			</div>
			<button type="submit" class="auth-button">${i18n.t('auth.register.submit')}</button>
		</form>
		<p>${i18n.t('auth.register.has_account')} <a id="showLogin">${i18n.t('auth.register.login')}</a></p>
	</div>
</div>
	`;
}

export function init() {
	const mainElement = document?.querySelector('main');
	const originalMarginLeft = getComputedStyle(mainElement).marginLeft;
	mainElement.style.marginLeft = '0';

	document.getElementById('loginForm').addEventListener('submit', async (event) => {
		event.preventDefault();
		const username = document?.getElementById('loginUsername')?.value;
		const password = document?.getElementById('loginPassword')?.value;
		try {
			const response = await UserAPI.login(username, password);
			if (!response) {
				console.error('Error while logging in');
				return;
			}
			mainElement.style.marginLeft = originalMarginLeft;
			window.location.reload();
		} catch (error) {
			popupSystem('error', 'Erreur de connexion');
		}
	});

	document.getElementById('registerForm').addEventListener('submit', async (event) => {
		event.preventDefault();
		const username = document?.getElementById('registerUsername')?.value;
		const password = document?.getElementById('registerPassword')?.value;
		try {
			const response = await UserAPI.register({ username, password });
			if (!response) {
				console.error('Error while registering');
				return;
			}
			popupSystem('success', 'Compte créé avec succès');
		} catch (error) {
			popupSystem('error', 'Erreur d\'enregistrement');
		}
	});

	document.getElementById('guestButton').addEventListener('click', async (event) => {
		event.preventDefault();
		try {
			const response = await UserAPI.createGuestAccount();
			if (!response) {
				console.error('Error while creating guest account');
				return;
			}
			mainElement.style.marginLeft = originalMarginLeft;
			window.location.reload();
		} catch (error) {
			popupSystem('error', 'Erreur de création de compte invité');
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
