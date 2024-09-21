import { loginUser, registerUser } from "../../api/user.js";
import { createButton, createInput, createForm, createHeading, createDiv } from "../../components.js";
import { navigate } from "../../spa.js";

const CSS = `
.connexion-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2rem;
}
`;

export function renderLogin() {
	// load CSS
	const style = document.createElement("style");
	style.textContent = CSS;
	document.head.appendChild(style);

	const container = createDiv("connexion-container");

	const usernameInput = createInput("Username", "text", "connexion-input", container);
	const passwordInput = createInput("Password", "password", "connexion-input", container);

	const username = usernameInput.value;
	const password = passwordInput.value;

	const loginButton = createButton("Login", async () => {
		const response = await loginUser(username, password);

		if (response.token) {
			navigate("/home");
		}
	}, "connexion-button", container);

	const registerButton = createButton("Register", () => {
		const response = registerUser(username, password);

		if (response.token) {
			navigate("/home");
		}
	}, "connexion-button", container);
}
