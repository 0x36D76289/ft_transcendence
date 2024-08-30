import { homePage } from './pages/home.js';
import { playPage } from './pages/play.js';
import { settingsPage } from './pages/settings.js';
import { loginPage } from './pages/login.js';
import { registerPage } from './pages/register.js';
import { notFoundPage } from './pages/notFound.js';

const pages = {
	'/': homePage,
	'/play': playPage,
	'/settings': settingsPage,
	'/login': loginPage,
	'/register': registerPage,
	'/404': notFoundPage,
};

document.addEventListener('DOMContentLoaded', () => {
	window.spa = new SPAManager(pages);
});
