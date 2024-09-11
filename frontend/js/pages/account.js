export function account(state) {
	if (!state.isLoggedIn) {
		return `
			<input type="text" id="usernameInput" placeholder="Username">
			<input type="password" id="passwordInput" placeholder="Password">

			<button id="loginBtn">Login</button>
			<button id="forgetPasswordBtn">Forget Password</button>
			<button id="registerBtn">Register</button>
			<button id="homeBtn">Home</button>
		`;
	} else {
		return `Welcome, ${state.username}!`;
	}
}
