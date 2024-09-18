import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  getUserStats,
} from "../api.js";
import { logMessage } from "../logs.js";
import { navigate } from "../spa.js";
import { createButton } from "../components/button.js";
import { createInput } from "../components/input.js";

function createAccountContent(username) {
  const userprofile = getUserProfile(username);
  const userstats = getUserStats(username);
  console.log(userprofile);
  console.log(userstats);

  const container = document.createElement("div");
  container.className = "account-content";

  const welcomeMessage = document.createElement("h1");
  welcomeMessage.textContent = `Welcome, ${userprofile.username}!`;

  const profileSection = document.createElement("div");
  profileSection.className = "profile";
  profileSection.innerHTML = `
    <h2>Profile</h2>
    <p><strong>Username:</strong> ${userprofile.username || "N/A"}</p>
    <p><strong>Joined:</strong> ${new Date(userprofile.date_joined).toLocaleDateString() || "N/A"
    }</p>
  `;

  const statsSection = document.createElement("div");
  statsSection.className = "stats";
  statsSection.innerHTML = `
    <h2>Stats</h2>
    <p><strong>Games Played:</strong> ${userstats.games_played}</p>
    <p><strong>Wins:</strong> ${userstats.win || 0}</p>
    <p><strong>Losses:</strong> ${userstats.losse || 0}</p>
    <p><strong>Win rate:</strong> ${userstats.win_rate || 0}</p>
  `;

  const homeButton = createButton("btn", "Home", () => navigate("/"));
  const logoutButton = createButton("btn", "Logout", async () => {
    try {
      await logoutUser(localStorage.getItem("token"));
      logMessage(`User ${username} logged out`, "info");
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      logMessage(`Logout failed: ${error.message}`, "error");
    }
  });

  container.appendChild(welcomeMessage);
  container.appendChild(profileSection);
  container.appendChild(statsSection);
  container.appendChild(homeButton);
  container.appendChild(logoutButton);

  return container;
}

function createLoginContent() {
  const container = document.createElement("div");
  container.className = "login-content";

  const loginForm = document.createElement("div");
  loginForm.className = "login";

  const usernameInput = createInput(
    "usernameInput",
    "text",
    "Username",
    "input-field"
  );
  const passwordContainer = document.createElement("div");
  passwordContainer.className = "password-container";

  const passwordInput = createInput(
    "passwordInput",
    "password",
    "Password",
    "input-field"
  );

  const togglePassword = document.createElement("span");
  togglePassword.id = "togglePassword";
  togglePassword.className = "toggle-password-icon";
  togglePassword.innerHTML = "&#128065;";

  passwordContainer.appendChild(passwordInput);
  passwordContainer.appendChild(togglePassword);

  const loginButton = createButton("btn", "Login", () => { });
  loginButton.id = "loginButton"; // Ajouter un ID

  const registerButton = createButton("btn", "Register", () => { });
  registerButton.id = "registerButton"; // Ajouter un ID

  const login42Button = createButton("btn", "Login with 42", () => { });

  loginForm.appendChild(usernameInput);
  loginForm.appendChild(passwordContainer);
  loginForm.appendChild(loginButton);
  loginForm.appendChild(registerButton);
  loginForm.appendChild(login42Button);

  container.appendChild(loginForm);

  return container;
}

function renderHTML(username, token) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (username && token) {
    const accountContent = createAccountContent(username, token);
    app.appendChild(accountContent);
  } else {
    const loginContent = createLoginContent();
    app.appendChild(loginContent);
  }
}

function renderCSS() {
  const styles = document.createElement("style");
  styles.textContent = `
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
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  renderHTML(username, token);
  renderCSS();

  if (username && token) {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", async () => {
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
    }

    const homeButton = document.getElementById("homeButton");
    if (homeButton) {
      homeButton.addEventListener("click", () => {
        navigate("/");
      });
    }
  } else {
    const passwordInput = document.getElementById("passwordInput");
    const toggleIcon = document.getElementById("togglePassword");

    if (passwordInput && toggleIcon) {
      toggleIcon.addEventListener("click", () => {
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          toggleIcon.innerHTML = "&#128065;";
        } else {
          passwordInput.type = "password";
          toggleIcon.innerHTML = "&#128065;";
        }
      });
    }

    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
      loginButton.addEventListener("click", async () => {
        const username = document.getElementById("usernameInput").value.trim();
        const password = document.getElementById("passwordInput").value.trim();
        if (!username || !password) {
          alert("Username and password cannot be empty.");
          return;
        }
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
    }

    const registerButton = document.getElementById("registerButton");
    if (registerButton) {
      registerButton.addEventListener("click", async () => {
        const username = document.getElementById("usernameInput").value.trim();
        const password = document.getElementById("passwordInput").value.trim();
        if (!username || !password) {
          alert("Username and password cannot be empty.");
          return;
        }
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
}