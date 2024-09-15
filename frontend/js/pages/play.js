import { logMessage } from "../logs.js";

export function renderPlay() {
  const app = document.getElementById("app");
  const canvas = document.createElement("canvas");
  canvas.id = "pongCanvas";
  canvas.width = 800;
  canvas.height = 600;
  app.appendChild(canvas);

  const context = canvas.getContext("2d");

  // Ball, paddles, and other game variables
  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 5,
  };
  const paddleWidth = 10,
    paddleHeight = 100;
  const playerPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 6,
  };
  const aiPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 5,
  };
  const paddleSpeed = 6;
  let gameOver = false;
  let startTime = Date.now();

  // Keyboard input
  let playerDirection = 0;

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") playerDirection = -1;
    else if (e.key === "ArrowDown") playerDirection = 1;
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") playerDirection = 0;
  });

  // Ball movement
  function moveBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Wall collisions
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.speedY *= -1;
    }

    // Paddle collisions
    if (
      ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
      ball.y > playerPaddle.y &&
      ball.y < playerPaddle.y + playerPaddle.height
    ) {
      ball.speedX *= -1;
    }
    if (
      ball.x + ball.radius > aiPaddle.x &&
      ball.y > aiPaddle.y &&
      ball.y < aiPaddle.y + aiPaddle.height
    ) {
      ball.speedX *= -1;
    }

    // Scoring
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
      resetBall();
    }
  }

  function movePaddles() {
    playerPaddle.y += playerDirection * paddleSpeed;

    // AI movement (simple AI to follow the ball)
    if (ball.y > aiPaddle.y + paddleHeight / 2) aiPaddle.y += aiPaddle.speed;
    else if (ball.y < aiPaddle.y + paddleHeight / 2)
      aiPaddle.y -= aiPaddle.speed;

    // Prevent paddles from leaving the canvas
    if (playerPaddle.y < 0) playerPaddle.y = 0;
    if (playerPaddle.y + paddleHeight > canvas.height)
      playerPaddle.y = canvas.height - paddleHeight;
    if (aiPaddle.y < 0) aiPaddle.y = 0;
    if (aiPaddle.y + paddleHeight > canvas.height)
      aiPaddle.y = canvas.height - paddleHeight;
  }

  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX *= -1;
    logMessage("Ball reset", "info");
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = "white";
    context.fill();
    context.closePath();

    // Draw paddles
    context.fillStyle = "white";
    context.fillRect(
      playerPaddle.x,
      playerPaddle.y,
      playerPaddle.width,
      playerPaddle.height
    );
    context.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
  }

  function gameLoop() {
    if (!gameOver) {
      moveBall();
      movePaddles();
      draw();

      // Check if 3 minutes have passed
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= 180) {
        // 3 minutes in seconds
        gameOver = true;
        alert("Time's up! Game over.");
      }

      requestAnimationFrame(gameLoop);
    } else {
      logMessage("Game over", "info");
    }
  }

  logMessage("Pong game started", "info");
  gameLoop();

  document.getElementById("backButton").addEventListener("click", () => {
    navigate("/");
  });
}
