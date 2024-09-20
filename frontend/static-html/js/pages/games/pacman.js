import { navigate } from "../../spa.js";
import { createButton } from "../../components.js";

const CELL_SIZE = 30; // pixels
const GAME_WIDTH = 28 * CELL_SIZE; // 28 cells wide
const GAME_HEIGHT = 31 * CELL_SIZE; // 31 cells tall

// const texture = {
//   background: "../../../assets/sprites/pacman/map/map.png"
// }

const texture_pacman = {
  pacman_0: "../../../assets/sprites/pacman/pacman/0.png",
  pacman_1: "../../../assets/sprites/pacman/pacman/1.png",
  pacman_2: "../../../assets/sprites/pacman/pacman/2.png",

  pacman_death_0: "../../../assets/sprites/pacman/pacman/d-0.png",
  pacman_death_1: "../../../assets/sprites/pacman/pacman/d-1.png",
  pacman_death_2: "../../../assets/sprites/pacman/pacman/d-2.png",
  pacman_death_3: "../../../assets/sprites/pacman/pacman/d-3.png",
  pacman_death_4: "../../../assets/sprites/pacman/pacman/d-4.png",
  pacman_death_5: "../../../assets/sprites/pacman/pacman/d-5.png",
  pacman_death_6: "../../../assets/sprites/pacman/pacman/d-6.png",
  pacman_death_7: "../../../assets/sprites/pacman/pacman/d-7.png",
  pacman_death_8: "../../../assets/sprites/pacman/pacman/d-8.png",
  pacman_death_9: "../../../assets/sprites/pacman/pacman/d-9.png",
  pacman_death_10: "../../../assets/sprites/pacman/pacman/d-10.png",
}

const texture_ghosts = {
  ghost_blinky_0: "../../../assets/sprites/pacman/ghosts/r-0.png",
  ghost_blinky_1: "../../../assets/sprites/pacman/ghosts/r-1.png",
  ghost_pinky_0: "../../../assets/sprites/pacman/ghosts/p-0.png",
  ghost_pinky_1: "../../../assets/sprites/pacman/ghosts/p-1.png",
  ghost_inky_0: "../../../assets/sprites/pacman/ghosts/b-0.png",
  ghost_inky_1: "../../../assets/sprites/pacman/ghosts/b-1.png",
  ghost_clyde_0: "../../../assets/sprites/pacman/ghosts/y-0.png",
  ghost_clyde_1: "../../../assets/sprites/pacman/ghosts/y-1.png",

  ghost_eyes_down: "../../../assets/sprites/pacman/eyes/d.png",
  ghost_eyes_left: "../../../assets/sprites/pacman/eyes/l.png",
  ghost_eyes_right: "../../../assets/sprites/pacman/eyes/r.png",
  ghost_eyes_up: "../../../assets/sprites/pacman/eyes/u.png",
}

