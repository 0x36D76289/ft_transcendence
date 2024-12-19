import { navigate } from "../app.js";
import { set_queue } from "../pages/home.js";
import { read_room } from "../pages/pong/socket.js";
import { participants } from "../pages/tournament/participants.js";
import { i18n } from "../services/i18n.js";
import { popupSystem } from "../services/popup.js";
import { getToken } from "../utils/cookies.js";
import { WS_URL } from "../app.js";

//@ts-check

/** @type {WebSocket} */
var online_sock;

/** @type {boolean} */
var asked_for_init = false;
/** @type {boolean} */
var send_reconnect_notif = false;

/** @param {boolean} status
 * @returns {void}
 */
function set_led(status) {
  let a = document.getElementsByClassName("status-led");
  if (a.length) {
    let led = a[0];
    if (status) led.className = "status-led online";
    else led.className = "status-led offline";
  } else {
    setTimeout(1000, set_led, status);
  }
}

/**
 * sends a message through the online sock or notifies the user if it's still getting ready
 * @param {string} message - the message sent to the online sock
 * @returns {void}
 */
export function send_to_online_sock(message) {
  if (online_sock?.readyState === WebSocket.OPEN) {
    online_sock.send(message);
  } else {
    asked_for_init = true;
    popupSystem("warning", i18n.t("notifications.connection.pending"));
  }
}

/** @returns {void} */
export function create_socket() {
  if (send_reconnect_notif) {
    popupSystem("info", i18n.t("notifications.connection.close"));
    send_reconnect_notif = false;
  }
  online_sock = new WebSocket(`${WS_URL}/user/online_status?token=${getToken()}`);
  online_sock.onmessage = read_sock;
  console.log("socket created");

  online_sock.onopen = () => {
    console.log(online_sock);
    send_to_online_sock("ping");
    console.log("socket opened and ping sent");
    send_reconnect_notif = true;
    if (asked_for_init) {
      asked_for_init = false;
      popupSystem("success", i18n.t("notifications.connection.open"));
    }
    //TODO: send a ping every 50s to keep connection  alive
  };
  online_sock.addEventListener("close", () => {
    set_led(false);
    create_socket();
  });
}

/**
 * @param {string} str - the message to translate
 * @returns {void}
 */
function three_part_translate(str) {
  const split = str.split(" ");
  if (split.length == 1) {
    return i18n.t(str);
  }
  return i18n.t(split[0]) + split[1] + i18n.t(split[2]);
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
    case "pong":
      break;
    case "game_start":
      navigate("/pong", { game: inner });
      break;
    case "notify":
      popupSystem("info", three_part_translate(inner.value));
      break;
    case "notify-success":
      popupSystem("success", three_part_translate(inner.value));
      break;
    case "notify-error":
      popupSystem("error", three_part_translate(inner.value));
      break;
    case "game-invite":
      popupSystem( "warning", `${i18n.t("notifications.fight.invite.receive.pre")}${inner.value}`, true, () => {   send_to_online_sock(`fight ${inner.value}`); },
      );
      break;
    case "tournament-invite":
      popupSystem(
        "warning",
        i18n.t("notifications.tournament.invite.pre") +
          inner.value +
          i18n.t("notifications.tournament.invite.post"),
        true,
        () => {
          send_to_online_sock("accept " + inner.value);
        },
        () => {
          send_to_online_sock("reject " + inner.value);
        },
      );
      break;
    case "invite-accept":
      participants.set_status(inner.value, true);
      break;
    case "invite-reject":
      participants.set_status(inner.value, false);
      break;
    case "online-state":
      set_led(true);
      break;
    case "mm":
      if (inner.value == "join") {
        popupSystem("info", i18n.t("notifications.matchmaking.join"));
        set_queue(true);
      } else {
        popupSystem("info", i18n.t("notifications.matchmaking.leave"));
        set_queue(false);
      }
    default:
      console.log("couldn't recognize type: ", inner.type);
  }
}
