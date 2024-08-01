-- Table des joueurs
CREATE TABLE players (
	player_id SERIAL PRIMARY KEY,
	username VARCHAR(50) UNIQUE NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	date_of_birth DATE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des amis
CREATE TABLE friends (
	player_id INT NOT NULL REFERENCES players(player_id),
	friend_id INT NOT NULL REFERENCES players(player_id),
	status VARCHAR(50) DEFAULT 'pending',
	PRIMARY KEY (player_id, friend_id)
);

-- Table des parties
CREATE TABLE games (
	game_id SERIAL PRIMARY KEY,
	player1_id INT NOT NULL REFERENCES players(player_id),
	player2_id INT NOT NULL REFERENCES players(player_id),
	player1_score INT DEFAULT 0,
	player2_score INT DEFAULT 0,
	winner_id INT REFERENCES players(player_id),
	game_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	duration INTERVAL,
	number_of_rallies INT DEFAULT 0,
	max_rally_length INT DEFAULT 0,
	game_status VARCHAR(50) DEFAULT 'ongoing'
);

-- Table des configurations de partie
CREATE TABLE game_configurations (
	config_id SERIAL PRIMARY KEY,
	game_id INT NOT NULL REFERENCES games(game_id) ON DELETE CASCADE,
	max_score INT DEFAULT 10,
	game_speed INT DEFAULT 1,
	ball_size INT DEFAULT 1,
	paddle_size INT DEFAULT 1
);

-- Table de l'historique des parties
CREATE TABLE game_history (
	history_id SERIAL PRIMARY KEY,
	game_id INT NOT NULL REFERENCES games(game_id) ON DELETE CASCADE,
	player_id INT NOT NULL REFERENCES players(player_id),
	score INT NOT NULL,
	result VARCHAR(50) CHECK (result IN ('win', 'lose', 'draw'))
);

-- Table des messages de chat (dans le contexte d'une partie)
CREATE TABLE game_chat_messages (
	message_id SERIAL PRIMARY KEY,
	game_id INT NOT NULL REFERENCES games(game_id) ON DELETE CASCADE,
	sender_id INT NOT NULL REFERENCES players(player_id),
	message TEXT NOT NULL,
	sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des messages privés
CREATE TABLE private_messages (
	message_id SERIAL PRIMARY KEY,
	sender_id INT NOT NULL REFERENCES players(player_id),
	receiver_id INT NOT NULL REFERENCES players(player_id),
	message TEXT NOT NULL,
	sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des classements
CREATE TABLE leaderboards (
	leaderboard_id SERIAL PRIMARY KEY,
	player_id INT NOT NULL REFERENCES players(player_id),
	score INT NOT NULL,
	rank INT NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des notifications
CREATE TABLE notifications (
	notification_id SERIAL PRIMARY KEY,
	player_id INT NOT NULL REFERENCES players(player_id),
	message TEXT NOT NULL,
	is_read BOOLEAN DEFAULT FALSE,
	sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des tournois
CREATE TABLE tournaments (
	tournament_id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	start_date TIMESTAMP NOT NULL,
	end_date TIMESTAMP NOT NULL,
	status VARCHAR(50) DEFAULT 'upcoming'
);

-- Table des participants aux tournois
CREATE TABLE tournament_participants (
	participant_id SERIAL PRIMARY KEY,
	tournament_id INT NOT NULL REFERENCES tournaments(tournament_id),
	player_id INT NOT NULL REFERENCES players(player_id),
	join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des succès
CREATE TABLE achievements (
	achievement_id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	description TEXT NOT NULL
);

-- Table des succès des joueurs
CREATE TABLE player_achievements (
	player_id INT NOT NULL REFERENCES players(player_id),
	achievement_id INT NOT NULL REFERENCES achievements(achievement_id),
	achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (player_id, achievement_id)
);

-- Table des sessions de jeu
CREATE TABLE game_sessions (
	session_id SERIAL PRIMARY KEY,
	game_id INT NOT NULL REFERENCES games(game_id) ON DELETE CASCADE,
	player_id INT NOT NULL REFERENCES players(player_id),
	session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	session_end TIMESTAMP
);

-- Indexes pour optimiser les recherches
CREATE INDEX idx_player_username ON players(username);
CREATE INDEX idx_game_date ON games(game_date);
CREATE INDEX idx_sender_id ON private_messages(sender_id);
CREATE INDEX idx_receiver_id ON private_messages(receiver_id);
CREATE INDEX idx_notification_player_id ON notifications(player_id);
