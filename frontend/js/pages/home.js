import { navigate } from "../spa.js";

export function renderHome() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <button class="play-button">Play</button>
    <button class="account-button">Account</button>
  `;

  const style = document.createElement("style");
  style.innerHTML = `
    .play-button {
      font-size: var(--large-font-size);
      padding: 2rem 4rem;
      background-color: transparent;
      color: var(--text-color);
      border: none;
      cursor: pointer;
      position: absolute;
      left: 45%;
      top: 45%;
      display: block;
      transition: transform 0.3s ease-in-out;
    }

    .play-button:hover {
      transform: scale(1.5);
    }

    .account-button {
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

    .account-button:hover {
      background-color: #555;
    }
  `;
  document.head.appendChild(style);

  document.querySelector(".account-button").addEventListener("click", () => {
    navigate("/account");
  });

  document.querySelector(".play-button").addEventListener("click", () => {
    navigate("/play");
  });
}
