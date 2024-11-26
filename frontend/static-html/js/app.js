import { initBackground } from "./components/background.js";
import { initSidebar } from "./components/sidebar.js";
import { getToken } from "./utils/cookies.js";
import { Settings } from "./pages/settings.js";

/* ******************** SPA ******************** */
// Constants
const CONTENT_ELEMENT = document.getElementById("content");
const ROUTES = {
	"/": "home",
	"/settings": "settings",
	"/friends": "friends",
	"/tournaments": "tournaments",
	"/messages": "messages",
	"/game": "game",
	"/user": "user",
	"/auth": "auth",
	"/pong": "pong/main",
};

// CSS Management
function loadCSS(filename) {
	const cssLink = `link[href="${filename}"]`;
	if (!document.querySelector(cssLink)) {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = filename;
		document.head.appendChild(link);
		console.log(`Loaded CSS: ${filename}`);
	}
}

// Page Navigation
async function renderPage(path) {
	const pageModule = ROUTES[path];
	if (!pageModule) {
		renderError("404", "Page non trouvée.");
		return;
	}

	try {
		console.log(`Loading page: ${pageModule}`);
		loadCSS(`./css/pages/${pageModule}.css`);

		const { render, init } = await import(`./pages/${pageModule}.js`);
		const pageContent = createPageContent(render());

		CONTENT_ELEMENT.innerHTML = "";
		CONTENT_ELEMENT.appendChild(pageContent);

		requestAnimationFrame(() => pageContent.classList.add("fade-in"));
		if (init) init();
	} catch (error) {
		console.error(error);
		renderError("Erreur de chargement", "Impossible de charger la page demandée.");
	}
}

function createPageContent(html) {
	const pageContent = document.createElement("div");
	pageContent.classList.add("page-transition");
	pageContent.innerHTML = html;
	return pageContent;
}

function renderError(title, message) {
	CONTENT_ELEMENT.innerHTML = `<h1>${title}</h1><p>${message}</p>`;
}

export function navigate(path) {
	if (path !== "/auth" && !getToken()) {
		navigate("/auth");
		return;
	}

	history.pushState({}, "", path);
	updateActiveNavItem(path);
	renderPage(path);

	console.log(`Navigated to: ${path}`);
}

/* ******************** SPA ******************** */

function updateActiveNavItem(path) {
	document.querySelectorAll(".nav-item").forEach(item => {
		const href = item.getAttribute("href");
		item.classList.toggle("active", href === path);
	});
}

function initSidebarNavigation() {
	document.getElementById("sidebar").addEventListener("click", (event) => {
		const target = event.target.closest("a");
		if (target?.getAttribute("href")) {
			event.preventDefault();
			navigate(target.getAttribute("href"));
		}
	});
}

// Event Listeners
window.addEventListener("popstate", () => navigate(location.pathname));


// Initialization
export let currentSettings = new Settings();
currentSettings.applyToDOM();

initBackground();
if (getToken() != null) {
	await initSidebar();
	initSidebarNavigation();
	if (location.pathname === "/auth") navigate("/");
	updateActiveNavItem(location.pathname);
	renderPage(location.pathname);
} else {
	navigate("/auth");
}
