const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

// Route: Get current game state
// Method: GET /api/game
router.get("/", gameController.getGameState);

// Route: Make a move
// Method: POST /api/game/move
router.post("/move", gameController.makeMove);

// Route: Restart current round (keeps scores)
// Method: POST /api/game/restart
router.post("/restart", gameController.restartGame);

// Route: Reset all scores and restart game
// Method: POST /api/game/reset-scores
router.post("/reset-scores", gameController.resetScores);

module.exports = router;
