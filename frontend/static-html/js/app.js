import { initBackground } from "./components/background.js";
import { initSidebar } from "./components/sidebar.js";
import { getCookie, getToken } from "./utils/cookies.js";

/* ******************** SPA ******************** */
// Constants
const CONTENT_ELEMENT = document.getElementById("content");
const ROUTES = {
	"/": "friends",
	"/settings": "settings",
	"/friends": "friends",
	"/tournaments": "tournaments",
	"/messages": "messages",
	"/game": "game",
	"/user": "user",
	"/login": "login",
};

// CSS Management
function loadCSS(filename) {
	const cssLink = `link[href="${filename}"]`;
	if (!document.querySelector(cssLink)) {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = filename;
		document.head.appendChild(link);
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
	if (path !== "/login" && !getToken()) {
		navigate("/login");
		return;
	}
	if (getToken())
	{
		initSidebar();
		initSidebarNavigation();
	}

	history.pushState({}, "", path);
	updateActiveNavItem(path);
	renderPage(path);
}

/* ******************** SPA ******************** */

function updateActiveNavItem(path) {
	document.querySelectorAll(".nav-item").forEach(item => {
		const href = item.getAttribute("href");
		item.classList.toggle("active", href === path);
	});
}

function initTheme() {
	const savedTheme = getCookie('theme');
	const savedAccent = getCookie('accentColor');

	if (savedTheme) {
		const theme = savedTheme === 'system'
			? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			: savedTheme;
		document.documentElement.setAttribute('data-theme', theme);
	}

	if (savedAccent) {
		document.documentElement.style.setProperty('--accent-color', savedAccent);
	}
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

initTheme();
initBackground();

if (getToken()) {
	initSidebar();
	initSidebarNavigation();
}

updateActiveNavItem(location.pathname);
navigate(location.pathname);