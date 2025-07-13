const board = document.getElementById("gameBoard");
const turnText = document.getElementById("turnIndicator");

let selected = null;
let turn = "w"; // w = white, b = black

// Unicode symbols for pieces
const pieces = {
  wP: "♙", wR: "♖", wN: "♘", wB: "♗", wQ: "♕", wK: "♔",
  bP: "♟", bR: "♜", bN: "♞", bB: "♝", bQ: "♛", bK: "♚"
};

// 8x8 board (row x col)
let boardState = [
  ["bR","bN","bB","bQ","bK","bB","bN","bR"],
  ["bP","bP","bP","bP","bP","bP","bP","bP"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["wP","wP","wP","wP","wP","wP","wP","wP"],
  ["wR","wN","wB","wQ","wK","wB","wN","wR"],
];

// Initialize board
function drawBoard() {
  board.innerHTML = "";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add((r + c) % 2 === 0 ? "white" : "black");
      square.dataset.row = r;
      square.dataset.col = c;

      const piece = boardState[r][c];
      if (piece) square.textContent = pieces[piece];

      square.addEventListener("click", handleClick);
      board.appendChild(square);
    }
  }
  updateTurnText();
}

// Handle piece selection / move
function handleClick(e) {
  const row = +e.target.dataset.row;
  const col = +e.target.dataset.col;
  const piece = boardState[row][col];

  clearHighlights();

  if (selected) {
    const [sr, sc] = selected;
    const movingPiece = boardState[sr][sc];

    // Prevent moving onto same-color piece
    if (piece && piece[0] === movingPiece[0]) {
      selected = [row, col];
      highlightSelected(row, col);
      highlightValidMoves(row, col);
      return;
    }

    const valid = getValidMoves(sr, sc);
    const isValid = valid.some(([r, c]) => r === row && c === col);

    if (isValid) {
      boardState[row][col] = movingPiece;
      boardState[sr][sc] = "";
      turn = turn === "w" ? "b" : "w";
      selected = null;
      drawBoard();
    } else {
      selected = null;
      drawBoard();
    }
  } else {
    if (piece && piece[0] === turn) {
      selected = [row, col];
      highlightSelected(row, col);
      highlightValidMoves(row, col);
    }
  }
}

function highlightSelected(r, c) {
  const index = r * 8 + c;
  board.children[index].classList.add("selected");
}

function highlightValidMoves(r, c) {
  const moves = getValidMoves(r, c);
  for (let [mr, mc] of moves) {
    const idx = mr * 8 + mc;
    board.children[idx].classList.add("valid-move");
  }
}

function clearHighlights() {
  for (let sq of board.children) {
    sq.classList.remove("selected", "valid-move");
  }
}

function updateTurnText() {
  turnText.textContent = `Turn: ${turn === "w" ? "White" : "Black"}`;
}

// Simple legal move generator (only for pawns, knights, kings, rooks)
function getValidMoves(r, c) {
  const piece = boardState[r][c];
  if (!piece) return [];

  const type = piece[1];
  const color = piece[0];
  const dir = color === "w" ? -1 : 1;
  const moves = [];

  const isEnemy = (r, c) => {
    const p = boardState[r]?.[c];
    return p && p[0] !== color;
  };

  if (type === "P") {
    if (!boardState[r + dir]?.[c]) moves.push([r + dir, c]);
    if (r === (color === "w" ? 6 : 1) && !boardState[r + dir * 2]?.[c]) {
      moves.push([r + dir * 2, c]);
    }
    if (isEnemy(r + dir, c - 1)) moves.push([r + dir, c - 1]);
    if (isEnemy(r + dir, c + 1)) moves.push([r + dir, c + 1]);
  }

  if (type === "N") {
    const knightMoves = [
      [r+2, c+1], [r+2, c-1], [r-2, c+1], [r-2, c-1],
      [r+1, c+2], [r+1, c-2], [r-1, c+2], [r-1, c-2]
    ];
    for (let [nr, nc] of knightMoves) {
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 &&
          (!boardState[nr][nc] || isEnemy(nr, nc))) {
        moves.push([nr, nc]);
      }
    }
  }

  if (type === "K") {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 &&
          (dr !== 0 || dc !== 0) &&
          (!boardState[nr][nc] || isEnemy(nr, nc))) {
            moves.push([nr, nc]);
        }
      }
    }
  }

  if (type === "R") {
    for (let [dr, dc] of [[1,0],[0,1],[-1,0],[0,-1]]) {
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (!boardState[nr][nc]) {
          moves.push([nr, nc]);
        } else {
          if (isEnemy(nr, nc)) moves.push([nr, nc]);
          break;
        }
        nr += dr;
        nc += dc;
      }
    }
  }

  return moves;
}

drawBoard();
