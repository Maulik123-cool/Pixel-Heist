const boardElement = document.getElementById("chessboard");
const status = document.getElementById("status");

let turn = "w"; // 'w' or 'b'
let selected = null;

const pieces = {
  wP: "♙", wR: "♖", wN: "♘", wB: "♗", wQ: "♕", wK: "♔",
  bP: "♟", bR: "♜", bN: "♞", bB: "♝", bQ: "♛", bK: "♚"
};

let board = [
  ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
  ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
  ["",   "",   "",   "",   "",   "",   "",   ""],
  ["",   "",   "",   "",   "",   "",   "",   ""],
  ["",   "",   "",   "",   "",   "",   "",   ""],
  ["",   "",   "",   "",   "",   "",   "",   ""],
  ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
  ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
];

function drawBoard() {
  boardElement.innerHTML = "";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.className = "square " + ((row + col) % 2 === 0 ? "white" : "black");
      square.dataset.row = row;
      square.dataset.col = col;

      const piece = board[row][col];
      if (piece) square.textContent = pieces[piece];

      square.addEventListener("click", () => handleClick(row, col));
      boardElement.appendChild(square);
    }
  }
  status.textContent = `Turn: ${turn === "w" ? "White" : "Black"}`;
}

function handleClick(row, col) {
  const piece = board[row][col];

  if (selected) {
    const [fromRow, fromCol] = selected;
    const movingPiece = board[fromRow][fromCol];

    const legal = getLegalMoves(fromRow, fromCol);
    const isLegal = legal.some(pos => pos[0] === row && pos[1] === col);

    if (isLegal) {
      board[row][col] = movingPiece;
      board[fromRow][fromCol] = "";
      turn = turn === "w" ? "b" : "w";
    }

    selected = null;
    drawBoard();
  } else if (piece && piece[0] === turn) {
    selected = [row, col];
    drawBoard();
    highlight(row, col);
  }
}

function highlight(row, col) {
  const index = row * 8 + col;
  boardElement.children[index].classList.add("selected");

  const moves = getLegalMoves(row, col);
  for (let [r, c] of moves) {
    const idx = r * 8 + c;
    boardElement.children[idx].classList.add("valid");
  }
}

function getLegalMoves(r, c) {
  const piece = board[r][c];
  if (!piece) return [];

  const type = piece[1];
  const color = piece[0];
  const dir = color === "w" ? -1 : 1;
  const moves = [];

  const isEnemy = (r, c) => {
    const p = board[r]?.[c];
    return p && p[0] !== color;
  };

  if (type === "P") {
    if (!board[r + dir]?.[c]) moves.push([r + dir, c]);
    if ((r === 6 && color === "w") || (r === 1 && color === "b")) {
      if (!board[r + dir * 2]?.[c]) moves.push([r + dir * 2, c]);
    }
    if (isEnemy(r + dir, c - 1)) moves.push([r + dir, c - 1]);
    if (isEnemy(r + dir, c + 1)) moves.push([r + dir, c + 1]);
  }

  if (type === "R") {
    [[1,0],[0,1],[-1,0],[0,-1]].forEach(([dr, dc]) => {
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (!board[nr][nc]) moves.push([nr, nc]);
        else {
          if (isEnemy(nr, nc)) moves.push([nr, nc]);
          break;
        }
        nr += dr;
        nc += dc;
      }
    });
  }

  if (type === "N") {
    [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]].forEach(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!board[nr][nc] || isEnemy(nr, nc))) {
        moves.push([nr, nc]);
      }
    });
  }

  if (type === "K") {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!board[nr][nc] || isEnemy(nr, nc))) {
          moves.push([nr, nc]);
        }
      }
    }
  }

  if (type === "B" || type === "Q") {
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr, dc]) => {
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (!board[nr][nc]) moves.push([nr, nc]);
        else {
          if (isEnemy(nr, nc)) moves.push([nr, nc]);
          break;
        }
        nr += dr;
        nc += dc;
      }
    });
  }

  if (type === "Q") {
    return [...moves, ...getLegalMoves(r, c).filter(move => move.length)];
  }

  return moves;
}

drawBoard();