// 0: empty, 1: wall, 2: dot, 3: power pellet
const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 3, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 3, 1],
  [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
  [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

class Phantom {
  constructor(gameBoard, startX, startY, ghostName) {
    this.position = { x: startX * CELL_SIZE, y: startY * CELL_SIZE };
    this.ghostName = ghostName;
    this.ghostElement = document.createElement('img');
    this.ghostElement.src = texture_ghosts[`ghost_${ghostName}_0`];
    this.ghostElement.style.position = 'absolute';
    this.ghostElement.style.width = `${CELL_SIZE}px`;
    this.ghostElement.style.height = `${CELL_SIZE}px`;

    this.eyesElement = document.createElement('img');
    this.eyesElement.src = texture_ghosts.ghost_eyes_right;
    this.eyesElement.style.position = 'absolute';
    this.eyesElement.style.width = `${CELL_SIZE}px`;
    this.eyesElement.style.height = `${CELL_SIZE}px`;

    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.width = `${CELL_SIZE}px`;
    this.element.style.height = `${CELL_SIZE}px`;
    this.element.appendChild(this.ghostElement);
    this.element.appendChild(this.eyesElement);

    gameBoard.appendChild(this.element);
    this.direction = this.getRandomDirection();
    this.targetPosition = { x: this.position.x, y: this.position.y }; // Initialize targetPosition
    this.moveSpeed = 2; // Same speed as Pacman
    this.frame = 0; // Initialize frame for animation

    this.startAnimation();
  }

  getRandomDirection() {
    const directions = ['up', 'down', 'left', 'right'];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  moveRandomly() {
    const gridX = Math.floor(this.position.x / CELL_SIZE);
    const gridY = Math.floor(this.position.y / CELL_SIZE);

    if (this.position.x % CELL_SIZE === 0 && this.position.y % CELL_SIZE === 0) {
      let newGridX = gridX;
      let newGridY = gridY;

      switch (this.direction) {
        case 'up': newGridY -= 1; break;
        case 'down': newGridY += 1; break;
        case 'left': newGridX -= 1; break;
        case 'right': newGridX += 1; break;
      }

      if (map[newGridY] && map[newGridY][newGridX] !== 1) {
        this.targetPosition = {
          x: newGridX * CELL_SIZE,
          y: newGridY * CELL_SIZE
        };
      } else {
        this.direction = this.getRandomDirection(); // Change direction if blocked
      }
    }

    const dx = this.targetPosition.x - this.position.x;
    const dy = this.targetPosition.y - this.position.y;

    if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
      const moveX = Math.sign(dx) * Math.min(Math.abs(dx), this.moveSpeed);
      const moveY = Math.sign(dy) * Math.min(Math.abs(dy), this.moveSpeed);
      this.position.x += moveX;
      this.position.y += moveY;
    }

    this.updatePosition();
    this.updateDirection(dx, dy);
  }

  updateDirection(moveX, moveY) {
    if (moveX > 0) this.direction = 'right';
    else if (moveX < 0) this.direction = 'left';
    else if (moveY > 0) this.direction = 'down';
    else if (moveY < 0) this.direction = 'up';

    switch (this.direction) {
      case 'up': this.eyesElement.src = texture_ghosts.ghost_eyes_up; break;
      case 'down': this.eyesElement.src = texture_ghosts.ghost_eyes_down; break;
      case 'left': this.eyesElement.src = texture_ghosts.ghost_eyes_left; break;
      case 'right': this.eyesElement.src = texture_ghosts.ghost_eyes_right; break;
    }
  }

  updatePosition() {
    this.element.style.left = `${this.position.x}px`;
    this.element.style.top = `${this.position.y}px`;
  }

  startAnimation() {
    setInterval(() => {
      this.frame = (this.frame + 1) % 2;
      this.ghostElement.src = texture_ghosts[`ghost_${this.ghostName}_${this.frame}`];
    }, 200);
  }
}

class Pacman {
  constructor(containerElement) {
    this.containerElement = containerElement;
    this.pacmanPosition = { x: 13 * CELL_SIZE, y: 23 * CELL_SIZE };
    this.targetPosition = { x: 13 * CELL_SIZE, y: 23 * CELL_SIZE };
    this.pacmanDirection = 'right';
    this.nextDirection = 'right';
    this.pacmanFrame = 0;
    this.gameBoard = null;
    this.pacmanElement = null;
    this.moveSpeed = 2; // Pixels per frame
    this.animationSpeed = 50; // Milliseconds per frame
    this.powerPelletTimeout = null;
    this.remainingDots = 244 - this.score;
    this.score = 0; // Initialize score
    this.phantoms = [];
    this.gameOver = false;

    this.init();
  }

  init() {
    this.createGameBoard();
    this.createPacman();
    this.bindKeyEvents();
    this.createPhantoms();
    this.createUI();
    this.startGameLoop();
  }

  createGameBoard() {
    this.gameBoard = document.createElement('div');
    this.gameBoard.style.position = 'relative';
    this.gameBoard.style.width = `${GAME_WIDTH}px`;
    this.gameBoard.style.height = `${GAME_HEIGHT}px`;
    this.gameBoard.style.backgroundColor = 'black'; // Remove background image and set background color
    this.gameBoard.style.overflow = 'hidden';
    this.gameBoard.style.margin = 'auto';

    map.forEach((row, y) => {
      row.forEach((cell, x) => {
        const cellElement = this.createCell(cell, x, y);
        if (cellElement) {
          this.gameBoard.appendChild(cellElement);
        }
      });
    });

    this.containerElement.appendChild(this.gameBoard);
  }

  createCell(cellType, x, y) {
    const cell = document.createElement('div');
    cell.style.position = 'absolute';
    cell.style.left = `${x * CELL_SIZE}px`;
    cell.style.top = `${y * CELL_SIZE}px`;
    cell.style.width = `${CELL_SIZE}px`;
    cell.style.height = `${CELL_SIZE}px`;

    switch (cellType) {
      case 1: // wall
        cell.style.backgroundColor = 'blue';
        return cell;
      case 2: // dot
        const dot = document.createElement('div');
        dot.style.width = '20%';
        dot.style.height = '20%';
        dot.style.backgroundColor = 'white';
        dot.style.borderRadius = '50%';
        dot.style.position = 'absolute';
        dot.style.left = '40%';
        dot.style.top = '40%';
        cell.appendChild(dot);
        cell.classList.add('dot');
        return cell;
      case 3: // power pellet
        const pellet = document.createElement('div');
        pellet.style.width = '60%';
        pellet.style.height = '60%';
        pellet.style.backgroundColor = 'white';
        pellet.style.borderRadius = '50%';
        pellet.style.position = 'absolute';
        pellet.style.left = '20%';
        pellet.style.top = '20%';
        cell.appendChild(pellet);
        cell.classList.add('power-pellet');
        return cell;
      default:
        return null;
    }
  }

  createPacman() {
    this.pacmanElement = document.createElement('img');
    this.pacmanElement.src = texture_pacman.pacman_0;
    this.pacmanElement.style.position = 'absolute';
    this.pacmanElement.style.width = `${CELL_SIZE}px`;
    this.pacmanElement.style.height = `${CELL_SIZE}px`;
    this.updatePacmanPosition();
    this.gameBoard.appendChild(this.pacmanElement);
  }

  createPhantoms() {
    this.phantoms = [
      new Phantom(this.gameBoard, 13, 11, 'blinky'),   // Blinky
      new Phantom(this.gameBoard, 13, 14, 'pinky'),    // Pinky
      new Phantom(this.gameBoard, 11, 14, 'inky'),     // Inky
      new Phantom(this.gameBoard, 15, 14, 'clyde')     // Clyde
    ];
  }

  updatePacmanPosition() {
    this.pacmanElement.style.left = `${this.pacmanPosition.x}px`;
    this.pacmanElement.style.top = `${this.pacmanPosition.y}px`;
    this.pacmanElement.style.transform = `rotate(${this.pacmanDirection === 'up' ? 90 :
      this.pacmanDirection === 'down' ? 270 :
        this.pacmanDirection === 'left' ? 0 : 180
      }deg)`;
  }

  bindKeyEvents() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.nextDirection = 'up';
          break;
        case 'ArrowDown':
          this.nextDirection = 'down';
          break;
        case 'ArrowLeft':
          this.nextDirection = 'left';
          break;
        case 'ArrowRight':
          this.nextDirection = 'right';
          break;
      }
    });
  }

  startGameLoop() {
    let lastTime = 0;
    const gameLoop = (timestamp) => {
      if (this.gameOver) return; // Stop the game loop if the game is over

      const deltaTime = timestamp - lastTime;
      if (deltaTime >= 16) {  // Aim for 60 FPS
        this.movePacman();
        this.movePhantoms();
        this.animatePacman();
        lastTime = timestamp;
      }
      requestAnimationFrame(gameLoop);
    };
    requestAnimationFrame(gameLoop);
  }

  movePacman() {
    const gridX = Math.floor(this.pacmanPosition.x / CELL_SIZE);
    const gridY = Math.floor(this.pacmanPosition.y / CELL_SIZE);

    // Check if Pacman is aligned with the grid
    if (this.pacmanPosition.x % CELL_SIZE === 0 && this.pacmanPosition.y % CELL_SIZE === 0) {
      // Determine next move
      let newGridX = gridX;
      let newGridY = gridY;

      switch (this.nextDirection) {
        case 'up': newGridY -= 1; break;
        case 'down': newGridY += 1; break;
        case 'left': newGridX -= 1; break;
        case 'right': newGridX += 1; break;
      }

      // Handle wraparound
      if (newGridX < 0) newGridX = map[0].length - 1;
      else if (newGridX >= map[0].length) newGridX = 0;

      // Check if the next cell is not a wall
      if (map[newGridY] && map[newGridY][newGridX] !== 1) {
        this.targetPosition = {
          x: newGridX * CELL_SIZE,
          y: newGridY * CELL_SIZE
        };
        this.pacmanDirection = this.nextDirection;
      } else {
        // If next direction is blocked, try to continue in the current direction
        newGridX = gridX;
        newGridY = gridY;
        switch (this.pacmanDirection) {
          case 'up': newGridY -= 1; break;
          case 'down': newGridY += 1; break;
          case 'left': newGridX -= 1; break;
          case 'right': newGridX += 1; break;
        }
        if (newGridX < 0) newGridX = map[0].length - 1;
        else if (newGridX >= map[0].length) newGridX = 0;

        if (map[newGridY] && map[newGridY][newGridX] !== 1) {
          this.targetPosition = {
            x: newGridX * CELL_SIZE,
            y: newGridY * CELL_SIZE
          };
        }
      }

      this.checkDotCollision(gridX, gridY);
    }

    // Move towards target position
    const dx = this.targetPosition.x - this.pacmanPosition.x;
    const dy = this.targetPosition.y - this.pacmanPosition.y;

    if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
      const moveX = Math.sign(dx) * Math.min(Math.abs(dx), this.moveSpeed);
      const moveY = Math.sign(dy) * Math.min(Math.abs(dy), this.moveSpeed);
      this.pacmanPosition.x += moveX;
      this.pacmanPosition.y += moveY;
    }

    this.updatePacmanPosition();

    // Check for portal wraparound
    if (this.pacmanPosition.x < 0) {
      this.pacmanPosition.x = (map[0].length - 1) * CELL_SIZE;
    } else if (this.pacmanPosition.x >= map[0].length * CELL_SIZE) {
      this.pacmanPosition.x = 0;
    }
  }

  deathAnimation() {
    this.gameOver = true;

    const deathFrames = [
      texture_pacman.pacman_death_0,
      texture_pacman.pacman_death_1,
      texture_pacman.pacman_death_2,
      texture_pacman.pacman_death_3,
      texture_pacman.pacman_death_4,
      texture_pacman.pacman_death_5,
      texture_pacman.pacman_death_6,
      texture_pacman.pacman_death_7,
      texture_pacman.pacman_death_8,
      texture_pacman.pacman_death_9,
      texture_pacman.pacman_death_10
    ];

    deathFrames.forEach((frame, index) => {
      setTimeout(() => {
        this.pacmanElement.src = frame;
        if (index === deathFrames.length - 1) {
          this.endGame(false); // Pacman died
        }
      }, index * 100);
    });
  }

  checkCollisionWithPacman(phantom) {
    if (
      Math.abs(this.pacmanPosition.x - phantom.position.x) < CELL_SIZE &&
      Math.abs(this.pacmanPosition.y - phantom.position.y) < CELL_SIZE
    ) {
      this.deathAnimation();
    }
  }

  movePhantoms() {
    this.phantoms.forEach(phantom => {
      phantom.moveRandomly();
      this.checkCollisionWithPacman(phantom);
    });
  }

  updateUI() {
    this.scoreDisplay.textContent = `Score: ${this.score}`;
  }

  checkDotCollision(gridX, gridY) {
    const cell = map[gridY][gridX];
    if (cell === 2) { // Dot
      map[gridY][gridX] = 0;
      this.score++;
      this.remainingDots--;
      this.updateUI();
      this.gameBoard.removeChild(this.getCellAt(gridX, gridY));
    } else if (cell === 3) { // Power pellet
      map[gridY][gridX] = 0;
      this.gameBoard.removeChild(this.getCellAt(gridX, gridY));
      // this.activatePowerPellet();
    }
  }

  getCellAt(x, y) {
    return [...this.gameBoard.children].find(cell => {
      const left = parseInt(cell.style.left);
      const top = parseInt(cell.style.top);
      return left === x * CELL_SIZE && top === y * CELL_SIZE;
    });
  }

  animatePacman() {
    if (!this.lastAnimationTime || Date.now() - this.lastAnimationTime >= this.animationSpeed) {
      this.pacmanFrame = (this.pacmanFrame + 1) % 3;
      this.pacmanElement.src = texture_pacman[`pacman_${this.pacmanFrame}`];
      this.lastAnimationTime = Date.now();
    }
  }

  createUI() {
    const homeButton = createButton("home-button", "Home", () => {
      navigate("/");
    });

    this.containerElement.appendChild(homeButton);

    let username = localStorage.getItem("username");
    if (username) {
      const usernameDisplay = createButton("username-display", username, () => {
        navigate("/account");
      });

      this.containerElement.appendChild(usernameDisplay);
    }

    // Create score display
    this.scoreDisplay = document.createElement('div');
    this.scoreDisplay.id = 'score-display';
    this.scoreDisplay.textContent = `Score: ${this.score}`;
    this.scoreDisplay.style.position = 'absolute';
    this.scoreDisplay.style.top = '1rem';
    this.scoreDisplay.style.left = '50%';
    this.scoreDisplay.style.transform = 'translateX(-50%)';
    this.scoreDisplay.style.fontSize = '1.5rem';
    this.scoreDisplay.style.color = 'white';
    this.containerElement.appendChild(this.scoreDisplay);
  }

  updateScore(points) {
    this.score += points;
    this.scoreDisplay.textContent = `Score: ${this.score}`;
  }

  endGame(won) {
    // this.gameOver = true;

    const message = document.createElement('div');
    message.textContent = won ? "You Win!" : "Game Over - You Lost!";
    message.style.position = 'absolute';
    message.style.top = '5rem';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.fontSize = '2rem';
    message.style.color = 'white';
    this.containerElement.appendChild(message);

    const replayButton = createButton("replay-button", "Replay", () => {
      this.containerElement.innerHTML = '';
      new Pacman(this.containerElement);
    });

    replayButton.style.position = 'absolute';
    replayButton.style.top = '9rem';
    replayButton.style.left = '50%';
    replayButton.style.transform = 'translateX(-50%)';
    this.containerElement.appendChild(replayButton);
  }
}

export function renderPacman() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const gameContainer = document.createElement("div");
  gameContainer.id = "game-container";
  gameContainer.style.display = 'flex';
  gameContainer.style.justifyContent = 'center';
  gameContainer.style.alignItems = 'center';
  gameContainer.style.height = '100vh';
  app.appendChild(gameContainer);

  if (gameContainer) {
    new Pacman(gameContainer);
  } else {
    console.error("Game container element not found");
  }

  const homeButton = createButton("home-button", "Home", () => {
    navigate("/");
  });

  app.appendChild(homeButton);

  let username = localStorage.getItem("username");
  if (username) {
    const usernameDisplay = createButton("username-display", username, () => {
      navigate("/account");
    });

    app.appendChild(usernameDisplay);
  }

  const style = document.createElement("style");
  style.textContent = `
    .home-button {
      position: absolute;
      left: 1rem;
      top: 1rem;
    }

    .username-display {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: var(--font-size);
      color: var(--text-color);
      background-color: transparent;
    }

    .replay-button {
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translateX(-50%);
    }

    #score-display {
      position: absolute;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.5rem;
      color: white;
    }
  `;
  document.head.appendChild(style);
}
