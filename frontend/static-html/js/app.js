import { initBackground } from "./components/background.js";
import { initSidebar } from "./components/sidebar.js";
import { getToken } from "./utils/cookies.js";
import { Settings } from "./pages/settings.js";

/* ******************** Constants & Config ******************** */
const CONTENT_ELEMENT = document.getElementById("content");
const PUBLIC_ROUTES = ["/auth"];
const ROUTES = {
	"/": "home",
	"/settings": "settings",
	"/friends": "friends",
	"/tournaments": "tournaments",
	"/messages": "messages",
	"/user": "user",
	"/auth": "auth",
	"/pong": "pong/main",
};

/* ******************** Security Middleware ******************** */
function checkAuth() {
	const token = getToken();
	const currentPath = location.pathname;

	if (!token && !PUBLIC_ROUTES.includes(currentPath)) {
		console.log("Accès non autorisé - Redirection vers /auth");
		navigate("/auth", { replace: true });
		return false;
	}

	if (token && currentPath === "/auth") {
		console.log("Déjà authentifié - Redirection vers /");
		navigate("/", { replace: true });
		return false;
	}

	return true;
}

/* ******************** CSS Management ******************** */
async function loadCSS(filename) {
	return new Promise((resolve, reject) => {
		const cssLink = `link[href="${filename}"]`;
		if (document.querySelector(cssLink)) {
			resolve();
			return;
		}

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = filename;

		link.onload = () => {
			console.log(`Loaded CSS: ${filename}`);
			resolve();
		};

		link.onerror = () => {
			console.error(`Failed to load CSS: ${filename}`);
			reject(new Error(`Failed to load CSS: ${filename}`));
		};

		document.head.appendChild(link);
	});
}
/* ******************** Page Navigation ******************** */
async function renderPage(path) {
	// Vérification de sécurité avant tout rendu
	if (!checkAuth()) return;

	const pageModule = ROUTES[path];
	if (!pageModule) {
		renderError("404", "Page non trouvée.");
		return;
	}

	try {
		console.log(`Loading page: ${pageModule}`);
		document.body.classList.remove('loaded');

		// Charger le CSS en premier
		await loadCSS(`./css/pages/${pageModule}.css`);

		const { render, init } = await import(`./pages/${pageModule}.js`);
		const pageContent = createPageContent(render());

		CONTENT_ELEMENT.innerHTML = "";
		CONTENT_ELEMENT.appendChild(pageContent);

		// Attendre un frame pour s'assurer que le DOM est prêt
		await new Promise(resolve => requestAnimationFrame(resolve));

		// Marquer comme chargé et ajouter la transition
		document.body.classList.add('loaded');
		pageContent.classList.add("fade-in");

		if (init) await init();
	} catch (error) {
		console.error("Erreur lors du rendu de la page:", error);
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
	CONTENT_ELEMENT.innerHTML = `
<div class="error-container">
	<h1>${title}</h1>
	<p>${message}</p>
</div>
	`;
	const errorContainer = document.querySelector(".error-container");
	errorContainer.style.color = "red";
	errorContainer.style.textAlign = "center";
	errorContainer.style.marginTop = "20px";
}

export function navigate(path, options = {}) {
	// Vérification préalable de l'authentification
	const token = getToken();
	if (!PUBLIC_ROUTES.includes(path) && !token) {
		console.log("Navigation bloquée - Token manquant");
		navigate("/auth", { replace: true });
		return;
	}

	if (options.replace) {
		history.replaceState({}, "", path);
	} else {
		history.pushState({}, "", path);
	}

	if (path !== "/auth") {
		updateActiveNavItem(path);
	}
	renderPage(path);
	console.log(`Navigation vers: ${path}`);
}

/* ******************** UI Updates ******************** */
function updateActiveNavItem(path) {
	document.querySelectorAll(".nav-item").forEach(item => {
		const href = item.getAttribute("href");
		item.classList.toggle("active", href === path);
	});
}

function initSidebarNavigation() {
	document.getElementById("sidebar")?.addEventListener("click", (event) => {
		const target = event.target.closest("a");
		if (target?.getAttribute("href")) {
			event.preventDefault();
			navigate(target.getAttribute("href"));
		}
	});
}

/* ******************** Event Listeners ******************** */
i18n.init(getLanguages());

window.addEventListener("popstate", () => {
	const currentPath = location.pathname;
	if (!checkAuth()) return;
	renderPage(currentPath);
});
/* ******************** Initialization ******************** */
export let currentSettings = new Settings();
currentSettings.applyToDOM();

// Séquence d'initialisation sécurisée
async function initApp() {
	try {
		document.body.classList.remove('loaded');

		// Attendre le chargement des CSS principaux
		await Promise.all([
			loadCSS('./css/styles.css'),
			loadCSS('./css/components/sidebar.css'),
			loadCSS('./css/components/background.css'),
			loadCSS('./css/components/popup.css')
		]);

		initBackground();

		const token = getToken();
		if (token) {
			create_socket();
			await initSidebar();
			initSidebarNavigation();

			if (location.pathname === "/auth") {
				navigate("/", { replace: true });
			} else {
				updateActiveNavItem(location.pathname);
				await renderPage(location.pathname);
			}
		} else {
			navigate("/auth", { replace: true });
		}

		// Une fois tout chargé, marquer comme prêt
		document.body.classList.add('loaded');
	} catch (error) {
		console.error("Erreur d'initialisation:", error);
		renderError("Erreur d'initialisation", "Impossible d'initialiser l'application.");
	}
}

// Démarrage de l'application
initApp();
