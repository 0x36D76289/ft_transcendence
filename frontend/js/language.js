class LanguageManager {
	constructor() {
		this.currentLanguage = 'en';
		this.translations = {
			en: {
				title: 'Pong Game',
				loginBtn: 'Login',
				registerBtn: 'Register',
				langToggle: 'Switch to Français',
				loginTitle: 'Login',
				registerTitle: 'Register',
				messageTitle: 'Messages',
				footerText: '© 2024 Pong Game. All rights reserved.'
			},
			fr: {
				title: 'Jeu de Pong',
				loginBtn: 'Connexion',
				registerBtn: 'S\'inscrire',
				langToggle: 'Switch to English',
				loginTitle: 'Connexion',
				registerTitle: 'Inscription',
				messageTitle: 'Messages',
				footerText: '© 2024 Jeu de Pong. Tous droits réservés.'
			}
		};

		this.langToggleBtn = document.getElementById('langToggle');
		this.langToggleBtn.addEventListener('click', this.toggleLanguage.bind(this));

		this.updateTexts();
	}

	toggleLanguage() {
		this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
		this.updateTexts();
	}

	updateTexts() {
		const texts = this.translations[this.currentLanguage];
		document.getElementById('title').textContent = texts.title;
		document.getElementById('loginBtn').textContent = texts.loginBtn;
		document.getElementById('registerBtn').textContent = texts.registerBtn;
		document.getElementById('langToggle').textContent = texts.langToggle;
		document.getElementById('loginTitle').textContent = texts.loginTitle;
		document.getElementById('registerTitle').textContent = texts.registerTitle;
		document.getElementById('messageTitle').textContent = texts.messageTitle;
		document.getElementById('footerText').textContent = texts.footerText;

		// Update placeholders
		document.getElementById('loginUsername').placeholder = this.currentLanguage === 'en' ? 'Username' : 'Nom d\'utilisateur';
		document.getElementById('loginPassword').placeholder = this.currentLanguage === 'en' ? 'Password' : 'Mot de passe';
		document.getElementById('registerUsername').placeholder = this.currentLanguage === 'en' ? 'Username' : 'Nom d\'utilisateur';
		document.getElementById('registerPassword').placeholder = this.currentLanguage === 'en' ? 'Password' : 'Mot de passe';
		document.getElementById('registerEmail').placeholder = this.currentLanguage === 'en' ? 'Email' : 'Courriel';
		document.getElementById('registerFirstName').placeholder = this.currentLanguage === 'en' ? 'First Name' : 'Prénom';
		document.getElementById('registerAge').placeholder = this.currentLanguage === 'en' ? 'Age' : 'Âge';
		document.getElementById('messageInput').placeholder = this.currentLanguage === 'en' ? 'Type your message...' : 'Tapez votre message...';

		// Update button texts
		document.getElementById('loginSubmit').textContent = this.currentLanguage === 'en' ? 'Login' : 'Connexion';
		document.getElementById('registerSubmit').textContent = this.currentLanguage === 'en' ? 'Register' : 'S\'inscrire';
		document.getElementById('messageSend').textContent = this.currentLanguage === 'en' ? 'Send' : 'Envoyer';
	}
}

const languageManager = new LanguageManager();