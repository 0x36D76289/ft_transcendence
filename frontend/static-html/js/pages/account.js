import { registerUser, loginUser, logoutUser } from "../api.js";
import { logMessage } from "../logs.js";
import { navigate } from "../spa.js";

function renderHTML(username, token) {
  const app = document.getElementById("app");

  if (username && token) {
    // TODO: Implement a map of every user's connected.
    // TODO: Implement a chat.
    // TODO: Implement a game.
    // TODO: Implement a profile picture.
    app.innerHTML = `
      <div class="account-content">
        <h1>Welcome, ${username}!</h1>
        <button id="logoutButton" class="btn">Logout</button>
      </div>`;
  } else {
    app.innerHTML = `
      <div class="login-content">
        <div class="login">
          <input id="usernameInput" type="text" placeholder="Username" class="input-field">
          <div class="password-container">
            <input id="passwordInput" type="password" placeholder="Password" class="input-field">
            <span id="togglePassword" class="toggle-password-icon">&#128065;</span>
          </div>
          <button id="loginButton" class="btn">Login</button>
          <button id="registerButton" class="btn">Register</button>
        </div>
      </div>`;
  }
}

function renderCSS() {
  const styles = document.createElement("style");
  styles.textContent = `
/* Account and login page styles */
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

.input-field {
  font-family: var(--font-family);
  font-size: var(--font-size);
  padding: 1rem;
  background-color: #222;
  color: var(--text-color);
  border: 1px solid #444;
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

.btn {
  font-family: var(--font-family);
  font-size: var(--small-font-size);
  padding: 0.5rem 1rem;
  background-color: var(--button-bg-color);
  color: var(--text-color);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: var(--button-hover-bg-color);
}

.btn:active {
  background-color: var(--button-active-bg-color);
}

.account-content {
  left: 50%;
  top: 50%;
  padding: 1rem 2rem;
  transform: translate(-50%, -50%);
  position: absolute;
}

.account-content h1 {
  font-size: var(--large-font-size);
  margin-bottom: 1rem;
}
  `;
  document.head.appendChild(styles);
}

export function renderAccount() {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  renderHTML(username, token);
  renderCSS();

  if (username && token) {
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

    // Login event listener
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
          alert("Login failed. Please check your username or password.");
        }
      });

    // Register event listener
    document
      .getElementById("registerButton")
      .addEventListener("click", async () => {
        const username = document.getElementById("usernameInput").value;
        const password = document.getElementById("passwordInput").value;
        try {
          await registerUser(username, password);
          logMessage(`User ${username} registered`, "info");

          const loginResponse = await loginUser(username, password);
          localStorage.setItem("username", username);
          localStorage.setItem("token", loginResponse.token);
          navigate("/account");
        } catch (error) {
          logMessage(`Registration failed: ${error.message}`, "error");
          alert("Registration failed. Please try again.");
        }
      });
  }
}
