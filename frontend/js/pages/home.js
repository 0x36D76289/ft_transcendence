export function homeView(state) {
	return `
    <h1>Home</h1>
    <p>Counter: ${state.counter}</p>
    <button data-event="click" data-action="incrementCounter">Increment</button>
    <button data-event="click" data-action="goToAbout">Go to About</button>
    ${state.isLoggedIn
			? `<button data-event="click" data-action="logout">Logout</button>`
			: `<button data-event="click" data-action="goToLogin">Login</button>`
		}
  `;
}
