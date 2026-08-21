/**
 * Tic-Tac-Toe Game Logic
 * Beginner-friendly and modular JavaScript implementation
 */

// ==========================================
// 1. GAME CONSTANTS & STATE VARIABLES
// ==========================================

// All 8 possible winning line combinations in a 3x3 grid (indices 0 to 8)
const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Top-left to bottom-right diagonal
  [2, 4, 6], // Top-right to bottom-left diagonal
];

// Current state of the 9 board cells ("" means empty, or "X", "O")
let boardState = ["", "", "", "", "", "", "", "", ""];

// Tracks whose turn it is ("X" or "O")
let currentPlayer = "X";

// Tracks whether the game is actively accepting moves
let isGameActive = true;

// Scores object
let scores = {
  x: 0,
  o: 0,
  ties: 0,
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
// 3. GAME FUNCTIONS
// ==========================================

/**
 * Handles cell click events.
 * Triggered whenever a player clicks on any of the 9 grid cells.
 */
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"), 10);

  // Guard Clause 1: If cell is already occupied or game is inactive, ignore click
  if (boardState[clickedCellIndex] !== "" || !isGameActive) {
    return;
  }

  // Execute player move
  executeMove(clickedCell, clickedCellIndex);

  // Check outcome (win, draw, or switch turn)
  checkGameResult();
}

/**
 * Updates internal board state and visual representation for a move.
 */
function executeMove(cellElement, cellIndex) {
  // Update data array
  boardState[cellIndex] = currentPlayer;

  // Update cell UI
  cellElement.textContent = currentPlayer;
  cellElement.classList.add("occupied", currentPlayer === "X" ? "cell-x" : "cell-o");
  cellElement.setAttribute("aria-label", `Cell ${cellIndex + 1}: ${currentPlayer}`);
}

/**
 * Evaluates the board after each move to detect win, draw, or continue.
 */
function checkGameResult() {
  let roundWon = false;
  let winningCombination = null;

  // Loop through all 8 winning combinations
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    const valA = boardState[a];
    const valB = boardState[b];
    const valC = boardState[c];

    // Skip if any cell in the trio is empty
    if (valA === "" || valB === "" || valC === "") {
      continue;
    }

    // If all three match, we have a winner
    if (valA === valB && valB === valC) {
      roundWon = true;
      winningCombination = [a, b, c];
      break;
    }
  }

  // CASE 1: Winner Detected
  if (roundWon) {
    handleWin(winningCombination);
    return;
  }

  // CASE 2: Draw (All 9 cells filled, no winner)
  const isDraw = !boardState.includes("");
  if (isDraw) {
    handleDraw();
    return;
  }

  // CASE 3: Continue Game -> Switch Player Turn
  switchTurn();
}

/**
 * Handles win state: highlights winning cells, updates score & message.
 */
function handleWin(winningCombo) {
  isGameActive = false;

  // Highlight winning cells with glowing animation
  winningCombo.forEach((index) => {
    cells[index].classList.add("winning-cell");
  });

  // Update Score
  if (currentPlayer === "X") {
    scores.x++;
    scoreXElement.textContent = scores.x;
  } else {
    scores.o++;
    scoreOElement.textContent = scores.o;
  }

  // Update Status Banner
  statusMessage.className = `status-badge winner-${currentPlayer.toLowerCase()}`;
  statusMessage.innerHTML = `🎉 Player <span class="current-turn-indicator turn-${currentPlayer.toLowerCase()}">${currentPlayer}</span> Wins!`;
}

/**
 * Handles tie state: updates score & message.
 */
function handleDraw() {
  isGameActive = false;

  // Increment Tie Score
  scores.ties++;
  scoreTiesElement.textContent = scores.ties;

  // Update Status Banner
  statusMessage.className = "status-badge draw";
  statusMessage.innerHTML = "🤝 Game ended in a Draw!";
}

/**
 * Switches the active player from X to O or O to X.
 */
function switchTurn() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();
}

/**
 * Updates the turn indicator badge in the UI.
 */
function updateTurnDisplay() {
  statusMessage.className = "status-badge";
  statusMessage.innerHTML = `Player <span class="current-turn-indicator turn-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s Turn`;
}

/**
 * Restarts the board for a new round while keeping scores intact.
 */
function restartGame() {
  boardState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameActive = true;

  // Reset visual cells
  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.className = "cell";
    cell.setAttribute("aria-label", `Cell ${index + 1}`);
  });

  // Reset status display
  updateTurnDisplay();
}

/**
 * Resets all scores (X, O, Ties) and resets the board.
 */
function resetAllScores() {
  scores.x = 0;
  scores.o = 0;
  scores.ties = 0;

  scoreXElement.textContent = "0";
  scoreOElement.textContent = "0";
  scoreTiesElement.textContent = "0";

  restartGame();
}

// ==========================================
// 4. EVENT LISTENERS
// ==========================================

// Add click listeners to all 9 grid cells
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

// New Game button restarts the round
restartBtn.addEventListener("click", restartGame);

// Reset Scores button clears scoreboard and restarts round
resetScoresBtn.addEventListener("click", resetAllScores);

// Initialize Turn Display on initial load
updateTurnDisplay();
