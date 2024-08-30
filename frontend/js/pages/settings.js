export const settingsPage = {
	render: () => `
		<h1>Settings</h1>
		<div class="settings-container">
			<div>
				<label for="themeSelect">Select Theme:</label>
				<select id="themeSelect">
					<option value="light">Light</option>
					<option value="dark">Dark</option>
				</select>
			</div>
			<div>
				<label for="fontSelect">Select Font:</label>
				<select id="fontSelect">
					<option value="Arial">Arial</option>
					<option value="Verdana">Verdana</option>
					<option value="Times New Roman">Times New Roman</option>
					<option value="Jetbrains Mono">JetBrains Mono</options>
					<option value="Monocraft">Monocraft</options>
					<!-- Ajoutez d'autres polices selon les besoins -->
				</select>
			</div>
			<div>
				<label for="fontSizeSlider">Font Size: <span id="fontSizeValue">16</span>px</label>
				<input type="range" id="fontSizeSlider" min="10" max="30" value="16">
			</div>
			<div>
				<label for="textColorPicker">Text Color:</label>
				<input type="color" id="textColorPicker" value="#000000">
			</div>
			<div>
				<button id="resetSettingsButton">Reset to Default</button>
			</div>
		</div>
		<button onclick="spa.navigateTo('/')">Back to Home</button>
	`,
	setup: () => {
		// Initialiser les éléments du formulaire avec les valeurs sauvegardées
		document.getElementById('themeSelect').value = savedTheme;
		document.getElementById('fontSelect').value = savedFont;
		document.getElementById('fontSizeSlider').value = savedFontSize;
		document.getElementById('fontSizeValue').innerText = savedFontSize;
		document.getElementById('textColorPicker').value = savedTextColor;

		// Gestion du thème
		spa.addEventListenerTo('#themeSelect', 'change', (e) => {
			const theme = e.target.value;
			document.body.classList.toggle('dark-theme', theme === 'dark');
			localStorage.setItem('theme', theme);
		});

		// Gestion de la police
		spa.addEventListenerTo('#fontSelect', 'change', (e) => {
			const font = e.target.value;
			document.body.style.fontFamily = font;
			localStorage.setItem('fontFamily', font);
		});

		// Gestion de la taille de la police avec un curseur
		spa.addEventListenerTo('#fontSizeSlider', 'input', (e) => {
			const fontSize = e.target.value;
			document.body.style.fontSize = `${fontSize}px`;
			document.getElementById('fontSizeValue').innerText = fontSize;
			localStorage.setItem('fontSize', fontSize);
		});

		// Gestion de la couleur du texte
		spa.addEventListenerTo('#textColorPicker', 'input', (e) => {
			const color = e.target.value;
			document.body.style.color = color;
			localStorage.setItem('textColor', color);
		});

		// Réinitialiser les paramètres par défaut
		spa.addEventListenerTo('#resetSettingsButton', 'click', () => {
			localStorage.clear();
			document.body.classList.remove('dark-theme');
			document.body.style.fontFamily = 'Arial';
			document.body.style.fontSize = '16px';
			document.body.style.color = '#000000';
			document.getElementById('themeSelect').value = 'light';
			document.getElementById('fontSelect').value = 'Arial';
			document.getElementById('fontSizeSlider').value = '16';
			document.getElementById('fontSizeValue').innerText = '16';
			document.getElementById('textColorPicker').value = '#000000';
		});
	}
}
