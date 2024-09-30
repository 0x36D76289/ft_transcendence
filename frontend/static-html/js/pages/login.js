import { loadPage, navigate } from "../spa.js";
import { postData } from "../api/utils.js";
import { createCookie } from "../cookie.js";

const HTML = `
<div class="login-content-box">
  <div class="login-content">
    <div class="username-input">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" placeholder="Username">
    </div>
    <div class="password-input">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" placeholder="Password">
    </div>
    <div class="button-container">
      <button id="login-button">Login</button>
      <button id="register-button">Register</button>
    </div>
    <div class="message"></div>
  </div>
</div>
`;

const CSS = `
.login-content-box {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20rem;
	border-radius: 20px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	width: 300px;
	height: 300px;
	background-color: azure;
}

.login-content {
	display: flex;
	flex-direction: column;
	width: auto;
}

.username-input, .password-input {
	margin-bottom: 1rem;
}

.button-container {
	display: flex;
	justify-content: space-evenly;
	flex-direction: row;
}

.message {
	margin-top: 1rem;
	color: red;
}
`;

export function login() {
	loadPage(HTML, CSS);

	document.getElementById("login").addEventListener("click", async () => {
		const username = document.getElementById("username").value;
		const password = document.getElementById("password").value;
		const messageDiv = document.querySelector(".message");

		try {
			const response = await postData("/user/login", {}, { username, password });
			if (response.token) {
				createCookie("token", response.token, 7);
				navigate("/");
			} else {
				messageDiv.textContent = response.detail || "Login failed";
			}
		} catch (error) {
			messageDiv.textContent = "An error occurred during login";
		}
	});

	document.getElementById("register").addEventListener("click", async () => {
		const username = document.getElementById("username").value;
		const password = document.getElementById("password").value;
		const messageDiv = document.querySelector(".message");

		try {
			const response = await postData("/user/register", {}, { username, password });
			if (response.username) {
				messageDiv.textContent = "Registration successful. Please log in.";
			} else {
				messageDiv.textContent = response.detail || "Registration failed";
			}
		} catch (error) {
			messageDiv.textContent = "An error occurred during registration";
		}
	});
}