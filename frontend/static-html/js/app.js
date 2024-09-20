import { start, addRoute, checkAuthStatus } from "./spa.js";
import { renderHome } from "./pages/home.js";
import { renderProfile } from "./pages/account/profile.js";
import { renderHub } from "./pages/hub.js";
import { renderPacman } from "./pages/games/pacman.js";
import { renderConnexion } from "./pages/account/connexion.js";

export let currentUser = null;

// entry point
document.addEventListener("DOMContentLoaded", async () => {
  // Vérification de l'état de connexion de l'utilisateur
  try {
    currentUser = await checkAuthStatus(); // Renvoie null si non connecté
  } catch (error) {
    console.error("Erreur de vérification de l'authentification", error);
  }

  // Routes
  addRoute("/", renderHome);
  addRoute("/hub", renderHub);
  addRoute("/profile", renderProfile);
  addRoute("/connexion", renderConnexion);
  addRoute("/pacman", renderPacman);

  start();
});
