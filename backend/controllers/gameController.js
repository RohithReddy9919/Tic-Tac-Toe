/**
 * Game Controller
 * Handles in-memory Tic-Tac-Toe state, validation, and game rules.
 */

// All 8 possible winning combinations for a 3x3 grid
const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal from top-left
  [2, 4, 6], // Diagonal from top-right
];

// In-memory game state
let gameState = {
  board: ["", "", "", "", "", "", "", "", ""],
  currentPlayer: "X",
  isGameActive: true,
  winner: null,              // "X", "O", "Draw", or null
  winningCombination: null,  // Array of 3 indices, e.g. [0, 1, 2] or null
  scores: {
    x: 0,
    o: 0,
    ties: 0,
  },
  message: "Player X's Turn",
};

/**
 * Helper to check winning combination or draw on the board.
 */
function evaluateBoard(board) {
  // Check for a winning combination
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        winningCombination: [a, b, c],
      };
    }
  }

  // Check for a draw (board is full with no winner)
  const isFull = !board.includes("");
  if (isFull) {
    return {
      winner: "Draw",
      winningCombination: null,
    };
  }

  // Game continues
  return {
    winner: null,
    winningCombination: null,
  };
}

/**
 * GET /api/game
 * Returns the current game state and scores.
 */
exports.getGameState = (req, res) => {
  return res.status(200).json({
    success: true,
    data: gameState,
  });
};

/**
 * POST /api/game/move
 * Receives { index: 0-8 } to make a move on the board.
 */
exports.makeMove = (req, res) => {
  const { index, cellIndex } = req.body;
  const moveIndex = index !== undefined ? index : cellIndex;

  // Validation 1: Check if index is provided and is a valid integer between 0 and 8
  if (
    moveIndex === undefined ||
    moveIndex === null ||
    !Number.isInteger(Number(moveIndex)) ||
    Number(moveIndex) < 0 ||
    Number(moveIndex) > 8
  ) {
    return res.status(400).json({
      success: false,
      error: "Invalid move: 'index' must be an integer between 0 and 8.",
    });
  }

  const cellPos = Number(moveIndex);

  // Validation 2: Check if game is still active
  if (!gameState.isGameActive) {
    return res.status(400).json({
      success: false,
      error: "Game is already over. Please restart the game to play again.",
    });
  }

  // Validation 3: Check if the selected cell is already occupied
  if (gameState.board[cellPos] !== "") {
    return res.status(400).json({
      success: false,
      error: `Cell ${cellPos} is already occupied by '${gameState.board[cellPos]}'.`,
    });
  }

  // Apply the player's move
  gameState.board[cellPos] = gameState.currentPlayer;

  // Evaluate the board outcome
  const { winner, winningCombination } = evaluateBoard(gameState.board);

  if (winner === "X" || winner === "O") {
    // Winner found
    gameState.isGameActive = false;
    gameState.winner = winner;
    gameState.winningCombination = winningCombination;
    if (winner === "X") gameState.scores.x += 1;
    if (winner === "O") gameState.scores.o += 1;
    gameState.message = `Player ${winner} Wins!`;
  } else if (winner === "Draw") {
    // Draw / Tie
    gameState.isGameActive = false;
    gameState.winner = "Draw";
    gameState.winningCombination = null;
    gameState.scores.ties += 1;
    gameState.message = "Game ended in a Draw!";
  } else {
    // Game continues: switch active player
    gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
    gameState.message = `Player ${gameState.currentPlayer}'s Turn`;
  }

  return res.status(200).json({
    success: true,
    data: gameState,
  });
};

/**
 * POST /api/game/restart
 * Resets the 3x3 board and turns for a new round, preserving scores.
 */
exports.restartGame = (req, res) => {
  gameState.board = ["", "", "", "", "", "", "", "", ""];
  gameState.currentPlayer = "X";
  gameState.isGameActive = true;
  gameState.winner = null;
  gameState.winningCombination = null;
  gameState.message = "Player X's Turn";

  return res.status(200).json({
    success: true,
    data: gameState,
  });
};

/**
 * POST /api/game/reset-scores
 * Resets all scores (X, O, Ties) to 0 and starts a new round.
 */
exports.resetScores = (req, res) => {
  gameState.board = ["", "", "", "", "", "", "", "", ""];
  gameState.currentPlayer = "X";
  gameState.isGameActive = true;
  gameState.winner = null;
  gameState.winningCombination = null;
  gameState.scores = {
    x: 0,
    o: 0,
    ties: 0,
  };
  gameState.message = "Player X's Turn";

  return res.status(200).json({
    success: true,
    data: gameState,
  });
};
