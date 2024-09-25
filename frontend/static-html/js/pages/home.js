import { navigate, loadPage } from "../spa.js";
import { readCookie } from "../cookie.js";

const cssContent = `
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
}
.username-container {
  position: absolute;
  top: 10px;
  right: 10px;
}
#play-button {
  font-size: 3rem;
  background-color: transparent;
  transition: transform 0.2s ease-in-out;
}

#play-button:hover {
  transform: scale(1.3);
}

#play-button:active {
  transform: scale(1.4);
}
`;

export function renderHome() {
  const token = readCookie("authToken");
  let userNameHTML = '';

  if (token) {
    const username = readCookie("username");
    userNameHTML = `<button id="username-button">${username}</button>`;
  }

  const htmlContent = `
  <div class="home-container">
    <div class="username-container">
      ${userNameHTML}
    </div>
    <button id="play-button">Play</button>
  </div>
  `;

  // Load the HTML and CSS content
  loadPage(htmlContent, cssContent);

  // Event listener for the Play button
  document.getElementById("play-button").addEventListener("click", () => {
    if (token) {
      navigate("/hub");
    } else {
      navigate("/login");
    }
  });

  // Event listener for the Username button
  if (token) {
    document.getElementById("username-button").addEventListener("click", () => {
      const username = readCookie("username");
      navigate(`/${username}`);
    });
  }
}