import { WS_BASE_URL } from "./api.js";
import { getToken } from "../utils/cookies.js";

export const WebSocketAPI = {
  onlineStatus: () => new WebSocket(`${WS_BASE_URL}/user/online_status?token=${getToken()}`),
  chat: (convoId) => new WebSocket(`${WS_BASE_URL}/chat/${convoId}?token=${getToken()}`),
};
