require 'rack'
require 'faye/websocket'
require 'json'
require 'pg'
require 'jwt'
require 'bcrypt'

class App
  # Initializes a new instance of the App class.
  def initialize
    @games = {}
    @clients = {}
  end

  # Handles incoming requests.
  #
  # @param env [Hash] The Rack environment.
  # @return [Array] The Rack response.
  def call(env)
    req = Rack::Request.new(env)
    
    headers = {
      'Access-Control-Allow-Origin' => '*',
      'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers' => 'Content-Type,Authorization'
    }

    if req.options?
      return [200, headers, []]
    end

    if Faye::WebSocket.websocket?(env)
      handle_websocket(env)
    else
      handle_http(req, headers)
    end
  end

  private

  # Handles WebSocket connections.
  #
  # @param env [Hash] The Rack environment.
  def handle_websocket(env)
    ws = Faye::WebSocket.new(env)

    ws.on :open do |event|
      client_id = generate_client_id
      @clients[client_id] = ws
    end

    ws.on :message do |event|
      data = JSON.parse(event.data)
      case data['type']
      when 'gameState'
        handle_game_state(data)
      when 'chatMessage'
        handle_chat_message(data)
      end
    end

    ws.on :close do |event|
      @clients.delete_if { |_, socket| socket == ws }
      ws = nil
    end

    ws.rack_response
  end

  # Handles HTTP requests.
  #
  # @param req [Rack::Request] The Rack request.
  # @param headers [Hash] The response headers.
  # @return [Array] The Rack response.
  def handle_http(req, headers)
    case req.path
    when '/login'
      handle_login(req, headers)
    when '/register'
      handle_register(req, headers)
    else
      [404, headers.merge({ 'Content-Type' => 'text/plain' }), ['Not Found']]
    end
  end

  # Handles the login request.
  #
  # @param req [Rack::Request] The Rack request.
  # @param headers [Hash] The response headers.
  # @return [Array] The Rack response.
  def handle_login(req, headers)
    data = JSON.parse(req.body.read)
    username = data['username']
    password = data['password']

    user = query("SELECT * FROM users WHERE username = $1", [username]).first

    if user && BCrypt::Password.new(user['password_hash']) == password
      token = JWT.encode({ user_id: user['id'] }, ENV['JWT_SECRET'], 'HS256')
      [200, headers.merge({ 'Content-Type' => 'application/json' }), [{ token: token }.to_json]]
    else
      [401, headers.merge({ 'Content-Type' => 'application/json' }), [{ error: 'Invalid credentials' }.to_json]]
    end
  end

  # Handles the registration request.
  #
  # @param req [Rack::Request] The Rack request.
  # @param headers [Hash] The response headers.
  # @return [Array] The Rack response.
  def handle_register(req, headers)
    data = JSON.parse(req.body.read)
    username = data['username']
    password = data['password']
    email = data['email']
    first_name = data['firstName']
    age = data['age']

    password_hash = BCrypt::Password.create(password)

    begin
      query("INSERT INTO users (username, password_hash, email, first_name, age) VALUES ($1, $2, $3, $4, $5)",
            [username, password_hash, email, first_name, age])
      [201, headers.merge({ 'Content-Type' => 'application/json' }), [{ message: 'User created successfully' }.to_json]] # 201 Created
    rescue PG::UniqueViolation
      [409, headers.merge({ 'Content-Type' => 'application/json' }), [{ error: 'Username or email already exists' }.to_json]] # 409 Conflict
    end
  end

  # Handles the game state update.
  #
  # @param data [Hash] The game state data.
  def handle_game_state(data)
    game_id = data['gameId']
    @games[game_id] = data
    broadcast_to_game(game_id, data)
  end

  # Handles chat messages.
  #
  # @param data [Hash] The chat message data.
  def handle_chat_message(data)
    broadcast(data)
  end

  # Broadcasts data to all connected clients.
  #
  # @param data [Hash] The data to broadcast.
  def broadcast(data)
    @clients.each { |_, client| client.send(data.to_json) }
  end

  # Broadcasts data to all clients in a specific game.
  #
  # @param game_id [String] The game ID.
  # @param data [Hash] The data to broadcast.
  def broadcast_to_game(game_id, data)
    @clients.each do |_, client|
      client.send(data.to_json) if client.game_id == game_id
    end
  end

  # Generates a unique client ID.
  #
  # @return [String] The client ID.
  def generate_client_id
    SecureRandom.uuid
  end

  # Executes a SQL query.
  #
  # @param sql [String] The SQL query.
  # @param params [Array] The query parameters.
  # @return [PG::Result] The query result.
  def query(sql, params = [])
    conn = PG.connect(ENV['DATABASE_URL'])
    begin
      conn.exec_params(sql, params)
    ensure
      conn.close
    end
  end
end