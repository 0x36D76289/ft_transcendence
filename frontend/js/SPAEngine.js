import {API} from "./api";

export class SPAEngine {
  constructor() {
    this.routes = {};
    this.api = new API("https://localhost:8000/");
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    if (this.routes[path]) {
      this.routes[path]();
    } else {
      this.navigate("/");
    }
  }

  renderHeader() {
    let header = document.querySelector("header");
    if (!header) {
      header = document.createElement("header");
      document.body.insertBefore(header, document.body.firstChild);
    } else {
      header.innerHTML = "";
    }

    Object.keys(this.routes).forEach((route) => {
      const button = document.createElement("button");
      button.innerText = route === "/" ? "Home" : route;
      button.addEventListener("click", () => {
        window.location.hash = route;
      });
      header.appendChild(button);
    });
  }

  start() {
    window.addEventListener("hashchange", () => {
      this.navigate(window.location.hash.substring(1));
    });

    if (window.location.hash) {
      this.navigate(window.location.hash.substring(1));
    } else {
      this.navigate("/");
    }
  }

  // Home page render
  renderHomePage() {
    const app = document.getElementById("app");
    app.innerHTML = ""; // Clear existing content

    const welcomeMsg = document.createElement("h1");
    if (this.api.isLoggedIn()) {
      welcomeMsg.textContent = `Welcome, ${this.api.getUserName()}`;
      const logoutBtn = document.createElement("button");
      logoutBtn.textContent = "Logout";
      logoutBtn.addEventListener("click", () => this.api.logout());
      app.appendChild(logoutBtn);
    } else {
      welcomeMsg.textContent = "Welcome, please log in or sign up";
    }
    app.appendChild(welcomeMsg);
  }

  // Authentication page render
  renderAuthPage() {
    const app = document.getElementById("app");
    app.innerHTML = "";

    const form = document.createElement("form");
    form.innerHTML = `
			<h2>Login or Sign Up</h2>
			<label for="username">Username</label>
			<input type="text" id="username" name="username" required>
			<label for="password">Password</label>
			<input type="password" id="password" name="password" required>
			<button type="submit">Login</button>
			<button type="button" id="signup-btn">Sign Up</button>
		`;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      await this.api.login(username, password);
      window.location.hash = "/";
    });

    document
      .getElementById("signup-btn")
      .addEventListener("click", async () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        await this.api.register(username, password);
        window.location.hash = "/";
      });

    app.appendChild(form);
  }
}
