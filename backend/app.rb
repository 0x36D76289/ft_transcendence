require 'sinatra'
require 'pg'

get '/' do
  'Hello from the backend!'
end

get '/users' do
  conn = PG.connect(ENV['DATABASE_URL'])
  result = conn.exec('SELECT * FROM users')
  users = result.map { |row| row }
  conn.close
  users.to_json
end
