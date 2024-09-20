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
  const box = components.createDiv("player-box");

  if (!user.connected) {
    box.classList.add("offline");
  }

  const img = components.createImage(user.profilePicture, user.username);
  box.appendChild(img);

  const statusCircle = components.createDiv(`status-circle ${user.connected ? "status-online" : "status-offline"}`);
  box.appendChild(statusCircle);

  const usernameLabel = components.createDiv("username-label");
  usernameLabel.textContent = user.username;
  box.appendChild(usernameLabel);

  // Add mouse-following effect
  box.addEventListener('mousemove', (e) => {
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    box.style.transform = `perspective(1000px) rotateY(${deltaX * 20}deg) rotateX(${-deltaY * 20}deg) scale3d(1.1, 1.1, 1.1)`;
  });

  box.addEventListener('mouseleave', () => {
    box.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
  });

  return box;
}

function sortUsers(users, criteria) {
  if (criteria === "name") {
    return users.sort((a, b) => a.username.localeCompare(b.username));
  } else {
    return users.sort((a, b) => b.connected - a.connected);
  }
}

export async function renderHub(token) {
  let users = Array.from({ length: 64 }, (_, i) => ({
    username: `User${i + 1}`,
    profilePicture: `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`,
    connected: Math.random() > 0.5
  }));

  const hubContainer = components.createDiv("hub-container");

  const title = components.createHeading(1, "HUB", "hub-title");
  hubContainer.appendChild(title);

  const controls = components.createDiv("controls");

  const sortDropdown = components.createSelect(
    [
      { value: "status", text: "Sort by Status" },
      { value: "name", text: "Sort by name" },
    ],
    "sort-dropdown"
  );

  sortDropdown.addEventListener("change", () => {
    const criteria = sortDropdown.value;
    users = sortUsers(users, criteria);
    renderGrid(users);
  });

  controls.appendChild(sortDropdown);

  const searchInput = components.createInput("text", "search-input", "Search users...");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(query));
    renderGrid(filteredUsers);
  });

  controls.appendChild(searchInput);

  hubContainer.appendChild(controls);

  const grid = components.createDiv("grid");
  hubContainer.appendChild(grid);

  function renderGrid(users) {
    grid.innerHTML = "";
    users.forEach(user => {
      const userCard = createUserCard(user);
      grid.appendChild(userCard);
    });
  }

  users = sortUsers(users, "status");
  renderGrid(users);

  const homeButton = components.createButton("Home", () => {
    navigate("/");
  }, "home-button");
  hubContainer.appendChild(homeButton);

  // Retrieve username from local storage
  const storedUsername = localStorage.getItem("username") || "Anonymous";

  // Add account button
  const accountButton = components.createButton(`${storedUsername}`, () => {
    navigate("/profile");
  }, "account-button");
  hubContainer.appendChild(accountButton);

  document.body.appendChild(hubContainer);

  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);
}
