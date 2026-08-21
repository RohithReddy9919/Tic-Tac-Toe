/**
 * Tic-Tac-Toe Frontend Client
 * Communicates with the Express REST API backend on port 5000.
 */

// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================

const API_BASE_URL = "http://localhost:5000/api/game";

// Local cache of game state
let currentGameState = {
  board: ["", "", "", "", "", "", "", "", ""],
  currentPlayer: "X",
  isGameActive: true,
  winner: null,
  winningCombination: null,
  scores: { x: 0, o: 0, ties: 0 },
  message: "Player X's Turn",
};

// ==========================================
// 2. DOM ELEMENT REFERENCES
// ==========================================

const cells = document.querySelectorAll(".cell");
const statusMessage = document.getElementById("status-message");
const restartBtn = document.getElementById("restart-btn");
const resetScoresBtn = document.getElementById("reset-scores-btn");

const scoreXElement = document.getElementById("score-x");
const scoreOElement = document.getElementById("score-o");
const scoreTiesElement = document.getElementById("score-ties");

// ==========================================
// 3. UI RENDERING FUNCTIONS
// ==========================================

/**
 * Updates the complete visual interface using data received from the backend.
 */
function renderUI(state) {
  currentGameState = state;

  // 1. Render each of the 9 board cells
  cells.forEach((cell, index) => {
    const val = state.board[index];
    cell.textContent = val;

    // Reset base classes
    cell.className = "cell";

    if (val === "X") {
      cell.classList.add("occupied", "cell-x");
      cell.setAttribute("aria-label", `Cell ${index + 1}: X`);
    } else if (val === "O") {
      cell.classList.add("occupied", "cell-o");
      cell.setAttribute("aria-label", `Cell ${index + 1}: O`);
    } else {
      cell.setAttribute("aria-label", `Cell ${index + 1}`);
    }

    // Highlight winning cells if a win occurred
    if (state.winningCombination && state.winningCombination.includes(index)) {
      cell.classList.add("winning-cell");
    }
  });

  // 2. Render Scoreboard
  if (state.scores) {
    scoreXElement.textContent = state.scores.x;
    scoreOElement.textContent = state.scores.o;
    scoreTiesElement.textContent = state.scores.ties;
  }

  // 3. Render Status Message Badge
  if (state.winner === "X") {
    statusMessage.className = "status-badge winner-x";
    statusMessage.innerHTML = `🎉 Player <span class="current-turn-indicator turn-x">X</span> Wins!`;
  } else if (state.winner === "O") {
    statusMessage.className = "status-badge winner-o";
    statusMessage.innerHTML = `🎉 Player <span class="current-turn-indicator turn-o">O</span> Wins!`;
  } else if (state.winner === "Draw") {
    statusMessage.className = "status-badge draw";
    statusMessage.innerHTML = `🤝 Game ended in a Draw!`;
  } else {
    const turnClass = state.currentPlayer === "X" ? "turn-x" : "turn-o";
    statusMessage.className = "status-badge";
    statusMessage.innerHTML = `Player <span class="current-turn-indicator ${turnClass}">${state.currentPlayer}</span>'s Turn`;
  }
}

/**
 * Displays error feedback in the status badge if an API call fails.
 */
function showError(msg) {
  statusMessage.className = "status-badge draw";
  statusMessage.innerHTML = `⚠️ ${msg}`;
}

// ==========================================
// 4. API COMMUNICATION FUNCTIONS
// ==========================================

/**
 * Fetches the latest game state from the backend API.
 */
async function fetchGameState() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }
    const result = await response.json();
    if (result.success && result.data) {
      renderUI(result.data);
    }
  } catch (error) {
    console.error("Failed to connect to backend:", error);
    showError("Connecting to backend server...");
  }
}

/**
 * Sends a move request to the backend when a cell is clicked.
 */
async function handleCellClick(event) {
  const cellIndex = parseInt(event.target.getAttribute("data-index"), 10);

  // Quick frontend guard: Don't send request if cell is occupied or game ended
  if (
    currentGameState.board[cellIndex] !== "" ||
    !currentGameState.isGameActive
  ) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index: cellIndex }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      renderUI(result.data);
    } else {
      console.warn("Move rejected by server:", result.error);
    }
  } catch (error) {
    console.error("Error making move:", error);
    showError("Failed to communicate with server");
  }
}

/**
 * Sends a restart request to the backend (clears board, preserves scores).
 */
async function restartGame() {
  try {
    const response = await fetch(`${API_BASE_URL}/restart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (response.ok && result.success) {
      renderUI(result.data);
    }
  } catch (error) {
    console.error("Error restarting game:", error);
    showError("Failed to restart game");
  }
}

/**
 * Sends a reset-scores request to the backend (clears board and scores).
 */
async function resetAllScores() {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (response.ok && result.success) {
      renderUI(result.data);
    }
  } catch (error) {
    console.error("Error resetting scores:", error);
    showError("Failed to reset scores");
  }
}

// ==========================================
// 5. EVENT LISTENERS & INITIALIZATION
// ==========================================

// Attach click listeners to all 9 grid cells
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

// New Game button
restartBtn.addEventListener("click", restartGame);

// Reset Scores button
resetScoresBtn.addEventListener("click", resetAllScores);

// Fetch initial game state from backend on startup
fetchGameState();
