
// Charger les paramètres depuis le localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
const savedFont = localStorage.getItem('fontFamily') || 'Arial';
const savedFontSize = localStorage.getItem('fontSize') || '16';
const savedTextColor = localStorage.getItem('textColor') || '#000000';

// Appliquer les paramètres sauvegardés
document.body.classList.toggle('dark-theme', savedTheme === 'dark');
document.body.style.fontFamily = savedFont;
document.body.style.fontSize = `${savedFontSize}px`;
document.body.style.color = savedTextColor;

const pages = {
	'/': {
		render: () => `
			<h1>Welcome to ft_transcendence</h1>
			<button onclick="spa.navigateTo('/play')">Play</button>
			<button onclick="spa.navigateTo('/settings')">Settings</button>
			<button onclick="spa.navigateTo('/login')">Login / Register</button>
			<button onclick="spa.logout()">Logout</button> <!-- Ajout du bouton Logout -->
		`,
	},
	'/play': {
		render: () => `
			<h1>Play</h1>
			<button onclick="spa.navigateTo('/settings')">Settings</button>
			<button onclick="spa.navigateTo('/login')">Login / Register</button>
		`,
	},
	'/settings': {
		render: () => `
			<h1>Settings</h1>
			<div class="settings-container">
				<div>
					<label for="themeSelect">Select Theme:</label>
					<select id="themeSelect">
						<option value="light">Light</option>
						<option value="dark">Dark</option>
					</select>
				</div>
				<div>
					<label for="fontSelect">Select Font:</label>
					<select id="fontSelect">
						<option value="Arial">Arial</option>
						<option value="Verdana">Verdana</option>
						<option value="Times New Roman">Times New Roman</option>
						<option value="Jetbrains Mono">JetBrains Mono</options>
						<option value="Monocraft">Monocraft</options>
						<!-- Ajoutez d'autres polices selon les besoins -->
					</select>
				</div>
				<div>
					<label for="fontSizeSlider">Font Size: <span id="fontSizeValue">16</span>px</label>
					<input type="range" id="fontSizeSlider" min="10" max="30" value="16">
				</div>
				<div>
					<label for="textColorPicker">Text Color:</label>
					<input type="color" id="textColorPicker" value="#000000">
				</div>
				<div>
					<button id="resetSettingsButton">Reset to Default</button>
				</div>
			</div>
			<button onclick="spa.navigateTo('/')">Back to Home</button>
		`,
		setup: () => {
			// Initialiser les éléments du formulaire avec les valeurs sauvegardées
			document.getElementById('themeSelect').value = savedTheme;
			document.getElementById('fontSelect').value = savedFont;
			document.getElementById('fontSizeSlider').value = savedFontSize;
			document.getElementById('fontSizeValue').innerText = savedFontSize;
			document.getElementById('textColorPicker').value = savedTextColor;

			// Gestion du thème
			spa.addEventListenerTo('#themeSelect', 'change', (e) => {
				const theme = e.target.value;
				document.body.classList.toggle('dark-theme', theme === 'dark');
				localStorage.setItem('theme', theme);
			});

			// Gestion de la police
			spa.addEventListenerTo('#fontSelect', 'change', (e) => {
				const font = e.target.value;
				document.body.style.fontFamily = font;
				localStorage.setItem('fontFamily', font);
			});

			// Gestion de la taille de la police avec un curseur
			spa.addEventListenerTo('#fontSizeSlider', 'input', (e) => {
				const fontSize = e.target.value;
				document.body.style.fontSize = `${fontSize}px`;
				document.getElementById('fontSizeValue').innerText = fontSize;
				localStorage.setItem('fontSize', fontSize);
			});

			// Gestion de la couleur du texte
			spa.addEventListenerTo('#textColorPicker', 'input', (e) => {
				const color = e.target.value;
				document.body.style.color = color;
				localStorage.setItem('textColor', color);
			});

			// Réinitialiser les paramètres par défaut
			spa.addEventListenerTo('#resetSettingsButton', 'click', () => {
				localStorage.clear();
				document.body.classList.remove('dark-theme');
				document.body.style.fontFamily = 'Arial';
				document.body.style.fontSize = '16px';
				document.body.style.color = '#000000';
				document.getElementById('themeSelect').value = 'light';
				document.getElementById('fontSelect').value = 'Arial';
				document.getElementById('fontSizeSlider').value = '16';
				document.getElementById('fontSizeValue').innerText = '16';
				document.getElementById('textColorPicker').value = '#000000';
			});
		}
	},
	'/login': {
		render: () => `
			<h2>Login</h2>
			<form id="loginForm">
				<input type="text" name="username" placeholder="Username" required>
				<input type="password" name="password" placeholder="Password" required>
				<button type="submit">Login</button>
			</form>
			<p>Don't have an account? <a href="#" onclick="spa.navigateTo('/register'); return false;">Register</a></p>
		`,
		setup: () => {
			spa.addEventListenerTo('#loginForm', 'submit', async (e) => {
				e.preventDefault();
				const username = e.target.username.value;
				const password = e.target.password.value;

				try {
					const response = await fetch('http://127.0.0.1:8000/login', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ username, password })
					});

					if (!response.ok) {
						throw new Error('Login failed');
					}

					const data = await response.json();
					localStorage.setItem('authToken', data.token); // Stocke le token d'authentification
					alert('Login successful');
					spa.navigateTo('/');
				} catch (error) {
					console.error('Error:', error);
					alert('Login failed: ' + error.message);
				}
			});
		}
	},
	'/register': {
		render: () => `
			<h2>Register</h2>
			<form id="registerForm">
				<input type="text" name="username" placeholder="Username" required>
				<input type="email" name="email" placeholder="Email" required>
				<input type="password" name="password" placeholder="Password" required>
				<input type="password" name="confirmPassword" placeholder="Confirm Password" required>
				<button type="submit">Register</button>
			</form>
			<p>Already have an account? <a href="#" onclick="spa.navigateTo('/login'); return false;">Login</a></p>
		`,
		setup: () => {
			spa.addEventListenerTo('#registerForm', 'submit', async (e) => {
				e.preventDefault();
				const username = e.target.username.value;
				const email = e.target.email.value;
				const password = e.target.password.value;
				const confirmPassword = e.target.confirmPassword.value;

				if (password !== confirmPassword) {
					alert("Passwords don't match!");
					return;
				}

				try {
					const response = await fetch('http://127.0.0.1:8000/signup', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ username, password })
					});

					if (!response.ok) {
						throw new Error('Registration failed');
					}

					alert('Registration successful');
					spa.navigateTo('/login');
				} catch (error) {
					console.error('Error:', error);
					alert('Registration failed: ' + error.message);
				}
			});
		}
	},
	'/404': {
		render: () => '<h1>404 - Page Not Found</h1>',
	}
};

document.addEventListener('DOMContentLoaded', () => {
	window.spa = new SPAManager(pages);
});