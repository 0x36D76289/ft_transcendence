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
`

const CSS = `
.login-content-box {
  background-color: #2f2f2f;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
}

.login-content .username-input, .login-content .password-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.login-content .username-input label, .login-content .password-input label {
  color: #ffffff;
  margin-bottom: 5px;
}

.login-content input {
  width: 100%;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #3f3f3f;
  color: #ffffff;
}

.login-content input::placeholder {
  color: #888;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.button-container button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-container button:hover {
  background-color: #45a049;
}

.button-container .register-button {
  background-color: #008cba;
}

.button-container .register-button:hover {
  background-color: #007bb5;
}

.message {
  color: #ffffff;
  text-align: center;
  margin-top: 10px;
}
`

export function login() {
	loadPage(HTML, CSS);

	document.getElementById("login").addEventListener("click", async () => {
		const username = document.getElementById("username").value;
		const password = document.getElementById("password").value;
		const messageDiv = document.querySelector(".message");

		try {
			const response = await postData("/user/login", {}, { username, password });
			if (response.token) {
				createCookie("authToken", response.token, 7);
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