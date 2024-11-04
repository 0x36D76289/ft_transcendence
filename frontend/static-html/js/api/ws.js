import { WS_BASE_URL } from "./api.js";

export const WebSocketAPI = {
  onlineStatus: (token) => new WebSocket(`${WS_BASE_URL}/user/online_status?token=${token}`),
  chat: (token, convoId) => new WebSocket(`${WS_BASE_URL}/chat/${convoId}?token=${token}`),
};
