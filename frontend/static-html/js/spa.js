import { sidebar } from "./utils/sidebar.js";
import { createBlurCircle, initBlurCicle } from "./utils/blurcircle.js";
import { flashlightEvent, initflashlight } from "./utils/flashlight.js";
import { pixelBreakerEvent, initPixelBreaker } from "./utils/pixelbreaker.js";

let routes = {};

export function addRoute(path, handler) {
  console.log(`Adding route for ${path}`);
  routes[path] = handler;
}

export function removeRoute(path) {
  console.log(`Removing route for ${path}`);
  delete routes[path];
}

function injectContent(htmlContent, cssContent = "") {
  const [sidebarHTML, sidebarCSS] = sidebar();
  const [pixelbreakerHTML, pixelbreakerCSS] = initPixelBreaker();
  const [blurCircleHTML, blurCircleCSS] = initBlurCicle();
  const [flashlightHTML, flashlightCSS] = initflashlight();
  document.body.innerHTML = `
  ${sidebarHTML}
  ${htmlContent}
  ${pixelbreakerHTML}
  ${blurCircleHTML}
  ${flashlightHTML}
  <audio id="clickSound">
    <source src="assets/sounds/click.mp3" type="audio/mp3">
    Your browser does not support the audio element.
  </audio>
  `;

  document.querySelectorAll('.nav-button, .settings-btn, .logout-btn, .play-btn, .user-profile').forEach(element => {
    element.addEventListener('click', () => {
      clickSound.play();
    });
  });

  const styleElement = document.createElement("style");
  styleElement.textContent = `
  ${sidebarCSS}
  ${cssContent}
  ${pixelbreakerCSS}
  ${blurCircleCSS}
  ${flashlightCSS}
  `;

  document.head.appendChild(styleElement);
  createBlurCircle();
  flashlightEvent();
  pixelBreakerEvent();
}

export function navigate(path, pushState = true) {
  if (routes[path]) {
    console.log(`Navigating to ${path}`);

    routes[path]();

    if (pushState) {
      window.history.pushState({ path }, "", path);
    }
  } else {
    console.log(`Route for ${path} not found. Redirecting to /home.`);
    navigate("/home", pushState);
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
