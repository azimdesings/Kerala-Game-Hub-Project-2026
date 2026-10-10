
let currentPlayer = "X";
let gameOver = false;
let vsComputer = true;
let computerThinking = false;

const cells = document.querySelectorAll(".cell");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const resetBtn = document.getElementById("reset-btn");

const computerModeBtn = document.getElementById("computer-mode");
const twoPlayerModeBtn = document.getElementById("two-player-mode");

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Check winner
function checkWinner() {
    for (const [a, b, c] of winningCombinations) {
        if (
            cells[a].textContent !== "" &&
            cells[a].textContent === cells[b].textContent &&
            cells[b].textContent === cells[c].textContent
        ) {
            popupTitle.textContent = cells[a].textContent + " Wins!";
            popup.classList.add("show");
            gameOver = true;
            return true;
        }
    }

    return false;
}

// Check draw
function checkDraw() {
    if ([...cells].every(cell => cell.textContent !== "")) {
        popupTitle.textContent = "It's a Draw!";
        popup.classList.add("show");
        gameOver = true;
        return true;
    }

    return false;
}

// Minimax AI algorithm
function minimax(board, depth, isMaximizing) {
    for (const [a, b, c] of winningCombinations) {
        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            if (board[a] === "O") return 10 - depth;
            if (board[a] === "X") return depth - 10;
        }
    }

    if (board.every(cell => cell !== "")) return 0;

    if (isMaximizing) {
        let best = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                best = Math.max(
                    best,
                    minimax(board, depth + 1, false)
                );
                board[i] = "";
            }
        }

        return best;
    } else {
        let best = Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                best = Math.min(
                    best,
                    minimax(board, depth + 1, true)
                );
                board[i] = "";
            }
        }

        return best;
    }
}

// Find best computer move
function findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";

            let score = minimax(board, 0, false);

            // Occasionally choose a weaker move
            if (Math.random() < 0.3) {
                score += Math.random() * 5 - 10;
            }

            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

// Place a move
function makeMove(index, player) {
    if (gameOver || cells[index].textContent !== "") return;

    cells[index].textContent = player;

    if (checkWinner() || checkDraw()) return;

    currentPlayer = player === "X" ? "O" : "X";
}

// Computer plays
function computerMove() {
    if (gameOver || currentPlayer !== "O") {
        computerThinking = false;
        return;
    }

    const board = [...cells].map(cell => cell.textContent);
    let move;

    // 30% chance of a random move
    if (Math.random() < 0.3) {
        const emptyCells = board
            .map((value, index) => value === "" ? index : -1)
            .filter(index => index !== -1);

        move = emptyCells[
            Math.floor(Math.random() * emptyCells.length)
        ];
    } else {
        move = findBestMove(board);
    }

    if (move !== -1 && move !== undefined) {
        makeMove(move, "O");
    }

    computerThinking = false;
}

// Handle player clicks
cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
        if (gameOver || computerThinking || cell.textContent !== "") {
            return;
        }

        if (vsComputer && currentPlayer !== "X") return;

        makeMove(index, currentPlayer);

        if (vsComputer && !gameOver && currentPlayer === "O") {
            computerThinking = true;

            setTimeout(() => {
                computerMove();
            }, 600);
        }
    });
});

// Reset game
function resetGame() {
    cells.forEach(cell => {
        cell.textContent = "";
    });

    currentPlayer = "X";
    gameOver = false;
    computerThinking = false;

    popup.classList.remove("show");
}

// Reset button
resetBtn.addEventListener("click", resetGame);

// Computer mode button
computerModeBtn.addEventListener("click", () => {
    vsComputer = true;
    resetGame();
});

// Two-player mode button
twoPlayerModeBtn.addEventListener("click", () => {
    vsComputer = false;
    resetGame();
});
