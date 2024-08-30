export const homePage = {
	render: () => `
		<h1>Welcome to ft_transcendence</h1>
		<button onclick="spa.navigateTo('/play')">Play</button>
		<button onclick="spa.navigateTo('/settings')">Settings</button>
		<button onclick="spa.navigateTo('/login')">Login / Register</button>
		<button onclick="spa.logout()">Logout</button>
	`,
};
