import { sidebar } from "./components/sidebar.js";

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
  document.body.innerHTML = sidebarHTML + htmlContent;

  const styleElement = document.createElement("style");
  styleElement.textContent = sidebarCSS + cssContent;
  document.head.appendChild(styleElement);
}

export function navigate(path, pushState = true) {
  if (routes[path]) {
    console.log(`Navigating to ${path}`);

    // document.body.innerHTML = "";
    // document.head.innerHTML = "";

    // Execute the handler for the route
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
