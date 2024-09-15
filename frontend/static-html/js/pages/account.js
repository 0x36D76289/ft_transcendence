import { registerUser, loginUser, logoutUser } from "../api.js";
import { logMessage } from "../logs.js";
import { navigate } from "../spa.js";

function renderCSS() {
  return `
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
}

export function renderAccount() {
  const app = document.getElementById("app");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  if (username && token) {
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
    style.innerHTML = renderCSS();
    document.head.appendChild(style);
    document
      .getElementById("logoutButton")
      .addEventListener("click", async () => {
        try {
          await logoutUser(token);
          logMessage(`User ${username} logged out`, "info");
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          navigate("/");
        } catch (error) {
          logMessage(`Logout failed: ${error.message}`, "error");
        }
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
    style.innerHTML = renderCSS();
    document.head.appendChild(style);
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
    document
      .getElementById("loginButton")
      .addEventListener("click", async () => {
        const username = document.getElementById("usernameInput").value;
        const password = document.getElementById("passwordInput").value;
        try {
          const response = await loginUser(username, password);
          localStorage.setItem("username", username);
          localStorage.setItem("token", response.token);
          logMessage(`User ${username} logged in`, "info");
          navigate("/account");
        } catch (error) {
          logMessage(`Login failed: ${error.message}`, "error");
        }
      });
    document
      .getElementById("registerButton")
      .addEventListener("click", async () => {
        const username = document.getElementById("usernameInput").value;
        const password = document.getElementById("passwordInput").value;
        try {
          await registerUser(username, password);
          logMessage(`User ${username} registered`, "info");
          // Automatically log in after successful registration
          const loginResponse = await loginUser(username, password);
          localStorage.setItem("username", username);
          localStorage.setItem("token", loginResponse.token);
          navigate("/account");
        } catch (error) {
          logMessage(`Registration failed: ${error.message}`, "error");
        }
      });
  }
  document.getElementById("homeButton").addEventListener("click", () => {
    navigate("/");
  });
}
