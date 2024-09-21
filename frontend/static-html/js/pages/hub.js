import { navigate } from "../spa.js";
import * as components from "../components.js";

const CSS = `
  .hub-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    padding: 20px;
    position: relative;
  }

  .hub-title {
    font-size: 2rem;
    margin-bottom: 40px;
    letter-spacing: 3px;
  }

  .controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .sort-dropdown {
    padding: 5px;
  }

  .search-input {
    padding: 5px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-gap: 25px;
    max-width: 1200px;
    width: 100%;
  }

  .player-box {
    width: 100%;
    aspect-ratio: 1;
    position: relative;
    border: 2px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    background-color: rgba(255, 255, 255, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .player-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
    transition: all 0.3s ease;
  }

  .player-box.offline img {
    filter: grayscale(100%) brightness(50%);
  }

  .status-circle {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    position: absolute;
    bottom: 5px;
    left: 5px;
    border: 2px solid white;
    transition: all 0.3s ease;
    z-index: 3;
  }

  .status-online {
    background-color: #4CAF50;
  }

  .status-offline {
    background-color: #9E9E9E;
  }

  .username-label {
    position: absolute;
    bottom: 5px;
    left: 30px;
    background-color: black;
    color: white;
    padding: 2px 5px;
    border-radius: 5px;
    font-size: 0.8rem;
    z-index: 3;
  }

  .home-button {
    position: absolute;
    top: 1rem;
    left: 1rem;
  }

  .account-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
`;

function createUserCard(user) {
  const playerBox = components.createDiv("player-box", grid);
  const statusCircle = components.createDiv(`status-circle status-${user.connected ? "online" : "offline"}`, playerBox);
  const profilePicture = components.createImage(user.profilePicture, user.username, "", playerBox);
  const usernameLabel = components.createDiv("username-label", playerBox);
  usernameLabel.innerText = user.username;
}

function sortUsers(users, criteria) {
  return users.sort((a, b) => {
    if (criteria === "name") {
      return a.username.localeCompare(b.username);
    } else {
      return a.connected - b.connected;
    }
  });
}

export async function renderHub(token) {
  // load CSS
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  let users = Array.from({ length: 64 }, (_, i) => ({
    username: `User${i + 1}`,
    profilePicture: `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`,
    connected: Math.random() > 0.5
  }));

  const container = components.createDiv("hub-container");
  const title = components.createHeading(1, "Hub", "hub-title", container);
  const controls = components.createDiv("controls", container);
  const sortDropdown = components.createSelect(["name", "status"], "sort-dropdown", controls);
  const searchInput = components.createInput("Search...", "text", "search-input", controls);
  const grid = components.createDiv("grid", container);

  sortDropdown.addEventListener("change", () => {
    grid.innerHTML = "";
    users = sortUsers(users, sortDropdown.value);
    users.forEach(createUserCard);
  });

  searchInput.addEventListener("input", () => {
    grid.innerHTML = "";
    const filteredUsers = users.filter(user => user.username.includes(searchInput.value));
    filteredUsers.forEach(createUserCard);
  });

  users.forEach(createUserCard);

  components.createButton("Home", () => navigate("/home"), "home-button", container);
  components.createButton("Account", () => navigate("/profile"), "account-button", container);
}
