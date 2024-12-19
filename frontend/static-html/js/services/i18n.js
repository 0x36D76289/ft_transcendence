import { getLanguages } from '../utils/cookies.js'
import { UserAPI } from '../api/user.js'
import { initSidebar } from '../components/sidebar.js';
import { getToken } from '../utils/cookies.js';

let currentLanguage = getLanguages();
let translations = {};
let subscribers = [];

export const i18n = {
	async init(lang = 'en') {
		currentLanguage = lang;
		try {
			const response = await fetch(`../../assets/translations/${lang}.json`);
			translations = await response.json();
		} catch (error) {
			console.error(`Error loading translations for ${lang}:`, error);
		}
	},

	getLanguage() {
		return currentLanguage;
	},

	subscribe(callback) {
		subscribers.push(callback);
		return () => {
			subscribers = subscribers.filter(sub => sub !== callback);
		};
	},


	t(key) {
		if (!translations || Object.keys(translations).length === 0) {
			console.warn('Translations not initialized yet');
			return key;
		}

		const value = key.split('.').reduce((obj, segment) => {
			if (obj && typeof obj === 'object' && segment in obj) {
				return obj[segment];
			}
			return undefined;
		}, translations);

		if (value === undefined) {
			console.warn(`Translation key "${key}" not found.`);
			return key;
		}

		return value;
	},

	async setLanguage(lang) {
		await this.init(lang);
		subscribers.forEach(callback => callback());
	},

	async updateTranslations() {
		const elements = document.querySelectorAll('[data-i18n]');
		elements.forEach(element => {
			const key = element.getAttribute('data-i18n');
			if (element.tagName === 'INPUT' && element.type === 'submit')
				element.value = i18n.t(key);
			else
				element.textContent = i18n.t(key);
		});

		// Cas particuliers :
		const titleElement = document.querySelector('title');
		if (titleElement) {
			titleElement.textContent = i18n.t('head.title');
		}

		// if (getToken() && (await UserAPI.isTokenValid(getToken())))
		// 	await initSidebar();
	}

};
