import { UserAPI } from '../api/user.js';
import { navigate, initAuth } from '../app.js';
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
		<div class="other-login-buttons">
			<button id="guestButton" class="auth-button">${i18n.t('auth.login.guest')}</button>
			<button id="42Button" class="auth-button">${i18n.t('auth.login.42')}</button>
		</div>
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
	</div>w
</div>
	`;
}

export async function init(options={}) {
	const mainElement = document.querySelector('main');
	const originalMarginLeft = getComputedStyle(mainElement).marginLeft;
	mainElement.style.marginLeft = '0';

	if (options.login42) {
		try {
			const response = await UserAPI.login42(options.code)
			if (!response) {
				console.error('Error while logging in');
				return;
			}
			mainElement.style.marginLeft = originalMarginLeft;
			await initAuth();
			navigate('/');
		} catch (error) {
			popupSystem('error', i18n.t('auth.login.error'));
		}
		return;
	}

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
			await initAuth();
			navigate('/');
		} catch (error) {
			popupSystem('error', i18n.t('auth.login.error'));
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
			popupSystem('success', i18n.t('auth.register.success'));
		} catch (error) {
			popupSystem('error', 18n.t('auth.register.error'));
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
			await initAuth();
			navigate('/');
		} catch (error) {
			popupSystem('error', i18n.t("auth.register.guest_error"));
		}
	});

	document.getElementById('42Button').addEventListener('click', async (event) => {
		event.preventDefault();
		try {
			location.replace("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2e658ba79c415d6104fcd1079864d68a3da2c86f054d28f7c5205c8d4abc1080&redirect_uri=https%3A%2F%2Flocalhost%3A8443%2F42auth&response_type=code");
		} catch (error) {
			popupSystem('error', i18n.t('auth.login.42_error'));
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
