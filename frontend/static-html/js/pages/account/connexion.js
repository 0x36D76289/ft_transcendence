import { registerUser, loginUser } from "../../api/user.js";
import { createButton, createInput, createForm, createHeading, createParagraph } from "../../components.js";
import { navigate } from "../../spa.js";

const CSS = `
.connexion-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
}

.connexion-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.connexion-button {
	padding: 0.5rem 1rem;
	font-size: 1rem;
}

.home-button {
	position: absolute;
	top: 1rem;
	left: 1rem;
}
`;

export function renderConnexion() {
	const container = document.createElement("div");
	container.className = "connexion-container";

	const form = createForm(async (event) => {
		event.preventDefault();
		const username = event.target.username.value;
		const password = event.target.password.value;

		if (event.submitter.name === "register") {
			await registerUser(username, password);
			navigate("/hub");
		} else if (event.submitter.name === "login") {
			const response = await loginUser(username, password);
			localStorage.setItem("authToken", response.token);
			localStorage.setItem("username", response.username);
			navigate("/hub");
		}
	}, "connexion-form");

	const heading = createHeading(1, "Connexion", "connexion-heading");
	const usernameInput = createInput("Username", "text", "connexion-input");
	usernameInput.name = "username";
	const passwordInput = createInput("Password", "password", "connexion-input");
	passwordInput.name = "password";

	const registerButton = createButton("Register", null, "connexion-button");
	registerButton.type = "submit";
	registerButton.name = "register";

	const loginButton = createButton("Login", null, "connexion-button");
	loginButton.type = "submit";
	loginButton.name = "login";

	form.appendChild(heading);
	form.appendChild(usernameInput);
	form.appendChild(passwordInput);
	form.appendChild(registerButton);
	form.appendChild(loginButton);

	container.appendChild(form);

	const homeButton = createButton("Home", () => navigate("/"), "home-button");
	document.body.appendChild(homeButton);

	document.body.appendChild(container);

	const style = document.createElement("style");
	style.textContent = CSS;
	document.head.appendChild(style);
}
