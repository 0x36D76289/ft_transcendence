import { navigate } from "../spa.js";

export function renderHome() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <button class="play-button">Play</button>
    <button class="account-button">Account</button>
  `;
  document.querySelector(".account-button").addEventListener("click", () => {
    navigate("/account");
  });
}
