# ft_transcendence

## ⚙️ Minimal technical requirement

- The front-end should be written in **pure vanilla JavaScript**
- The backend must be written in **Django** *(cf. Use a Framework as backend.).*
- Use **PostgreSQL** as Database *(cf. Use a database for the backend -and more.)*
- The website must be **compatible** with the latest stable up-to-date version of
**Google Chrome** .
- The user should encounter **no unhandled errors** and **no warnings** when browsing the
website.
- Everything must be launched with a single command line to run an autonomous
container provided by Docker . Example : **docker-compose up --build**. 

## 🕹️ Game system

- Both players will **use the same keyboard**.
- Should be possible to **propose a tournament**. At the start of a tournament, each player
must enter his temporary alias name *(cf. Major module: Standard user management, authentication, users across tournaments.)*
- There must be a **matchmaking system**
- All players must **adhere to the same rules**, which includes having identical paddle
speed

## 🔐 Security concerns

- Any password stored in your database, if applicable, **must be hashed**. Please make sure you use a **strong** password hashing algorithm
- The website must be **protected against SQL injections/XSS**.
- **Enable an HTTPS** connection for all aspects (Utilize wss instead of ws...).
- You need to **implement some form of validation** for forms and any user input on the server side if a backend is used.
- Regardless of whether you choose to implement the JWT Security module with 2FA, it’s crucial to prioritize the security of your website. For instance, if you opt to create an API, ensure your routes are protected. Remember, even if you decide not to use JWT tokens, securing the site remains essential. *(cf. Major module: Implement Two-Factor Authentication (2FA) and JWT.)*
- For obvious security reasons, **any credentials, API keys, env variables etc... must be saved locally in a .env** file and ignored by git. Publicly stored credentials will lead you directly to a failure of the project.

### Modules used for **mandatory**

To attain 100% project completion, **a minimum of 7 major modules is required**. Two Minor Modules are equivalent to one Major Module.

1 + 0.5 + 1 + 1 + 1 + 1 + 1 + 0.5
= 7

- Web
  - **Major module**: Use a Framework as backend.
  - Minor module: Use a database for the backend and more.

- User Management
  - **Major module**: Standard user management, authentication, users across tournaments.
  - **Major module**: Implementing a remote authentication.

- Gameplay and user experience
  - **Major module**: Remote players.
  - **Major module**: Live Chat.

- AI-Algo
  - **Major module**: Introduce an AI Opponent.
  - Minor module: User and Game Stats Dashboards.

- Cybersecurity
  - **Major module**: Implement Two-Factor Authentication (2FA) and JWT.

- Devops
  - Minor module: Monitoring system.

- Gaming
  - **Major module**: Add Another Game with User History and Matchmaking.
  - Minor module: Game Customization Options.

- Accessibility
  - Minor module: Support on all devices.
  - Minor module: Expanding Browser Compatibility.
  - Minor module: Multiple language supports.
  - Minor module: Server-Side Rendering (SSR) Integration.

## Backend API

- Requests to the backend are either **GET** or **POST** requests  
- **POST** requests that sends data in their body must send json, 
don't forget the header `Content-Type: application/json`
- Requests needing `Authorization: Token <token>` in header means they are only usable by logged users, `<token>` is the authentication token returned by the /user/login api

### User

- `/user/register` **POST**
  - _description:_ register a new user
  - _request:_ `username` and `password` in body
  - _response:_ `detail` and `username` in body when successful
- `/user/login` **POST**  
  - _description:_ log in a user, returns an authentication token
  - _request:_ `username` and `password` in body
  - _response:_ `token` and `username` in body when successful
- `/user/logout` **POST**  
  - _description:_ log out a user, deleting and invalidating the existing authentication token
  - _request:_ `Authorization: Token <token>` in header
  - _response:_ `detail` in body
- `/user/profile/<username>` **GET**  
  - _description:_ get public information of a user
  - _response:_ `id`, `username`, `bio`, `date_joined`, `is_online` and `last_online` in body
- `/user/stats/<username>` **GET**
  - _description:_ get public game stats of a user
  - _response:_ `games_played` and `win_rate` in body
- `/user/send_friend_request` **POST**
  - _description:_ send a friend request to another user, if this user already sent you a friend request you are now friends
  - _request:_ `Authorization: Token <token>` in header, `username` in body (username of the target)
  - _response:_ `detail` in body
- `/user/remove_friend_request` **POST**
  - _description:_ this api does either 3 things: remove a friend request you made to this user, decline a friend request the user made to you or remove friendship if you are already friends
  - _request:_ `Authorization: Token <token>` in header, `username` in body (username of the target)
  - _response:_ `detail` in body
- `/user/get_friendship` **POST**
  - _description:_ get the friendship information about a user, returns FRIEND if you are friends, REQ_SENT if you sent a friend request to this user, REQ_RECEIVED if you received a friend request from this user, else returns NONE
  - _request:_ `Authorization: Token <token>` in header, `username` in body (username of the target)
  - _response:_ `detail` in body

### Game

- `/game/history` **GET**
  - _description:_ get the history of all games played (il faudra limiter ici)
  - _response:_ a list of games in body containing each `p1`, `p2`, `p1_score`, `p2_score`, `time_start` and `time_end`

- `/game/history/<user>` **GET**
  - _description:_ get the history of games played by a user
  - _response:_ a list of games in body containing each `p1`, `p2`, `p1_score`, `p2_score`, `time_start` and `time_end`

### Chat

- `/chat/get/<user>` **GET**
  - _description:_ get the chat history with another user
  - _request:_ `Authorization: Token <token>` in header
  - _response:_ a list of messages in body containing each `sender`, `receiver`, `content` and `time_created`

- `/chat/get/<user>` **POST**
  - _description:_ send a message to another user
  - _request:_ `Authorization: Token <token>` in header, `username` and `message` in body
  - _response:_ `detail` in body

- `/chat/block` **POST**
  - _description:_ block another user
  - _request:_ `Authorization: Token <token>` in header, `username` in body
  - _response:_ `detail` in body

- `/chat/unblock` **POST**
  - _description:_ unblock another user
  - _request:_ `Authorization: Token <token>` in header, `username` in body
  - _response:_ `detail` in body

- `/chat/is_user_blocked` **GET**
  - _description:_ checks if a user is blocked, returns true or false in `detail` when successful
  - _request:_ `Authorization: Token <token>` in header, `username` in body
  - _response:_ `detail` in body