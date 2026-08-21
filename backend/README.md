# 🎮 Tic-Tac-Toe Backend API

A lightweight, beginner-friendly REST API for the Tic-Tac-Toe game built with **Node.js** and **Express.js**.

---

## 📌 Features
- **In-Memory Game State Management**: Tracks the 3x3 board, active player (`X`/`O`), and scores.
- **Move Validation**: Rejects occupied cells, out-of-range indices, and moves when a game has concluded.
- **Win & Draw Detection**: Evaluates all 8 winning rows/columns/diagonals and returns the exact winning combination indices.
- **Scoreboard Tracking**: Tracks cumulative Player X wins, Player O wins, and Ties.
- **CORS Enabled**: Allows direct communication with the frontend during local development.

---

## ⚙️ Prerequisites & Installation

### 1. Prerequisites
- **Node.js** (v14 or higher recommended)
- **npm** (Node Package Manager)

### 2. Install Dependencies
Open your terminal, navigate to the `backend/` directory, and run:

```bash
cd backend
npm install
```

This will install the required dependencies (`express` and `cors`).

---

## 🚀 Running the Server

### Normal Start
```bash
npm start
```

### Development Mode (with automatic reload on file changes)
```bash
npm run dev
```

By default, the server runs on **Port 5000**:
- **API URL**: `http://localhost:5000`
- **Game Endpoint Base**: `http://localhost:5000/api/game`

---

## 📡 API Endpoints & Reference

### 1. Health Check
- **URL**: `/api/health`
- **Method**: `GET`
- **Description**: Verifies that the server is online.
- **Response**:
```json
{
  "status": "healthy",
  "message": "Tic-Tac-Toe Backend API is running smoothly!",
  "endpoints": {
    "getGameState": "GET /api/game",
    "makeMove": "POST /api/game/move",
    "restartGame": "POST /api/game/restart",
    "resetScores": "POST /api/game/reset-scores"
  }
}
```

---

### 2. Get Game State
- **URL**: `/api/game`
- **Method**: `GET`
- **Description**: Returns the current 3x3 board state, active player, scores, and status.
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "board": ["", "", "", "", "", "", "", "", ""],
    "currentPlayer": "X",
    "isGameActive": true,
    "winner": null,
    "winningCombination": null,
    "scores": {
      "x": 0,
      "o": 0,
      "ties": 0
    },
    "message": "Player X's Turn"
  }
}
```

---

### 3. Make a Move
- **URL**: `/api/game/move`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "index": 4
}
```
*(Note: `index` must be an integer from `0` to `8` representing grid positions from top-left `0` to bottom-right `8`)*

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "board": ["", "", "", "", "X", "", "", "", ""],
    "currentPlayer": "O",
    "isGameActive": true,
    "winner": null,
    "winningCombination": null,
    "scores": {
      "x": 0,
      "o": 0,
      "ties": 0
    },
    "message": "Player O's Turn"
  }
}
```

#### Winning Move Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "board": ["X", "X", "X", "O", "O", "", "", "", ""],
    "currentPlayer": "X",
    "isGameActive": false,
    "winner": "X",
    "winningCombination": [0, 1, 2],
    "scores": {
      "x": 1,
      "o": 0,
      "ties": 0
    },
    "message": "Player X Wins!"
  }
}
```

#### Error Response Example (`400 Bad Request`):
```json
{
  "success": false,
  "error": "Cell 4 is already occupied by 'X'."
}
```

---

### 4. Restart Game (New Round)
- **URL**: `/api/game/restart`
- **Method**: `POST`
- **Description**: Clears the board and sets active turn to Player X, while **keeping existing scores**.
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "board": ["", "", "", "", "", "", "", "", ""],
    "currentPlayer": "X",
    "isGameActive": true,
    "winner": null,
    "winningCombination": null,
    "scores": {
      "x": 1,
      "o": 0,
      "ties": 0
    },
    "message": "Player X's Turn"
  }
}
```

---

### 5. Reset All Scores
- **URL**: `/api/game/reset-scores`
- **Method**: `POST`
- **Description**: Resets scoreboard counts (`x: 0, o: 0, ties: 0`) and clears the board.
- **Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "board": ["", "", "", "", "", "", "", "", ""],
    "currentPlayer": "X",
    "isGameActive": true,
    "winner": null,
    "winningCombination": null,
    "scores": {
      "x": 0,
      "o": 0,
      "ties": 0
    },
    "message": "Player X's Turn"
  }
}
```

---

## 📂 Project Structure
```
backend/
├── controllers/
│   └── gameController.js   # Game state, move validations, and win/draw evaluation logic
├── routes/
│   └── gameRoutes.js       # Express route handlers mapped to controller functions
├── package.json            # Node.js project metadata & dependencies
├── README.md               # Backend documentation and API guide
└── server.js               # Express application entrypoint and middleware setup
```
