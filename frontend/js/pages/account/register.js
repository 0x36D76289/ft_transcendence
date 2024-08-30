export const registerPage = {
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
}
