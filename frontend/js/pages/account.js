import { register, login, logout } from "../api.js";
import { logMessage } from "../logs.js";
import { navigate } from "../spa.js";

export function renderAccount() {
  const app = document.getElementById("app");
  const username = localStorage.getItem("username");

  if (username) {
    app.innerHTML = `
      <div class="header">
        <button id="homeButton">Home</button>
        <button id="logoutButton">Logout</button>
      </div>
      <div class="account-content">
        <h1>Welcome, ${username}!</h1>
        <button id="logoutButton">Logout</button>
      </div>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      .header {
        font-size: var(--large-font-size);
        color: var(--text-color);
        background-color: var(--background-color);
        padding: 1rem;
      }

      .account-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 150px); /* Subtract header height */
        text-align: center;
      }

      .account-content h1 {
        font-size: var(--large-font-size);
        margin-bottom: 2rem;
      }

      button {
        font-size: var(--font-size);
        padding: 1rem;
        background-color: #333;
        color: var(--text-color);
        border: none;
        cursor: pointer;
        width: 50%;
        max-width: 300px;
      }

      button:hover {
        background-color: #555;
      }
    `;

    document.head.appendChild(style);

    document.getElementById("logoutButton").addEventListener("click", () => {
      logMessage(`User ${username} logged out`, "info");
      logout();
    });
  } else {
    app.innerHTML = `
      <button id="homeButton" class="home-button">Home</button>
      <div class="login-content">
        <div class="login">
          <input id="usernameInput" type="text" placeholder="Username">
          <div class="password-container">
            <input id="passwordInput" type="password" placeholder="Password">
            <span id="togglePassword" class="toggle-password-icon">&#128065;</span>
          </div>
          <button id="loginButton">Login</button>
          <button id="registerButton">Register</button>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      .home-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: var(--small-font-size);
        padding: 0.5rem 1rem;
        background-color: #333;
        color: var(--text-color);
        border: none;
        cursor: pointer;
      }

      .home-button:hover {
        background-color: #555;
      }

      .login-content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 150px);
      }

      .login {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        max-width: 300px;
      }

      input {
        font-size: var(--font-size);
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
      }

      .password-container {
        position: relative;
      }

      .password-container input {
        padding-right: 2.5rem;
      }

      .toggle-password-icon {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
      }
    `;

    document.head.appendChild(style);

    // Toggle password visibility
    document.getElementById("togglePassword").addEventListener("click", () => {
      const passwordInput = document.getElementById("passwordInput");
      const toggleIcon = document.getElementById("togglePassword");
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.innerHTML = "&#128065;";
      } else {
        passwordInput.type = "password";
        toggleIcon.innerHTML = "&#128065;";
      }
    });

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

  document.getElementById("homeButton").addEventListener("click", () => {
    navigate("/");
  });
}
