import { getData } from "./utils.js";

// Game APIs
/**
 * Fetches the history of all games played.
 * 
 * **GET** `/game/history`
 * 
 * _description:_ Retrieves the history of all games played. (il faudra limiter ici)
 * 
 * _response:_ A list of games in the body containing each:
 * - `p1`: Player 1
 * - `p2`: Player 2
 * - `p1_score`: Score of Player 1
 * - `p2_score`: Score of Player 2
 * - `time_start`: Start time of the game
 * - `time_end`: End time of the game
 * 
 * @returns {Promise<Object[]>} A promise that resolves to an array of game history objects.
 */
export const getGameHistory = () => {
	return getData("/game/history");
};

/**
 * Fetches the history of games played by a specific user.
 * 
 * **GET** `/game/history/<user>`
 * 
 * _description:_ Retrieves the history of games played by a user.
 * 
 * _response:_ A list of games in the body containing each:
 * - `p1`: Player 1
 * - `p2`: Player 2
 * - `p1_score`: Score of Player 1
 * - `p2_score`: Score of Player 2
 * - `time_start`: Start time of the game
 * - `time_end`: End time of the game
 * 
 * @param {string} username - The username of the player whose game history is to be fetched.
 * @returns {Promise<Object[]>} A promise that resolves to an array of game history objects for the specified user.
 */
export const getUserGameHistory = (username) => {
	return getData(`/game/history/${username}`);
};

/**
 * Fetches the details of a specific game.
 * 
 * **GET** `/game/<gameId>`
 * 
 * _description:_ Retrieves the details of a specific game.
 * 
 * _response:_ An object containing:
 * - `p1`: Player 1
 * - `p2`: Player 2
 * - `p1_score`: Score of Player 1
 * - `p2_score`: Score of Player 2
 * - `time_start`: Start time of the game
 * - `time_end`: End time of the game
 * 
 * @param {string} gameId - The ID of the game to be fetched.
 * @returns {Promise<Object>} A promise that resolves to the game details object.
 */
export const getGame = (gameId) => {
	return getData(`/game/${gameId}`);
};
