import { get } from './api.js';

export const GameAPI = {
  getHistory: (token) => get('/game/history', token),
  getUserHistory: (token, username) => get(`/game/history/${username}`, token),
};
