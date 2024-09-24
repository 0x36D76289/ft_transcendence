import { loginUser, registerUser } from "../../api/user.js";
import { createButton, createDiv, createHeading, createInput, createParagraph, createForm } from "../../components.js";
import { navigate } from "../../spa.js";

const CSS = `
.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: var(--background-color);
	color: var(--text-color);
}

.login-card {
	background-color: #111;
	border-radius: 5px;
	padding: 2rem;
	width: 300px;
}

.login-title {
	font-size: var(--large-font-size);
	margin-bottom: 1rem;
	text-align: center;
}

.input-group {
	margin-bottom: 1rem;
	display: flex;
	flex-direction: column;
}

.input-group input {
	padding: 0.5rem;
	border-radius: 5px;
	border: 1px solid #ccc;
}

.button-group {
	display: flex;
	justify-content: space-between;
	margin-top: 1rem;
}

.message {
	margin-top: 1rem;
	text-align: center;
	font-size: var(--small-font-size);
}

.error-message {
	color: #ff4d4f;
}
`;

export function renderLogin() {
	const style = document.createElement("style");
	style.textContent = CSS;
	document.head.appendChild(style);

	const container = createDiv("login-container");
	const card = createDiv("login-card", container);

	createHeading(2, "Welcome", "login-title", card);

	const form = createForm(handleSubmit, "", card);

	const usernameInput = createInput("Username", "text", "input-group", form);
	const passwordInput = createInput("Password", "password", "input-group", form);

	const buttonGroup = createDiv("button-group", form);
	const loginButton = createButton("Login", handleLogin, "", buttonGroup);
	const registerButton = createButton("Register", handleRegister, "", buttonGroup);

	const message = createParagraph("", "message", card);

	async function handleLogin(event) {
		event.preventDefault();
		await handleSubmit(event, true);
	}

	async function handleRegister(event) {
		event.preventDefault();
		await handleSubmit(event, false);
	}

	async function handleSubmit(event, isLogin) {
		const username = usernameInput.value;
		const password = passwordInput.value;

		const action = isLogin ? loginUser : registerUser;
		const response = await action(username, password);

		if (response.detail) {
			message.textContent = response.detail;
			message.className = response.ok ? "message" : "message error-message";
		} else {
			message.textContent = "";
		}

		if (response.ok) {
			if (isLogin) {
				
				alert("Login successful!");
				navigate("/");
			} else {
				alert("Registration successful! Please login to continue.");
			}
		}
	}

	return container;
}
