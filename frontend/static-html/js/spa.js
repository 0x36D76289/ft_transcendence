import { flashlightEvent, initflashlight } from "./utils/flashlight.js";
import { initBlurCircle } from "./utils/blurcircle.js";
import { backgroundEvent, initBackground } from "./utils/background.js";
import { readCookie } from "./cookie.js";

let routes = {};
let currentPath = null;

export function addRoute(path, handler) {
  console.log(`Adding route for ${path}`);
  routes[path] = handler;
}

export function removeRoute(path) {
  console.log(`Removing route for ${path}`);
  delete routes[path];
}

function injectContent(htmlContent, cssContent = "") {
  const [flashlightHTML, flashlightCSS] = initflashlight();
  const [blurCircleHTML, blurCircleCSS] = initBlurCircle();
	const [backgroundHTML, backgroundCSS] = initBackground();
  
  document.body.innerHTML = `
  ${htmlContent}
  ${blurCircleHTML}
  ${backgroundHTML}
  ${flashlightHTML}
  <audio id="clickSound">
    <source src="assets/sounds/click.mp3" type="audio/mp3">
    Your browser does not support the audio element.
  </audio>
  `;

  document.querySelectorAll('button, .nav-button, .settings-btn, .logout-btn, .play-btn, .user-profile').forEach(element => {
    element.addEventListener('click', () => {
      clickSound.play();
    });
  });

  const styleElement = document.createElement("style");
  styleElement.textContent = `
  ${cssContent}
  ${blurCircleCSS}
  ${backgroundCSS}
  ${flashlightCSS}
  `;

  document.head.appendChild(styleElement);
  backgroundEvent();
  flashlightEvent();
}

export function navigate(path, pushState = true) {
  if (routes[path]) {
    console.log(`Navigating to ${path}`);

    if (path === currentPath) {
      console.log(`Already on ${path}, skipping content reload`);
      return;
    }

    if (readCookie("token") === null && path !== "/login" && routes["/login"] !== undefined) {
      path = "/login";
    }

    const { html, css } = routes[path]();
    loadPage(html, css);
    currentPath = path;

    if (pushState) {
      window.history.pushState({ path }, "", path);
    }
  } else {
    console.log(`Route for ${path} not found. Redirecting to /`);
    navigate("/", pushState);
  }
}

export function start() {
  console.log("Starting SPA");

  // Navigate to the current path (on page load)
  const initialPath = window.location.pathname;
  navigate(initialPath, false);

  // Listen for the back/forward button events
  window.addEventListener("popstate", (event) => {
    const path = event.state?.path || "/home";
    navigate(path, false);
  });
}

// Helper function to inject HTML and CSS content
export function loadPage(htmlContent, cssContent = "") {
  injectContent(htmlContent, cssContent);
}
