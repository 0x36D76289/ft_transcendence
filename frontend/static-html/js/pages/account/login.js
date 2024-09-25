import { postData } from "../../api/utils.js";
import { navigate, addRoute, loadPage } from "../../spa.js";
import { createCookie } from "../../cookie.js";
import { renderProfile } from "./profile.js";

const htmlContent = `
<div class="login-container">
  <h1>Login or Register</h1>
  <input id="username" type="text" placeholder="Username" class="input-field" /><br />
  <input id="password" type="password" placeholder="Password" class="input-field" /><br />
  <button id="login-button" class="action-button">Login</button>
  <button id="register-button" class="action-button">Register</button>
  <button id="home-button" class="home-button">Back to Home</button>
  <p id="message"></p>
</div>
`;

const cssContent = `
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.input-field {
  margin-bottom: 10px;
}
.action-button {
  margin-top: 10px;
}
.home-button {
  margin-top: 20px;
}
`;

export function renderLogin() {


  // Load the HTML and CSS content
  loadPage(htmlContent, cssContent);

  // Event listeners for Login and Register buttons
  document.getElementById("login-button").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
      const response = await postData("/user/login", {}, { username, password });
      if (response.token) {
        createCookie("authToken", response.token, 7);  // Store token for 7 days
        createCookie("username", response.username, 7);  // Store username
        addRoute(`/${response.username}`, (params) => renderProfile(params.username));
        navigate("/home");
      } else {
        document.getElementById("message").textContent = "Login failed. Please try again.";
      }
    } else {
      document.getElementById("message").textContent = "Please enter both username and password.";
    }
  });

  document.getElementById("register-button").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
      const response = await postData("/user/register", {}, { username, password });
      if (response.username) {
        document.getElementById("message").textContent = "Registration successful! You can now log in.";
      } else {
        document.getElementById("message").textContent = "Registration failed. Please try again.";
      }
    } else {
      document.getElementById("message").textContent = "Please enter both username and password.";
    }
  });

  // Event listener for Back to Home button
  document.getElementById("home-button").addEventListener("click", () => {
    navigate("/home");
  });
}