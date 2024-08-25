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
