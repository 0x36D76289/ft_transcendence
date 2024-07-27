class UserManager {
	constructor() {
		this.loginForm = document.getElementById('loginForm');
		this.registerForm = document.getElementById('registerForm');
		this.loginBtn = document.getElementById('loginBtn');
		this.registerBtn = document.getElementById('registerBtn');

		this.loginBtn.addEventListener('click', () => this.showForm('login'));
		this.registerBtn.addEventListener('click', () => this.showForm('register'));

		this.loginForm.addEventListener('submit', this.handleLogin.bind(this));
		this.registerForm.addEventListener('submit', this.handleRegister.bind(this));
	}

	showForm(formType) {
		if (formType === 'login') {
			this.loginForm.classList.remove('hidden');
			this.registerForm.classList.add('hidden');
		} else {
			this.registerForm.classList.remove('hidden');
			this.loginForm.classList.add('hidden');
		}
	}

	async handleLogin(event) {
		event.preventDefault();
		const username = document.getElementById('loginUsername').value;
		const password = document.getElementById('loginPassword').value;

		try {
			const response = await fetch('/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem('token', data.token);
				this.loginForm.classList.add('hidden');
				window.dispatchEvent(new Event('userLoggedIn'));
			} else {
				alert(data.error || 'Login failed. Please try again.');
			}
		} catch (error) {
			console.error('Login error:', error);
			alert('An error occurred. Please try again.');
		}
	}

	async handleRegister(event) {
		event.preventDefault();
		const username = document.getElementById('registerUsername').value;
		const password = document.getElementById('registerPassword').value;
		const email = document.getElementById('registerEmail').value;
		const firstName = document.getElementById('registerFirstName').value;
		const age = document.getElementById('registerAge').value;

		try {
			const response = await fetch('/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password, email, firstName, age })
			});

			const data = await response.json();

			if (response.ok) {
				alert('Registration successful. Please log in.');
				this.showForm('login');
			} else {
				alert(data.error || 'Registration failed. Please try again.');
			}
		} catch (error) {
			console.error('Registration error:', error);
			alert('An error occurred. Please try again.');
		}
	}
}

const userManager = new UserManager();