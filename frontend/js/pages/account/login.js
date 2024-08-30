export const loginPage = {
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
}
