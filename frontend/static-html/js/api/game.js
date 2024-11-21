import { get } from './api.js';
import { getToken } from '../utils/cookies.js';

export const GameAPI = {
  getHistory: () => get('/game/history', getToken()),
  getUserHistory: (username) => get(`/game/history/${username}`, getToken()),
};
