//@ts-check

/**
	* describes the position of everything at a moment
*/
export type GameState = {
	frame: number; // the frame number of the round, counts up
	ball_x: number; // x position of the center of the ball
	ball_y: number; // y position of the center of the ball
	p1_height: number; // y position of the center of p1 paddle
	p2_height: number; // y position of the center of p2 paddle
	ball_speed_x: number; // the x speed of the ball
	ball_speed_y: number; // the y speed of the ball
	countdown_frames: number; // how many frames before round start
}
