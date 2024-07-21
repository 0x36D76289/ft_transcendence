let translations = {};

function loadTranslations(language) {
	const cachedTranslations = localStorage.getItem(`translations-${language}`);
	if (cachedTranslations) {
		translations = JSON.parse(cachedTranslations);
		updateLanguage(language);
	} else {
		const filePath = `../assets/translations/${language}.json`;
		fetch(filePath)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				translations = data;
				localStorage.setItem(`translations-${language}`, JSON.stringify(data));
				updateLanguage(language);
			})
			.catch(error => {
				console.error('Error loading translations:', error);
				alert('Failed to load language file. Please try again.');
			});
	}
}

function updateLanguage(language) {
	document.getElementById('playButton').textContent = translations.playButton;
	document.getElementById('languageSwitcher').textContent = translations.languageSwitcher;
}

document.getElementById('languageSwitcher').addEventListener('click', () => {
	const currentLang = document.documentElement.lang;
	const newLang = currentLang === 'en' ? 'fr' : 'en';

	document.documentElement.lang = newLang;
	loadTranslations(newLang);
	localStorage.setItem('selectedLanguage', newLang);
});

document.addEventListener('DOMContentLoaded', () => {
	const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
	document.documentElement.lang = savedLanguage;
	loadTranslations(savedLanguage);
});
