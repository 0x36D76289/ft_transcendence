import { register, login, logout } from "../api.js";
import { logMessage } from "../logs.js";

export function renderAccount() {
  const app = document.getElementById("app");
  const username = localStorage.getItem("username");

  if (username) {
    app.innerHTML = `
      <h1 class="welcome-heading">Welcome ${username}!</h1>
      <button id="logoutButton" class="logout-button">Logout</button>
    `;
    document.getElementById("logoutButton").addEventListener("click", () => {
      logMessage(`User ${username} logged out`, "info");
      logout();
    });
  } else {
    app.innerHTML = `
        <div class="login-heading">Please login or register
          <div class="input-container">
            <input type="text" id="usernameInput" class="input-field" placeholder="Username">
            <input type="password" id="passwordInput" class="input-field" placeholder="Password">
          </div>
          <div id="action-buttons">
            <button id="loginButton" class="action-button">Login</button>
            <button id="registerButton" class="action-button">Sign In</button>
          </div>
        </div>
      `;
    document.getElementById("loginButton").addEventListener("click", () => {
      const username = document.getElementById("usernameInput").value;
      const password = document.getElementById("passwordInput").value;
      logMessage(`User ${username} logged in`, "info");
      login(username, password);
    });
    document.getElementById("registerButton").addEventListener("click", () => {
      const username = document.getElementById("usernameInput").value;
      const password = document.getElementById("passwordInput").value;
      logMessage(`User ${username} registered`, "info");
      register(username, password);
    });
  }
}
