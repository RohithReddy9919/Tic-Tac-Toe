/**
 * Tic-Tac-Toe Backend Server
 * Simple and beginner-friendly REST API built with Express.js
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const gameRoutes = require("./routes/gameRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// Middleware
// ==========================================

// Enable CORS so frontend running on any port/origin can communicate with this API
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Serve static frontend files from Frontend/ directory
app.use(express.static(path.join(__dirname, "../Frontend")));

// ==========================================
// Routes
// ==========================================

// Mount game routes under /api/game
app.use("/api/game", gameRoutes);

// Health check endpoint for API status
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "Tic-Tac-Toe Backend API is running smoothly!",
    endpoints: {
      getGameState: "GET /api/game",
      makeMove: "POST /api/game/move",
      restartGame: "POST /api/game/restart",
      resetScores: "POST /api/game/reset-scores",
    },
  });
});

// Fallback to index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

// ==========================================
// Start Server
// ==========================================
app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`  🎮 Tic-Tac-Toe Game & API Server Running!`);
  console.log(`  👉 Open in Browser: http://localhost:${PORT}`);
  console.log(`  👉 API Base URL:    http://localhost:${PORT}/api/game`);
  console.log(`===========================================`);
});
