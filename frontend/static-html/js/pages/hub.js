import { navigate } from "../spa.js";
import * as components from "../components.js";

const CSS = `
.card {
  width: 200px;
  height: 300px;
  perspective: 1000px;
  margin: 1rem;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  overflow: hidden;
}

.card-front {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back {
  background-color: #f8f8f8;
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
}
`;

function createGameCard(user) {
  const card = components.createDiv("card");
  const cardInner = components.createDiv("card-inner");
  const cardFront = components.createDiv("card-front");
  const cardBack = components.createDiv("card-back");

  const profileImage = components.createImage(user.profilePicture, `${user.username}'s profile picture`, "profile-image");
  const username = components.createHeading(3, user.username);

  cardFront.appendChild(profileImage);
  cardBack.appendChild(username);

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);

  return card;
}

export async function renderHub(token) {
  // TODO: fetch every user from the API

  const hubContainer = components.createDiv("hub-container");
  users.forEach(user => {
    const gameCard = createGameCard(user);
    hubContainer.appendChild(gameCard);
  });

  document.body.appendChild(hubContainer);

  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);
}
