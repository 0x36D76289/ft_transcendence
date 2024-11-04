import { getCookie } from "../utils/cookies.js";

export function render() {
	return `
	<canvas class="games" id="game">you're not supposed to see this</canvas>
	<button id="upButton" style="display: none;">Up</button>
	<button id="downButton" style="display: none;">Down</button>
`;
}

export function init() {
	const ROOM_NAME = "test";
	const sock = new WebSocket(
		"wss://" +
		window.location.host +
		'/api/ws/pong/' +
		ROOM_NAME +
		'/' +
		"?token=" +
		getCookie("token")
	);

	console.log(document.cookie.split(';')[0])
	//TODO: wait for socket to connect ?
	//TODO: error on enemy socket close ?
	let VIEW;
	let BUFF;
	let VIEW_DIMENSIONS;
	let GAME_DIMENSIONS;
	let ctx;
	let buff_ctx;

	let keys = new Set();
	let bots = [0, 0]
	let game_players = ["", ""]

	const States = {
		SP_Game: Symbol('sp_game'),
		MP_Game: Symbol('mp_game'),
		Tournament: Symbol('tournament'),
		Menu: Symbol('menu'),
		Scores: Symbol('scores'),
		Name_Entry: Symbol('name_entry'),
	}
	let page_state = States.Menu;

	function initPong() {
		VIEW = document.getElementById("game");
		BUFF = document.createElement("canvas");
		VIEW_DIMENSIONS = [window.innerWidth, window.innerHeight];
		GAME_DIMENSIONS = [400, 300];
		ctx = VIEW.getContext("2d", { alpha: false });
		buff_ctx = BUFF.getContext("2d", { alpha: false });

		//TODO: save event listeners so you can close them later
		window.addEventListener('keydown', function (e) { keys.add(e.code); name_enter(e); })
		window.addEventListener('keyup', function (e) { keys.delete(e.code); })
		BUFF.width = VIEW_DIMENSIONS[0];
		BUFF.height = VIEW_DIMENSIONS[1];
		buff_ctx.fillStyle = "white";
		buff_ctx.textAlign = "center";
		buff_ctx.textBaseline = "middle";

		function min(a, b) {
			return a < b ? a : b;
		}

		buff_ctx.font = (min(VIEW_DIMENSIONS[0] / 12, VIEW_DIMENSIONS[1] / 9) | 0) + "px Arial";

		VIEW.onclick = canvas_click;

		document.getElementById("mainmenu").onclick = function () {
			clearInterval(interval);
			main_menu()
		}

		// Adjust canvas size on window resize
		window.addEventListener('resize', function () {
			VIEW_DIMENSIONS = [window.innerWidth, window.innerHeight];
			BUFF.width = VIEW_DIMENSIONS[0];
			BUFF.height = VIEW_DIMENSIONS[1];
		});

		// Show buttons if on mobile or if screen width is less than 768px
		if (/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768) {
			document.getElementById("upButton").style.display = "block";
			document.getElementById("downButton").style.display = "block";

			document.getElementById("upButton").addEventListener('touchstart', function () {
				keys.add("ArrowUp");
			});
			document.getElementById("upButton").addEventListener('touchend', function () {
				keys.delete("ArrowUp");
			});
			document.getElementById("downButton").addEventListener('touchstart', function () {
				keys.add("ArrowDown");
			});
			document.getElementById("downButton").addEventListener('touchend', function () {
				keys.delete("ArrowDown");
			});
		}
	}

	function draw_rect(x1, y1, x2, y2) {
		buff_ctx.fillRect(
			x1 * VIEW_DIMENSIONS[0] / GAME_DIMENSIONS[0],
			y1 * VIEW_DIMENSIONS[1] / GAME_DIMENSIONS[1],
			(x2 - x1) * VIEW_DIMENSIONS[0] / GAME_DIMENSIONS[0],
			(y2 - y1) * VIEW_DIMENSIONS[1] / GAME_DIMENSIONS[1]
		);
	}
	function reset_rect(x1, y1, x2, y2) {
		buff_ctx.clearRect(
			x1 * VIEW_DIMENSIONS[0] / GAME_DIMENSIONS[0],
			y1 * VIEW_DIMENSIONS[1] / GAME_DIMENSIONS[1],
			(x2 - x1) * VIEW_DIMENSIONS[0] / GAME_DIMENSIONS[0],
			(y2 - y1) * VIEW_DIMENSIONS[1] / GAME_DIMENSIONS[1]
		);
	}

	function reset() {
		buff_ctx.clearRect(0, 0, VIEW_DIMENSIONS[0], VIEW_DIMENSIONS[1]);
	}

	const GAME_SETTINGS = {
		paddle_width: 5,
		paddle_height: 20,
		paddle_speed: 4,
		ball_size: 3,
		ball_speed: 5,
		ball_y_speed_factor: 3,
		win_score: 10,
		countdown_length: 180,
	}

	let interval = undefined;
	let player_num = 0;
	let inputs = []
	let scores = [0, 0]
	let current_frame = 0
	let last_processed_frame = 0
	let current_state = {
		frame: 0,
		ball_x: 0,
		ball_y: 0,
		p1_height: 0,
		p2_height: 0,
		ball_speed_x: 0,
		ball_speed_y: 0,
		countdown_frames: 0,
	};
	let last_processed_state = Object.assign({}, current_state)

	function init() {
		// set values for current_state
		inputs = [[0, 0]]
		current_frame = 0
		current_state.frame = current_frame
		current_state.ball_x = (GAME_DIMENSIONS[0] / 2) | 0
		current_state.ball_y = (GAME_DIMENSIONS[1] / 2) | 0
		current_state.p1_height = current_state.ball_y
		current_state.p2_height = current_state.ball_y
		current_state.ball_speed_y = -GAME_SETTINGS.ball_speed
		current_state.ball_speed_x = GAME_SETTINGS.ball_speed
		current_state.countdown_frames = GAME_SETTINGS.countdown_length
		if (scores[0] <= scores[1]) {
			current_state.ball_speed_x *= -1;
		}
		last_processed_state = Object.assign({}, current_state);
	}

	function bound(pos, size, min, max) {
		if (pos - size < min)
			return min + size
		if (pos + size > max)
			return max - size
		return pos
	}

	//INFO: MODIFIES STATE
	function tick_move_paddle(state, input) {
		state.p1_height += input[0] * GAME_SETTINGS.paddle_speed
		state.p2_height += input[1] * GAME_SETTINGS.paddle_speed
		state.p1_height = bound(state.p1_height, GAME_SETTINGS.paddle_height, 0, GAME_DIMENSIONS[1])
		state.p2_height = bound(state.p2_height, GAME_SETTINGS.paddle_height, 0, GAME_DIMENSIONS[1])
	}

	//INFO: MODIFIES STATE
	function tick_move_ball(state, input) {
		if (state.countdown_frames > 0) {
			state.countdown_frames -= 1
		} else {
			state.ball_x += state.ball_speed_x
			state.ball_y += state.ball_speed_y
			state.ball_x = bound(state.ball_x, GAME_SETTINGS.ball_size, 0, GAME_DIMENSIONS[0])
			state.ball_y = bound(state.ball_y, GAME_SETTINGS.ball_size, 0, GAME_DIMENSIONS[1])
		}
	}

	//INFO: MODIFIES STATE
	function tick_bounce_vertical(state, input) {
		if (
			state.ball_y == GAME_SETTINGS.ball_size ||
			state.ball_y == GAME_DIMENSIONS[1] - GAME_SETTINGS.ball_size
		)
			state.ball_speed_y *= -1;
	}

	function is_ball_on_left(state) {
		return state.ball_x == GAME_SETTINGS.ball_size;
	}
	function is_ball_on_right(state) {
		return state.ball_x == GAME_DIMENSIONS[0] - GAME_SETTINGS.ball_size;
	}
	function is_ball_on_wall(state) {
		return is_ball_on_left(state) || is_ball_on_right(state);
	}

	function is_ball_bouncing(ball_y, paddle_y) {
		return (
			ball_y - GAME_SETTINGS.ball_size < paddle_y + GAME_SETTINGS.paddle_height &&
			ball_y + GAME_SETTINGS.ball_size > paddle_y - GAME_SETTINGS.paddle_height
		);
	}

	function ball_bounce_y_speed(ball_y, paddle_y) {
		return (((ball_y - paddle_y) / GAME_SETTINGS.ball_y_speed_factor) | 0);
	}

	//INFO: MODIFIES STATE
	function multiplayer_tick_bounce_horizontal(state, input) {
		if (!is_ball_on_wall(state)) {
			return;
		}
		state.ball_speed_x *= -1
		if (is_ball_on_left(state)) {
			if (player_num == 1 && !is_ball_bouncing(state.ball_y, state.p1_height)) {
				scores[1] += 1;
				sock.send(JSON.stringify({
					type: "score",
					p1: scores[0],
					p2: scores[1]
				}))
				clearInterval(interval);
			} else {
				state.ball_speed_y = ball_bounce_y_speed(state.ball_y, state.p1_height)
			}
		} else {
			if (player_num == 2 && !is_ball_bouncing(state.ball_y, state.p2_height)) {
				scores[0] += 1;
				sock.send(JSON.stringify({
					type: "score",
					p1: scores[0],
					p2: scores[1]
				}))
				clearInterval(interval);
			} else {
				state.ball_speed_y = ball_bounce_y_speed(state.ball_y, state.p2_height)
			}
		}
	}

	//INFO: takes a state and an input, simulates the next state and returns it
	function multiplayer_tick(state, input) {
		let ret = Object.assign({}, state);

		ret.frame = state.frame + 1

		tick_move_paddle(ret, input)
		tick_move_ball(ret, input)
		tick_bounce_vertical(ret, input);
		multiplayer_tick_bounce_horizontal(ret, input);

		return ret
	}
	function multiplayer_update() {
		// go forward
		current_frame += 1

		// process local input
		if (inputs.length <= current_frame) {
			inputs[current_frame] = [undefined, undefined];
		}
		if (keys.has("ArrowUp") || keys.has("KeyW")) {
			inputs[current_frame][player_num - 1] = -1;
		} else if (keys.has("ArrowDown") || keys.has("KeyS")) {
			inputs[current_frame][player_num - 1] = 1;
		} else {
			inputs[current_frame][player_num - 1] = 0;
		}

		//send input
		sock.send(JSON.stringify({
			type: "input",
			frame: current_frame,
			input: inputs[current_frame][player_num - 1],
			player: player_num,
		}));

		// zip to last processed frame and recalculate until now
		// assume input is same for every frame since last input received before the calculated instance
		let validating = true
		let frame_input_count = 0
		current_state = Object.assign({}, last_processed_state);
		let input = [ // TODO: check off by one (it works doe)
			inputs[current_state.frame][0],
			inputs[current_state.frame][1]
		]
		while (current_state.frame < current_frame) {
			frame_input_count = 0
			current_state = multiplayer_tick(current_state, input)
			if (inputs[current_state.frame][0] != undefined) {
				input[0] = inputs[current_state.frame][0]
				frame_input_count += 1;
			}
			if (inputs[current_state.frame][1] != undefined) {
				input[1] = inputs[current_state.frame][1]
				frame_input_count += 1;
			}
			current_state = multiplayer_tick(current_state, input)
			if (validating && frame_input_count == 2) {
				last_processed_state = Object.assign({}, current_state);
				last_processed_frame = last_processed_state.frame
			} else {
				validating = false
			}
		}
		draw()
		//TODO: save 3 frame buffer and render a bit late
		// create an array of size 3 and save during while loop at the right place
		// only draw if array is of size 3
	}

	//INFO: MODIFIES STATE
	function local_bounce_horizontal(state, input) {
		if (!is_ball_on_wall(state)) {
			return;
		}
		state.ball_speed_x *= -1
		if (is_ball_on_left(state)) {
			if (!is_ball_bouncing(state.ball_y, state.p1_height)) {
				scores[1] += 1;
				init()
			} else {
				state.ball_speed_y = ball_bounce_y_speed(state.ball_y, state.p1_height)
			}
		} else {
			if (!is_ball_bouncing(state.ball_y, state.p2_height)) {
				scores[0] += 1;
				init()
			} else {
				state.ball_speed_y = ball_bounce_y_speed(state.ball_y, state.p2_height)
			}
		}
	}

	function bot_sim(p_y, ball_y, ball_x) {
		if (ball_x < GAME_SETTINGS.ball_speed * 2) {
			if (p_y < ball_y) {
				p_y += (GAME_SETTINGS.paddle_height * 2 / 3) | 0
			} else {
				p_y -= (GAME_SETTINGS.paddle_height * 2 / 3) | 0
			}
		}
		if (p_y < ball_y) {
			return 1;
		}
		if (p_y > ball_y) {
			return -1;
		}
		return 0;
	}

	function local_update() {
		inputs[0][0] = 0;
		if (bots[0]) {
			inputs[0][0] = bot_sim(current_state.p1_height, current_state.ball_y, current_state.ball_x);
		} else {
			if (keys.has("KeyW")) {
				inputs[0][0] = -1;
			} else if (keys.has("KeyS")) {
				inputs[0][0] = 1;
			}
			if (bots[1]) {
				if (keys.has("ArrowUp")) {
					inputs[0][0] = -1;
				} else if (keys.has("ArrowDown")) {
					inputs[0][0] = 1;
				}
			}
		}
		inputs[0][1] = 0;
		if (bots[1]) {
			inputs[0][1] = bot_sim(current_state.p2_height, current_state.ball_y, GAME_DIMENSIONS[0] - current_state.ball_x);
		} else {
			if (keys.has("ArrowUp")) {
				inputs[0][1] = -1;
			} else if (keys.has("ArrowDown")) {
				inputs[0][1] = 1;
			}
			if (bots[0]) {
				if (keys.has("KeyW")) {
					inputs[0][1] = -1;
				} else if (keys.has("KeyS")) {
					inputs[0][1] = 1;
				}
			}
		}
		tick_move_paddle(current_state, inputs[0])
		tick_move_ball(current_state, inputs[0])
		tick_bounce_vertical(current_state, inputs[0]);
		local_bounce_horizontal(current_state, inputs[0])
		draw()
		if (scores[0] == GAME_SETTINGS.win_score)
			game_end_callback(game_players[0]);
		if (scores[1] == GAME_SETTINGS.win_score)
			game_end_callback(game_players[1]);
	}
	function draw() {
		let state = current_state
		reset()
		//draw text
		{
			buff_ctx.fillText(scores[0] + " - " + scores[1], (VIEW_DIMENSIONS[0] / 2) | 0, (VIEW_DIMENSIONS[1] / 3) | 0)
			if (state.countdown_frames > 0)
				buff_ctx.fillText((state.countdown_frames + 59) / 60 | 0, (VIEW_DIMENSIONS[0] / 2) | 0, (VIEW_DIMENSIONS[1] * 2 / 3) | 0)
		}
		//draw ball
		{
			let outline_width = 1;
			reset_rect(
				state.ball_x - GAME_SETTINGS.ball_size - outline_width,
				state.ball_y - GAME_SETTINGS.ball_size - outline_width,
				state.ball_x + GAME_SETTINGS.ball_size + outline_width,
				state.ball_y + GAME_SETTINGS.ball_size + outline_width
			);
			draw_rect(
				state.ball_x - GAME_SETTINGS.ball_size,
				state.ball_y - GAME_SETTINGS.ball_size,
				state.ball_x + GAME_SETTINGS.ball_size,
				state.ball_y + GAME_SETTINGS.ball_size
			);
		}
		//draw paddles
		{
			draw_rect(
				0,
				state.p1_height - GAME_SETTINGS.paddle_height,
				GAME_SETTINGS.paddle_width,
				state.p1_height + GAME_SETTINGS.paddle_height
			);
			draw_rect(
				GAME_DIMENSIONS[0] - GAME_SETTINGS.paddle_width,
				state.p2_height - GAME_SETTINGS.paddle_height,
				GAME_DIMENSIONS[0],
				state.p2_height + GAME_SETTINGS.paddle_height
			);
		}
		//copy buffer
		ctx.drawImage(BUFF, 0, 0);
	}
	sock.onmessage = function (object) {
		try {
			let inner = JSON.parse(object.data);
			if (inner.type == "player_assign") {
				player_num = inner.value;
				console.log("Assigned to player ", player_num);
				if (player_num == 2) {
					sock.send('{"type":"score","p1":0, "p2": 0}')
				}
			} else if (inner.type == "score") {
				//console.log("received score update ", inner);
				page_state = States.MP_Game
				scores[0] = inner.p1;
				scores[1] = inner.p2;
				clearInterval(interval);
				init()
				interval = setInterval(multiplayer_update, 1000 / 60)
			} else if (inner.type == "input") {
				while (inner.frame >= inputs.length) {
					inputs[inputs.length] = [undefined, undefined]
				}
				inputs[inner.frame][inner.player - 1] = inner.input;
			}

		} catch (e) {
			console.log("couldn't parse: ", object.data);
			return
		}
	}


	// HACK: debug features
	// document.getElementById("tournament").onclick = function () { start_tournament() }
	// document.getElementById("send_score_0").onclick = function () { sock.send('{"type":"score","p1":0, "p2": 0}') }
	// document.getElementById("send_score_1").onclick = function () { sock.send('{"type":"score","p1":1, "p2": 0}') }
	// document.getElementById("send_score_w").onclick = function () { sock.send('{"type":"score","p1":10, "p2": 0}') }
	// document.getElementById("print_input").onclick = function () { console.log(keys) }
	// document.getElementById("shutup").onclick = function () { clearTimeout(interval) }
	// document.getElementById("disconnect").onclick = function () { sock.close() }

	function main_menu() {
		let half_x = (GAME_DIMENSIONS[0] / 2) | 0;
		let quarter_x = (VIEW_DIMENSIONS[0] / 4) | 0;
		let half_y = (VIEW_DIMENSIONS[1] / 2) | 0;
		let line_width = 8;

		reset();
		draw_rect(half_x - line_width, 0, half_x + line_width, GAME_DIMENSIONS[1]);
		buff_ctx.fillText("1P Game", quarter_x, half_y)
		buff_ctx.fillText("2P Game", quarter_x * 3, half_y)
		ctx.drawImage(BUFF, 0, 0);
		page_state = States.Menu
	}

	function canvas_click(param) {
		switch (page_state) {
			case States.SP_Game:
				//TODO: pause/unpause ?
				break;
			case States.MP_Game:
				break;
			case States.Tournament:
				break;
			case States.Menu:
				let clickx = param.clientX - VIEW.getBoundingClientRect().left;
				init();
				scores = [0, 0]
				//P1 side
				if (clickx < VIEW_DIMENSIONS[0] / 2) {
					bots = [0, 1];
					if (keys.has("Space"))
						bots = [1, 0];
					clearInterval(interval);
					interval = setInterval(local_update, 1000 / 60)
					page_state = States.SP_Game
				} else {
					bots = [0, 0];
					if (keys.has("Space"))
						bots = [1, 1];
					clearInterval(interval);
					interval = setInterval(local_update, 1000 / 60)
					page_state = States.SP_Game
				}
				break;
			case States.Scores:
				console.log("HAI")
				next_round()
				break;
		}
	}

	let rounds = [];
	let players = []
	let current_game = 0;
	let current_round = 0;

	function name_enter(key_event) {
		if (key_event.code == "Backquote") {
			page_state = States.Name_Entry;
			render_name();
		}
		if (page_state != States.Name_Entry)
			return;
		function isValid(str) {
			return str.length == 1 &&
				((str >= 'a' && str <= 'z') ||
					(str >= 'A' && str <= 'Z') ||
					(str >= "0" && str <= "9") ||
					str == "_" ||
					str == "-"
				);
		}
		console.log(key_event);
		//select index
		let index = players.length - 1;
		if (index == -1) index = 0;
		//grab string/create
		let string = players[index];
		if (string === undefined) string = "";
		//modify
		if (isValid(key_event.key))
			string += key_event.key;
		if (key_event.key == "Backspace")
			string = string.substring(0, string.length - 1);
		//save
		players[index] = string;
		//enter handling
		if (key_event.key == "Enter") {
			if (string == "") {
				if (players.length > 2) {
					players.pop(players.length - 1);
					start_tournament();
					return;
				}
			} else {
				players[players.length] = "";
			}
		}
		//render
		render_name();
	}

	function render_name() {
		let index = players.length - 1;
		if (index == -1) index = 0;
		let string = players[index];
		if (string === undefined) string = "";
		reset();
		if (string == "") {
			buff_ctx.fillText("Press enter to begin", VIEW_DIMENSIONS[0] / 2, VIEW_DIMENSIONS[1] / 3)
			buff_ctx.fillText("or type a name", VIEW_DIMENSIONS[0] / 2, VIEW_DIMENSIONS[1] * 2 / 3)
		} else {
			buff_ctx.fillText(string, VIEW_DIMENSIONS[0] / 2, VIEW_DIMENSIONS[1] / 2);
		}
		ctx.drawImage(BUFF, 0, 0);
	}

	function next_power_of_2(n) {
		let ret = 1;
		while (ret < n)
			ret <<= 1;
		return ret;
	}

	function fill_rounds(title) {
		rounds.push([])
		for (let i = 0; i < next_power_of_2(players.length); i++) {
			if (i < players.length) {
				rounds[0][i] = players[i];
			} else {
				rounds[0][i] = null;
			}
		}
		while (rounds[rounds.length - 1].length > 1) {
			rounds.push([])
			for (let i = 0; i < rounds[rounds.length - 2].length / 2; i++) {
				rounds[rounds.length - 1].push(null);
			}
		}
	}

	function start_tournament() {
		rounds = [];
		fill_rounds();
		current_game = 0;
		current_round = 0;
		page_state = States.Scores;
		render_rounds();
	}

	function play_game(p1, p2) {
		page_state = States.Tournament;
		game_players = [p1, p2]
		init();

		scores = [0, 0]
		bots = [0, 0];
		if (p1 === "bot")
			bots[0] = 1;
		if (p2 === "bot")
			bots[1] = 1;
		clearInterval(interval);
		interval = setInterval(local_update, 1000 / 60)
	}

	function next_round() {
		if (current_round >= rounds.length - 1) {
			main_menu()
			return rounds[rounds.length - 1][0];
		}
		//start game
		let p1 = rounds[current_round][current_game * 2]
		let p2 = rounds[current_round][current_game * 2 + 1]
		console.log("round " + current_round + " game " + current_game + ": " + p1 + " vs " + p2)
		if (p2 === null) {
			page_state = States.Tournament;
			game_end_callback(p1);
		} else {
			play_game(p1, p2)
		}
	}

	function game_end_callback(winner) {
		clearInterval(interval);
		switch (page_state) {
			case States.SP_Game:
			case States.MP_Game:
				main_menu()
				break;
			case States.Tournament:
				page_state = States.Scores;
				rounds[current_round + 1][current_game] = winner
				current_game += 1
				current_game %= rounds[current_round].length / 2
				if (current_game == 0)
					current_round += 1
				render_rounds();
				break;
			case States.Menu:
				break;
			case States.Scores:
				break;
		}
	}

	function render_rounds() {
		reset()
		let round;
		for (let i = 0; i < rounds.length; i++) {
			round = rounds[i]
			for (let j = 0; j < round.length; j++) {
				let content = round[j]
				if (content === null)
					content = "ø"
				buff_ctx.fillText(content, VIEW_DIMENSIONS[0] * (i + 1) / (rounds.length + 1), VIEW_DIMENSIONS[1] * (j + 1) / (round.length + 1));
			}
		}
		ctx.drawImage(BUFF, 0, 0);
	}

	initPong();
	main_menu();
}
