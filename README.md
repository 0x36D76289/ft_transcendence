# 🎮 ft_transcendence

Welcome to **ft_transcendence**, a multiplayer web-based game application built with **Django**, **PostgreSQL**, and **Vanilla JavaScript**. Below are the project specifications, game system overview, security concerns, and backend API documentation.

---

## 📑 Table of Contents

1. [Minimal Technical Requirements](#️-minimal-technical-requirements)
2. [Game System](#️-game-system)
3. [Security Concerns](#️-security-concerns)
4. [Modules Overview](#-modules-overview)
5. [Backend API Documentation](#️-backend-api-documentation)
   - [User Endpoints](#user-endpoints)
   - [Game Endpoints](#game-endpoints)
   - [Chat Endpoints](#chat-endpoints)

---

## ⚙️ Minimal Technical Requirements

- **Frontend**: Pure **vanilla JavaScript**
- **Backend**: Built with **Django**
- **Database**: Utilizes **PostgreSQL**
- **Browser Compatibility**: Latest stable version of **Google Chrome**
- **Error Handling**: No unhandled errors or warnings during browsing
- **Docker**: Run everything with a single command

---

## 🕹️ Game System

- **Same Keyboard Play**: Both players use the same keyboard.
- **Tournament Mode**: Players can propose and enter tournaments with temporary alias names.
- **Matchmaking**: A built-in system for matchmaking between players.
- **Unified Game Rules**: All players must adhere to identical game rules, including paddle speed.

---

## 🔐 Security Concerns

- **Password Security**: All passwords must be hashed using a strong algorithm.
- **Injection Protection**: Protect against SQL injections and XSS attacks.
- **HTTPS**: Enable **HTTPS** for all connections, using **wss** for WebSockets.
- **Input Validation**: Implement server-side validation for all forms and user inputs.
- **Environment Variables**: Store credentials, API keys, and other sensitive data in a `.env` file, which should be added to `.gitignore`.

---

## 📦 Modules Overview

To complete the project, a minimum of **7 major modules** is required. Two minor modules can replace one major module. The following modules are included:

### Web Development

- **Major Module**: Use a framework as backend
- **Minor Module**: Use a database for the backend

### User Management

- **Major Module**: Standard user management, authentication, users across tournaments
- **Major Module**: Implement remote authentication

### Gameplay & UX

- **Major Module**: Remote players
- **Major Module**: Live chat

### AI & Algorithms

- **Major Module**: Introduce an AI opponent
- **Minor Module**: User and game stats dashboards

### Cybersecurity

- **Major Module**: Implement Two-Factor Authentication (2FA) and JWT

### DevOps

- **Minor Module**: Monitoring system

### Gaming

- **Major Module**: Add another game with user history and matchmaking
- **Minor Module**: Game customization options

### Accessibility

- **Minor Modules**: Support for all devices, expanding browser compatibility, multi-language support, SSR integration

---

## 🚀 Backend API Documentation

All API requests are either **GET** or **POST**. POST requests should use the appropriate headers. Authorization requires the header for logged-in users.

### User Endpoints

| **Endpoint**                  | **Method** | **Description**                                                          | **Request**                                               | **Response**                                                       |
| ----------------------------- | ---------- | ------------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------ |
| `/user/register`              | **POST**   | Register a new user                                                      | `username`, `password` in body, optional: `bio`           | `detail`, `username` on success                                    |
| `/user/login`                 | **POST**   | Log in a user, returns an authentication token                           | `username`, `password` in body                            | `token`, `username` on success                                     |
| `/user/logout`                | **POST**   | Log out a user and invalidate the token                                  | Authorization in header                                   | `detail` in body                                                   |
| `/user/is_token_valid`        | **POST**   | Check if a token is valid                                                | `token` in body                                           | `detail`, `username` on success                                    |
| `/user/update_user`           | **POST**   | Update user information                                                  | Authorization in header, `username`, `bio` in body        | `detail` in body                                                   |
| `/user/delete_user`           | **POST**   | Delete user                                                              | Authorization in header                                   | `detail` in body                                                   |
| `/user/profile/<username>`    | **GET**    | Get public information of a user                                         | Authorization in header                                   | `id`, `username`, `bio`, `date_joined`, `is_online`, `last_online` |
| `/user/stats/<username>`      | **GET**    | Get public game stats of a user                                          | Authorization in header                                   | `games_played`, `win_rate` in body                                 |
| `/user/list`                  | **GET**    | List the last 20 registered users                                        | Authorization in header                                   | List of users                                                      |
| `/user/send_friend_request`   | **POST**   | Send a friend request, or accept if the user already sent you one        | Authorization in header, `username` in body (target user) | `detail` in body                                                   |
| `/user/remove_friend_request` | **POST**   | Remove a friend request, decline a request, or unfriend                  | Authorization in header, `username` in body (target user) | `detail` in body                                                   |
| `/user/get_friendship`        | **POST**   | Get friendship status with a user (FRIEND, REQ_SENT, REQ_RECEIVED, NONE) | Authorization in header, `username` in body               | `detail` in body                                                   |

### Game Endpoints

| **Endpoint**           | **Method** | **Description**                         | **Response**                                                                    |
| ---------------------- | ---------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| `/game/history`        | **GET**    | Get the history of all games played     | List of games with `p1`, `p2`, `p1_score`, `p2_score`, `time_start`, `time_end` |
| `/game/history/<user>` | **GET**    | Get the game history of a specific user | List of games with `p1`, `p2`, `p1_score`, `p2_score`, `time_start`, `time_end` |

### Chat Endpoints

| **Endpoint**            | **Method** | **Description**                    | **Request**                                            | **Response**                                                       |
| ----------------------- | ---------- | ---------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------ |
| `/chat/get/<user>`      | **GET**    | Get chat history with another user | Authorization in header                                | List of messages (`sender`, `receiver`, `content`, `time_created`) |
| `/chat/send`            | **POST**   | Send a message to another user     | Authorization in header, `username`, `message` in body | `detail` in body                                                   |
| `/chat/block`           | **POST**   | Block another user                 | Authorization in header, `username` in body            | `detail` in body                                                   |
| `/chat/unblock`         | **POST**   | Unblock another user               | Authorization in header, `username` in body            | `detail` in body                                                   |
| `/chat/is_user_blocked` | **GET**    | Check if a user is blocked         | Authorization in header                                | `detail` in body                                                   |

---

## ⚠️ Debug Endpoints

- `/game`: Allows manual game creation via browser
- `/chat`: Allows manual message creation via browser
