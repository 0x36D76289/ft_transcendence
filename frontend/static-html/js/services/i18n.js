import { getLanguages } from '../utils/cookies.js'

let currentLanguage = getLanguages();
let translations = {};

export const i18n = {
	async init(lang = 'en') {
		currentLanguage = lang;
		try {
			const response = await fetch(`../../assets/translations/${lang}.json`);
			translations = await response.json();
			console.log("translations = ", translations);
		} catch (error) {
			console.error(`Error loading translations for ${lang}:`, error);
		}
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


	setLanguage(lang) {
		this.init(lang);
	}
};
