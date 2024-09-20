import { registerUser } from "../../api/user.js";
import { createButton, createInput, createForm, createHeading, createParagraph } from "../../components.js";
import { navigate } from "../../spa.js";

const CSS = `
.connexion-container {
	max-width: 400px;
	margin: 0 auto;
	padding: 2rem;
	text-align: center;
	border: 1px solid #ccc;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	background-color: #f9f9f9;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.connexion-heading {
	font-size: 2rem;
	margin-bottom: 1rem;
	color: #333;
}

.connexion-input {
	width: 100%;
	padding: 0.5rem;
	margin-bottom: 1rem;
	border: 1px solid #ccc;
	border-radius: 4px;
	font-size: 1rem;
}

.connexion-button {
	width: 48%;
	padding: 0.5rem;
	margin: 0.5rem 1%;
	border: none;
	border-radius: 4px;
	font-size: 1rem;
	cursor: pointer;
	transition: background-color 0.3s ease;
}

.connexion-button:hover {
	background-color: #0078d4;
	color: #fff;
}

.connexion-error {
	color: red;
	margin-top: 1rem;
}
`;

export function renderConnexion() {
	const container = document.createElement("div");
	container.className = "connexion-container";

	const heading = createHeading(1, "Sign Up / Login", "connexion-heading");
	container.appendChild(heading);

	const form = createForm(async (event) => {
		event.preventDefault();
		const username = event.target.username.value;
		const password = event.target.password.value;

		if (event.submitter.id === "register-button") {
			try {
				const response = await registerUser(username, password);
				console.log(response);
				navigate("/profile");
			} catch (error) {
				const errorParagraph = createParagraph("Failed to register. Please try again.", "connexion-error");
				container.appendChild(errorParagraph);
			}
		} else if (event.submitter.id === "login-button") {
			try {
				const response = await loginUser(username, password);
				localStorage.setItem("authToken", response.token);
				navigate("/profile");
			} catch (error) {
				const errorParagraph = createParagraph("Failed to login. Please try again.", "connexion-error");
				container.appendChild(errorParagraph);
			}
		}
	});

	const usernameInput = createInput("text", "username", "Username", "connexion-input");
	const passwordInput = createInput("password", "password", "Password", "connexion-input");

	const registerButton = createButton("Register", null, "connexion-button");
	registerButton.id = "register-button";

	const loginButton = createButton("Login", null, "connexion-button");
	loginButton.id = "login-button";

	form.appendChild(usernameInput);
	form.appendChild(passwordInput);
	form.appendChild(registerButton);
	form.appendChild(loginButton);

	container.appendChild(form);
	document.body.appendChild(container);

	const style = document.createElement("style");
	style.textContent = CSS;
	document.head.appendChild(style);
}
