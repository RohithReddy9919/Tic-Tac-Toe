/**
 * Automated Test Suite for Tic-Tac-Toe Backend & Frontend Integration
 */

const http = require("http");

const BASE_URL = "http://localhost:5000";

function sendRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed, raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, body, raw: body });
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("🧪 TESTING FULL TIC-TAC-TOE APP (BACKEND + FRONTEND)");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Frontend Static HTML Serving
    const resRoot = await sendRequest("GET", "/");
    assert(
      resRoot.status === 200 && resRoot.raw.includes("<!DOCTYPE html>") && resRoot.raw.includes("Tic-Tac-Toe"),
      "1. GET / (Frontend HTML is served properly)"
    );

    // 2. Health Check API
    const resHealth = await sendRequest("GET", "/api/health");
    assert(resHealth.status === 200 && resHealth.body.status === "healthy", "2. GET /api/health (Health check API)");

    // 3. Reset scores and start fresh
    const resResetScores = await sendRequest("POST", "/api/game/reset-scores");
    assert(
      resResetScores.status === 200 &&
      resResetScores.body.data.scores.x === 0 &&
      resResetScores.body.data.board.every((c) => c === ""),
      "3. POST /api/game/reset-scores (Initialize fresh state)"
    );

    // 4. GET /api/game (Check initial state)
    const resState = await sendRequest("GET", "/api/game");
    assert(
      resState.status === 200 &&
      resState.body.data.currentPlayer === "X" &&
      resState.body.data.isGameActive === true,
      "4. GET /api/game (Verify initial game state)"
    );

    // 5. Move 1: Player X plays cell 0
    const resMove1 = await sendRequest("POST", "/api/game/move", { index: 0 });
    assert(
      resMove1.status === 200 &&
      resMove1.body.data.board[0] === "X" &&
      resMove1.body.data.currentPlayer === "O",
      "5. POST /api/game/move (Player X plays cell 0, turn switches to O)"
    );

    // 6. Move 2: Reject move on occupied cell 0
    const resOccupied = await sendRequest("POST", "/api/game/move", { index: 0 });
    assert(
      resOccupied.status === 400 &&
      resOccupied.body.success === false,
      "6. POST /api/game/move (Rejects move on already occupied cell)"
    );

    // 7. Move 3: Reject invalid index
    const resInvalidIndex = await sendRequest("POST", "/api/game/move", { index: 12 });
    assert(
      resInvalidIndex.status === 400 &&
      resInvalidIndex.body.success === false,
      "7. POST /api/game/move (Rejects invalid cell index)"
    );

    // 8. Player O plays cell 3
    const resMove2 = await sendRequest("POST", "/api/game/move", { index: 3 });
    assert(
      resMove2.status === 200 &&
      resMove2.body.data.board[3] === "O" &&
      resMove2.body.data.currentPlayer === "X",
      "8. POST /api/game/move (Player O plays cell 3)"
    );

    // 9. Play sequence: X->1, O->4, X->2 (Winning combo [0, 1, 2])
    await sendRequest("POST", "/api/game/move", { index: 1 });
    await sendRequest("POST", "/api/game/move", { index: 4 });
    const resWin = await sendRequest("POST", "/api/game/move", { index: 2 });
    assert(
      resWin.status === 200 &&
      resWin.body.data.winner === "X" &&
      resWin.body.data.isGameActive === false &&
      JSON.stringify(resWin.body.data.winningCombination) === JSON.stringify([0, 1, 2]) &&
      resWin.body.data.scores.x === 1,
      "9. POST /api/game/move (Detects win [0, 1, 2] & updates Player X score)"
    );

    // 10. Reject move after game ended
    const resPostWin = await sendRequest("POST", "/api/game/move", { index: 8 });
    assert(
      resPostWin.status === 400 &&
      resPostWin.body.success === false,
      "10. POST /api/game/move (Rejects moves after game ends)"
    );

    // 11. Restart game (Preserve scores)
    const resRestart = await sendRequest("POST", "/api/game/restart");
    assert(
      resRestart.status === 200 &&
      resRestart.body.data.board.every((c) => c === "") &&
      resRestart.body.data.isGameActive === true &&
      resRestart.body.data.currentPlayer === "X" &&
      resRestart.body.data.scores.x === 1,
      "11. POST /api/game/restart (Clears board for new round and preserves scores)"
    );

    console.log("==================================================");
    console.log(`📊 TEST RESULTS: ${passed} passed, ${failed} failed.`);
    console.log("==================================================");
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("❌ Test suite encountered an error:", err);
    process.exit(1);
  }
}

setTimeout(runTests, 1000);
