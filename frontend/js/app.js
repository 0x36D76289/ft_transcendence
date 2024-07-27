class App {
	constructor() {
		this.game = new PongGame();
		this.userManager = new UserManager();
		this.messaging = new Messaging();
		this.languageManager = new LanguageManager();

		this.initializeApp();

		window.addEventListener('userLoggedIn', this.handleUserLoggedIn.bind(this));
	}

	initializeApp() {
		const token = localStorage.getItem('token');
		if (token) {
			this.showLoggedInState();
		} else {
			this.showLoggedOutState();
		}

		const logoutBtn = document.createElement('button');
		logoutBtn.textContent = 'Logout';
		logoutBtn.addEventListener('click', this.handleLogout.bind(this));
		document.querySelector('nav').appendChild(logoutBtn);
	}

	showLoggedInState() {
		document.getElementById('gameContainer').classList.remove('hidden');
		this.messaging.show();
		document.getElementById('loginBtn').classList.add('hidden');
		document.getElementById('registerBtn').classList.add('hidden');
		this.game.start();
	}

	showLoggedOutState() {
		document.getElementById('gameContainer').classList.add('hidden');
		this.messaging.hide();
		document.getElementById('loginBtn').classList.remove('hidden');
		document.getElementById('registerBtn').classList.remove('hidden');
	}

	handleUserLoggedIn() {
		this.showLoggedInState();
	}

	handleLogout() {
		localStorage.removeItem('token');
		this.showLoggedOutState();
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new App();
});