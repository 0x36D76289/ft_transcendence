let routes = {};

let lastCursorPosition = { x: 0, y: 0 };

document.addEventListener('mousemove', (e) => {
  lastCursorPosition.x = e.clientX;
  lastCursorPosition.y = e.clientY;
});


export function addRoute(path, handler) {
  console.log(`Adding route for ${path}`);
  routes[path] = handler;
}

export function removeRoute(path) {
  console.log(`Removing route for ${path}`);
  delete routes[path];
}

/**
 * Injects HTML and CSS into the page.
 * @param {string} htmlContent - The HTML to inject.
 * @param {string} cssContent - The CSS to inject.
 */
function injectContent(htmlContent, cssContent = "") {
  const transitionStyles = `
    .page-transition-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    }

    .transition-circle {
      position: absolute;
      width: 0;
      height: 0;
      border-radius: 50%;
      background-color: #000;
      transform: translate(-50%, -50%);
      transition: width 0.5s ease-out, height 0.5s ease-out;
    }

    .page-transition-overlay.active .transition-circle {
      width: 300vmax;
      height: 300vmax;
    }
  `;

  document.body.innerHTML = htmlContent;

  const styleElement = document.createElement("style");
  styleElement.textContent = transitionStyles + cssContent;
  document.head.appendChild(styleElement);
}

export function navigate(path, pushState = true) {
  if (routes[path]) {
    console.log(`Navigating to ${path}`);

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
