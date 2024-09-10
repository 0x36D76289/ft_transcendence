export function aboutView(state) {
	return `
    <h1>About</h1>
    <p>This is the about page.</p>
    <button data-event="click" data-action="goToHome">Go to Home</button>
    ${state.isLoggedIn
			? `<button data-event="click" data-action="logout">Logout</button>`
			: `<button data-event="click" data-action="goToLogin">Login</button>`
		}
  `;
}