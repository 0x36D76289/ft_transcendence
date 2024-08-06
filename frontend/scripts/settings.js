export function initializeSettings(game) {
	const root = document.documentElement;
	const fontSizeRange = document.getElementById('fontSizeRange');
	const fontSizeValue = document.getElementById('fontSizeValue');
	const bgColorSelect = document.getElementById('bgColorSelect');
	const saveSettingsBtn = document.getElementById('saveSettingsBtn');

	const initialFontSize = fontSizeRange.value;
	document.documentElement.style.setProperty('--font-size-default', `${initialFontSize}px`);
	fontSizeValue.textContent = `${initialFontSize}px`;

	document.getElementById('settingsBtn').addEventListener('click', () => {
		document.getElementById('settings').style.display = document.getElementById('settings').style.display === 'block' ? 'none' : 'block';
	});

	fontSizeRange.addEventListener('input', (event) => {
		const newSize = event.target.value;
		fontSizeValue.textContent = newSize + 'px';
	});

	saveSettingsBtn.addEventListener('click', () => {
		root.style.setProperty('--font-size-default', `${fontSizeRange.value}px`);
		root.style.setProperty('--background-color', bgColorSelect.value);
		root.style.setProperty('--text-color', bgColorSelect.value === 'black' ? 'white' : 'black');

		document.getElementById('settings').style.display = 'none';
		window.dispatchEvent(new Event('settingschanged'));
	});
}
