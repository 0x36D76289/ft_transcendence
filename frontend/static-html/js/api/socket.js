import { navigate } from "../app.js";
import { initSidebar } from "../components/sidebar.js";
import { read_room } from "../pages/pong/socket.js";
import { popupSystem } from "../services/popup.js";
import { getToken } from "../utils/cookies.js";

//@ts-check

/** @type {WebSocket} */
var online_sock;

/** @type {boolean} */
var asked_for_init = false;

/**
 * sends a message through the online sock or notifies the user if it's still getting ready
 * @param {string} message - the message sent to the online sock
 * @returns {void}
 */
export function send_to_online_sock(message) {
  if (online_sock?.readyState === WebSocket.OPEN) {
    online_sock.send(message);
  } else {
    //TODO: i18n
    asked_for_init = true;
    popupSystem(
      "warning",
      "page is still connecting to server, please wait a bit",
    );
  }
}

/** @returns {void} */
export function create_socket() {
  online_sock = new WebSocket(
    "wss://" +
      window.location.host +
      "/api/ws/user/online_status?token=" +
      getToken(),
  );
  online_sock.onmessage = read_sock;
  console.log("socket created");
  online_sock.onopen = () => {
    console.log(online_sock);
    send_to_online_sock("ping");
    console.log("socket opened and ping sent");
    if (asked_for_init) {
      asked_for_init = false;
      //TODO: i18n
      popupSystem("success", "Connection complete");
    }
    //TODO: send a ping every 50s to keep connection alive
  };
  online_sock.addEventListener("close", () => {
    //TODO: i18n
    popupSystem("info", "reconnecting to socket");
    create_socket;
  });
}

/**
 * @param {MessageEvent} object
 * @returns {void}
 */
function read_sock(object) {
  console.log("received ", object);
  let inner;
  try {
    inner = JSON.parse(object.data);
  } catch (e) {
    console.log("[online_sock] couldn't parse: ", object.data);
    return;
  }
  switch (inner.type) {
    case "game_start":
      if (window.location.pathname == "/pong") {
        read_room(inner);
      } else {
        navigate("/pong", { game: inner });
      }
      break;
    //TODO: ADD i18n
    case "notify":
      popupSystem("info", inner.value);
      break;
    case "notify-success":
      popupSystem("success", inner.value);
      break;
    case "notify-error":
      popupSystem("error", inner.value);
      break;
    case "game-invite":
      popupSystem(
        "warning",
        inner.value + " wants to play with you",
        true,
        () => {
          send_to_online_sock("fight " + inner.value);
        },
      );
      break;
    case "online-state":
      let a = document.getElementsByClassName("status-led");
      if (a.length) {
        let led = a[0];
        led.className = "status-led online";
        console.log(led);
      }
      break;
    default:
      console.log("couldn't recognize type: ", inner.type);
  }
}
