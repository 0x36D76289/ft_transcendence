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

# Documentation de l'API

## Endpoints Utilisateurs

### **Tableau des Endpoints Utilisateurs**

| **Endpoint**                  | **Method** | **Description**                                                          | **Request**                                               | **Response**                                                       |
| ----------------------------- | ---------- | ------------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------ |
| `/user/register`              | **POST**   | Register a new user                                                      | `username`, `password` in body, optional: `bio`           | `detail`, `username` on success                                    |
| `/user/login`                 | **POST**   | Log in a user, returns an authentication token                           | `username`, `password` in body                            | `token`, `username` on success                                     |
| `/user/logout`                | **POST**   | Log out a user and invalidate the token                                  | Authorization in header                                   | `detail` in body                                                   |
| `/user/is_token_valid`        | **POST**   | Check if a token is valid                                                | `token` in body                                           | `detail`, `username` on success                                    |
| `/user/update_user`           | **POST**   | Update user information                                                  | Authorization in header, `username`, `bio` in body        | `detail` in body                                                   |
| `/user/delete_user`           | **POST**   | Delete user                                                              | Authorization in header                                   | `detail` in body                                                   |
| `/user/create_guest`          | **POST**   | Create a guest user                                                      |                                                           | `token`, `username`, `detail` in body                              |
| `/user/profile/<username>`    | **GET**    | Get public information of a user                                         | Authorization in header                                   | `id`, `username`, `bio`, `date_joined`, `is_online`, `last_online` |
| `/user/stats/<username>`      | **GET**    | Get public game stats of a user                                          | Authorization in header                                   | `games_played`, `win_rate` in body                                 |
| `/user/list`                  | **GET**    | List the last 20 registered users                                        | Authorization in header                                   | List of users                                                      |
| `/user/send_friend_request`   | **POST**   | Send a friend request, or accept if the user already sent you one        | Authorization in header, `username` in body (target user) | `detail` in body                                                   |
| `/user/remove_friend_request` | **POST**   | Remove a friend request, decline a request, or unfriend                  | Authorization in header, `username` in body (target user) | `detail` in body                                                   |
| `/user/get_friendship`        | **GET**    | Get friendship status with a user                                        | Authorization in header, `username` in body               | `detail` in body                                                   |
| `/user/get_friends`           | **GET**    | Get friends of a user                                                    | Authorization in header, `username` in body               | List of friends with `user` being the friend information and `status` being equal to 'friend', 'request_sent' or 'request_received', `detail` if failed                                |
| `/ws/user/online_status`      | **WEBSOCKET** | Set is_online status to True when user is connected to this websocket   | token=`token` in query string                             |                                                                   |

---

## Endpoints de Jeu

### **Tableau des Endpoints de Jeu**

| **Endpoint**           | **Method** | **Description**                         | **Response**                                                                    |
| ---------------------- | ---------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| `/game/history`        | **GET**    | Get the history of all games played     | List of games with `p1`, `p2`, `p1_score`, `p2_score`, `time_start`, `time_end` |
| `/game/history/<user>` | **GET**    | Get the game history of a specific user | List of games with `p1`, `p2`, `p1_score`, `p2_score`, `time_start`, `time_end` |

---

## Endpoints de Chat

### **Tableau des Endpoints de Chat**

| **Endpoint**            | **Method** | **Description**                    | **Request**                                            | **Response**                                                       |
| ----------------------- | ---------- | ---------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------ |
| `/chat/<int:convo_id>`  | **GET**    | Get conversation of the corresponding id | Authorization in header                                | `{id, participants: [list of users], message_set: [list of messages]}`. `detail` if error |
| `/chat/conversations`   | **GET**    | Get all the conversations of the user | Authorization in header                                | List of `{id, other_user, last_message}`. `detail` if error        |
| `/chat/start`           | **POST**   | Start and/or get conversation with another user     | Authorization in header, `username` in body           | `{id, participants: [list of users], message_set: [list of messages]}`. `detail` if error |
| `/ws/chat/<int:convo_id>` | **WEBSOCKET** | Open a websocket to the conversation id              | token=`token` in query string                             |                                                                   |
| `/chat/block`           | **POST**   | Block another user                                   | Authorization in header, `username` in body            | `detail` in body                                                   |
| `/chat/unblock`         | **POST**   | Unblock another user                                 | Authorization in header, `username` in body            | `detail` in body                                                   |
| `/chat/is_user_blocked` | **GET**    | Check if a user is blocked                           | Authorization in header                                | `detail` in body                                                   |

