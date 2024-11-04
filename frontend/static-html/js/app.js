import { initBackground } from "./components/background.js";
import { initSidebar } from "./components/sidebar.js";
// import { initNotifications } from "./components/notifications.js";
import { WebSocketAPI } from "./api/ws.js";
import { getCookie, getToken } from "./utils/cookies.js";
import { UserAPI } from "./api/user.js";

const content = document.getElementById("content");
const routes = {
	"/": "home",
	"/settings": "settings",
	"/friends": "friends",
	"/tournaments": "tournaments",
	"/messages": "messages",
	"/game": "game",
	"/login": "login",
};

function loadCSS(filename) {
	if (!document.querySelector(`link[href="${filename}"]`)) {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = filename;
		document.head.appendChild(link);
	}
}

async function render(path) {
	const pageModule = routes[path];
	if (pageModule) {
		try {
			console.log(`Loading page: ${pageModule}`);
			loadCSS(`./css/pages/${pageModule}.css`);

			const { render, init } = await import(`./pages/${pageModule}.js`);
			content.innerHTML = "";
			const pageContent = document.createElement("div");
			pageContent.classList.add("page-transition");
			pageContent.innerHTML = render();
			content.appendChild(pageContent);

			requestAnimationFrame(() => pageContent.classList.add("fade-in"));
			init && init();
		} catch (error) {
			console.error(error);
			content.innerHTML = "<h1>Erreur de chargement</h1><p>Impossible de charger la page demandée.</p>";
		}
	} else {
		content.innerHTML = "<h1>404</h1><p>Page non trouvée.</p>";
	}
}

function updateActiveNavItem(path) {
	const navItems = document.querySelectorAll(".nav-item");
	navItems.forEach(item => {
		const href = item.getAttribute("href");
		if (href === path) {
			item.classList.add("active");
		} else {
			item.classList.remove("active");
		}
	});
}

export function navigate(path) {
	history.pushState({}, "", path);
	updateActiveNavItem(path);
	render(path);
}

function initTheme() {
	const savedTheme = getCookie('theme');
	const savedAccent = getCookie('accent');

	if (savedTheme) {
		document.documentElement.setAttribute('data-theme', savedTheme);
	}

	if (savedAccent) {
		document.documentElement.style.setProperty('--accent-color', savedAccent);
	}
}

window.addEventListener("popstate", () => render(location.pathname));

document.addEventListener("DOMContentLoaded", () => {
	initTheme();
	render(location.pathname);
	initBackground();
	initSidebar();

	document.getElementById("sidebar").addEventListener("click", (event) => {
		const target = event.target.closest("a");
		if (target && target.getAttribute("href")) {
			event.preventDefault();
			const path = target.getAttribute("href");
			navigate(path);
		}
	});

	updateActiveNavItem(location.pathname);

	const token = getToken();
	if (token) {
		const ws = WebSocketAPI.onlineStatus(token);
		ws.onopen = () => {
			console.log("WebSocket connection established for online status.");
		};
		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log("Online status update:", data);
			// Update the UI with the online status data
		};
		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};
		ws.onclose = () => {
			console.log("WebSocket connection closed for online status.");
		};
	} else {
		UserAPI.createGuest();
	}
});