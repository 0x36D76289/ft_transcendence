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
				<button id="guestButton" class="auth-button">Se connecter en tant qu'invité</button>
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
		<div id="popup" class="popup" style="display: none;">
			<div class="popup-content">
				<span id="popupMessage"></span>
				<button id="closePopup" class="auth-button">Fermer</button>
			</div>
		</div>
	`;
}

function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    popupMessage.textContent = message;
    popup.style.display = 'flex';

    document.body.style.overflow = 'hidden';

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

export function init() {
    const mainElement = document.querySelector('main');
    const originalMarginLeft = getComputedStyle(mainElement).marginLeft;
    mainElement.style.marginLeft = '0';

    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        try {
            await UserAPI.login(username, password);
            mainElement.style.marginLeft = originalMarginLeft;
            navigate('/');
        } catch (error) {
            showPopup('Erreur de connexion');
        }
    });

    document.getElementById('registerForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        try {
            await UserAPI.register(username, password);
            mainElement.style.marginLeft = originalMarginLeft;
            navigate('/');
        } catch (error) {
            showPopup('Erreur d\'enregistrement');
        }
    });

    document.getElementById('guestButton').addEventListener('click', async (event) => {
        event.preventDefault();
        await UserAPI.createGuest();
        mainElement.style.marginLeft = originalMarginLeft;
        window.location.reload();
        navigate('/');
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

    document.getElementById('closePopup').addEventListener('click', closePopup);
}