---

## Debug Endpoints

| **Endpoint** | **Description**                                   |
| ------------ | ------------------------------------------------- |
| `/game`      | Allows manual game creation via browser           |
| `/chat`      | Allows manual message creation via browser        |
| `/debug/test_data` | (POST) creates test data for testing        |


## 📦 Composants des données renvoyées par l'API

### 🧑‍🤝‍🧑 **Composants Utilisateurs**

#### **Utilisateur**
- `id` : Identifiant unique de l'utilisateur (*int*).
- `username` : Nom d'utilisateur (*string*).
- `bio` : Biographie de l'utilisateur (*string*, facultatif).
- `date_joined` : Date d'inscription de l'utilisateur (*datetime*).
- `is_online` : Indique si l'utilisateur est actuellement en ligne (*bool*).
- `last_online` : Dernière connexion de l'utilisateur (*datetime*).

#### **Authentification**
- `token` : Jeton d'authentification utilisé pour les requêtes sécurisées (*string*).
- `detail` : Message décrivant le statut de l'opération (*string*).

#### **Statistiques**
- `games_played` : Nombre de parties jouées par l'utilisateur (*int*).
- `win_rate` : Taux de victoire de l'utilisateur en pourcentage (*float*).

#### **Amis**
- `friendship_status` : État de la relation avec un utilisateur donné (*string*) : `"FRIEND"`, `"REQ_SENT"`, `"REQ_RECEIVED"`, `"NONE"`.
- `friends` : Liste des amis, chaque ami étant un objet contenant :
  - `id` : Identifiant unique de l'ami (*int*).
  - `username` : Nom d'utilisateur de l'ami (*string*).
  - `is_online` : État en ligne de l'ami (*bool*).

---

### 🎮 **Composants de Jeu**

#### **Historique de Partie**
- `p1` : Nom d'utilisateur du joueur 1 (*string*).
- `p2` : Nom d'utilisateur du joueur 2 (*string*).
- `p1_score` : Score final du joueur 1 (*int*).
- `p2_score` : Score final du joueur 2 (*int*).
- `time_start` : Date et heure du début de la partie (*datetime*).
- `time_end` : Date et heure de fin de la partie (*datetime*).

#### **Historique Spécifique à un Utilisateur**
Identique à l'historique général, mais filtré pour un utilisateur donné.

---

### 💬 **Composants de Chat**

#### **Conversation**
- `id` : Identifiant unique de la conversation (*int*).
- `initiator` : Nom d'utilisateur de l'initiateur de la conversation (*string*).
- `receiver` : Nom d'utilisateur du destinataire de la conversation (*string*).
- `message_set` : Liste de messages dans la conversation. Chaque message contient :
  - `id` : Identifiant unique du message (*int*).
  - `sender` : Nom d'utilisateur de l'expéditeur (*string*).
  - `content` : Contenu du message (*string*).
  - `timestamp` : Date et heure d'envoi (*datetime*).

#### **Liste des Conversations**
- `id` : Identifiant unique de la conversation (*int*).
- `other_user` : Nom d'utilisateur de l'autre participant à la conversation (*string*).
- `last_message` : Dernier message envoyé dans la conversation, avec les mêmes champs que les messages individuels.

#### **Blocage**
- `is_blocked` : Indique si un utilisateur est bloqué (*bool*).
- `detail` : Message décrivant le statut de l'opération (*string*).

---

### 🔌 **Composants Websocket**

#### **Statut en Ligne (Utilisateur)**
- `token` : Jeton d'authentification utilisé pour établir la connexion websocket.
- `is_online` : État en ligne automatiquement mis à jour à `true` lorsque connecté.

#### **Messages de Conversation**
- JSON envoyé via le websocket pour un message : 
  ```json
  {
    "message": "Contenu du message"
  }

