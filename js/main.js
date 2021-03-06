/* global Coords */
const board = new Board();
const gamestate = new GameState();

const $board = document.querySelector('.board');

window.addEventListener('click', handleClick);
window.addEventListener('keydown', handlePromote);

updateHTMLBoard();

// Resetting/Displaying the Board & Utility Functions
function createHTMLBoard() {
  $board.innerHTML = '';
  $board.applyClassToTile = applyClassToTile;

  const coords = new Coords();

  let $row;
  for (let i = 0; i < coords.length; i++) {
    // create a new row div at the start of each row
    if (coords[i] % 10 === 1) {
      $row = document.createElement('div');
      $row.className = 'row board-row';
    }

    // append either a tile to the row
    const $tile = document.createElement('div');
    $tile.className = 'tile';
    $tile.id = coords[i];
    $row.append($tile);

    // append the row to the board at the end of each row
    if (coords[i] % 10 === 8) {
      $board.append($row);
    }
  }
}

function updateHTMLBoard() {
  createHTMLBoard();

  const coords = new Coords();
  for (let i = 0; i < coords.length; i++) {
    if (board[coords[i]]) {
      const row = Math.floor(coords[i] / 10) - 1;
      const col = Math.floor(coords[i] % 10) - 1;

      // append a div to display a chess piece
      const $piece = document.createElement('div');
      $piece.classList.add('chess-piece', board[coords[i]].player + board[coords[i]].piece);
      $board.children[row].children[col].append($piece);
    }
  }
}

function rowFromCoord(coord) {
  return Math.floor(coord / 10) - 1;
}

function colFromCoord(coord) {
  return Math.floor(coord % 10) - 1;
}

function applyClassToTile(coord, cssClass) {
  const row = rowFromCoord(coord);
  const col = colFromCoord(coord);
  this.children[row].children[col].classList.add(cssClass);
}

// Running Chess
function handlePromote(event) {
  if (!gamestate.promoting) {
    return;
  }

  const keyPress = event.key;
  if (keyPress === '1') {
    gamestate.promoting.piece = 'q';
  } else if (keyPress === '2') {
    gamestate.promoting.piece = 'b';
  } else if (keyPress === '3') {
    gamestate.promoting.piece = 'n';
  } else if (keyPress === '4') {
    gamestate.promoting.piece = 'r';
  } else {
    return;
  }
  gamestate.promoting = null;
  updateHTMLBoard();
}

function handleClick(event) {
  if (!event.target.closest('.tile')) {
    gamestate.seeingOptions = false;
    updateHTMLBoard();
    return;
  }
  const coord = parseInt(event.target.closest('.tile').id);

  if (gamestate.seeingOptions) {
    decideMove(coord);
  } else {
    showOptions(coord);
  }
}

function decideMove(end) {
  const row = rowFromCoord(end);
  const col = colFromCoord(end);
  if (!$board.children[row].children[col].matches('.highlight')) {
    gamestate.seeingOptions = false;
    updateHTMLBoard();
    return;
  }

  const {start} = gamestate;
  // update draw counter
  if (board[end].piece) {
    gamestate.pawnOrKillCounter = 0;
  } else if (board[start].piece === 'p') {
    gamestate.pawnOrKillCounter = 0;
  } else {
    gamestate.pawnOrKillCounter++;
  }

  // record en passant
  if (board[start].piece === 'p' && (20 < start && start < 29) && (40 < end && end < 49)) {
    gamestate.enPassantWhite = start;
  } else if (board[start].piece === 'p' && (70 < start && start < 79) && (50 < end && end < 59)) {
    gamestate.enPassantBlack = start;
  }

  // move piece
  board.movePiece(start, end);
  gamestate.seeingOptions = false;
  updateHTMLBoard();

  // apply scans
  pawnScan(board, gamestate);
  checkmateScan(board, gamestate);
  drawScan(board, gamestate);
  checkScan(board, gamestate);
  castleScan(board, gamestate);

  // change turn
  gamestate.changeTurn();
}

function showOptions(start) {
  if (board.isEmptyAt(start)) {
    return;
  }

  if (!isViableStart(start, gamestate.turn)) {
    return;
  }
  gamestate.start = start;

  // select piece
  $board.applyClassToTile(start, 'selected');
  gamestate.seeingOptions = true;

  // find all potential moves
  const potentialMoves = [];
  const moveSpace = board.findMoveSpace(gamestate.turn, start, false, gamestate);
  for (let i = 0; i < moveSpace.length; i++) {
    if (isViableMove(gamestate.turn, start, moveSpace[i])) {
      potentialMoves.push(moveSpace[i]);
    }
  }

  // highlight all potential moves
  for (let i = 0; i < potentialMoves.length; i++) {
    $board.applyClassToTile(potentialMoves[i], 'highlight');
  }
}

function isViableStart(start, turn) {
  if (board[start].player !== turn[0]) {
    return false;
  }

  // find move space of start
  const moveSpace = board.findMoveSpace(turn, start, false, gamestate);
  if (!moveSpace) {
    return false;
  }

  // is viable start if it has viable moves
  for (let i = 0; i < moveSpace.length; i++) {
    if (isViableMove(turn, start, moveSpace[i])) {
      return true;
    }
  }

  return false;

}

function isViableMove(turn, start, end) {
  const potentialBoard = {...board};
  Object.setPrototypeOf(potentialBoard, Board.prototype);
  potentialBoard.movePiece(start, end);
  const enemyMoveSpace = potentialBoard.findEnemyMoveSpace(turn, gamestate);

  // find ally king coord after move
  const coords = new Coords();
  let kingCoord;
  for (const coord of coords) {
    if (potentialBoard[coord].player === turn[0] && potentialBoard[coord].piece === 'k') {
      kingCoord = coord;
      break;
    }
  }

  // is not viable if king is in enemy move space
  for (let i = 0; i < enemyMoveSpace.length; i++) {
    if (kingCoord === enemyMoveSpace[i]) {
      return false;
    }
  }

  return true;
}

function checkmateScan(board, gamestate) {
  const enemyCoords = [];

  // find location of all enemies
  const coords = new Coords();
  for (const coord of coords) {
    if (board[coord]) {
      if (board[coord].player === gamestate.turn[1]) {
        enemyCoords.push(coord);
      }
    }
  }

  // return if there is no checkmate
  for (const enemyCoord of enemyCoords) {
    if (isViableStart(enemyCoord, gamestate.nextTurn)) {
      return;
    }
    // might need more code? line 735
  }

  // otherwise checkmate
  gamestate.checkmate = true;
  console.log('Checkmate!!');
}

function checkScan(board, gamestate) {
  if (gamestate.checkmate) {
    return;
  }

  const allyMoveSpace = board.findEnemyMoveSpace(gamestate.nextTurn, gamestate);

  // find enemy king coord after move
  const coords = new Coords();
  let kingCoord;
  for (const coord of coords) {
    if (board[coord].player === gamestate.turn[1] && board[coord].piece === 'k') {
      kingCoord = coord;
      break;
    }
  }

  // change gamestate if there is check
  gamestate.check[gamestate.turn] = false;
  if (allyMoveSpace.includes(kingCoord)) {
    gamestate.check[gamestate.nextTurn] = true;
    console.log('Check!');
    return;
  }

  // if there is no check
  console.log('no check');
}

function castleScan(board, gamestate) {
  // check if pieces have moved
  gamestate.checkIfMoved(board);

  for (const runway of ['wk', 'wq', 'bk', 'bq']) {
    // see if runway is clear
    const isOpen = board.isRunwayOpen(runway, gamestate);

    // change castling status when possible
    gamestate.updateCastling(runway, isOpen);
  }
}

function pawnScan(board, gamestate) {
  for (let i = 81; i < 89; i++) {
    if (board[i].piece === 'p') {
      gamestate.promoting = board[i];
      return;
    }
  }

  for (let i = 11; i < 19; i++) {
    if (board[i].piece === 'p') {
      gamestate.promoting = board[i];
      return;
    }
  }
}

function drawScan(board, gamestate) {
  gamestate.pastBoards.push(board.copy());
  const coords = new Coords();

  const {turn} = gamestate;
  // 50 move rule draw
  if (gamestate.pawnOrKillCounter === 100) {
    gamestate.drawCase = '50 move rule';
    gamestate.draw = true;
  }

  // statemate draw
  const enemyCoords = [];

  for (const coord of coords) {
    if (board.isEmptyAt(coord)) {
      continue;
    } else if (board[coord].player === turn[1]) {
      enemyCoords.push(coord);
    }
  }

  let enemyCanMove = false;
  for (const enemyCoord of enemyCoords) {
    const eachMoveSpace = board.findMoveSpace(turn[1] + turn[0], enemyCoord, false, gamestate);
    if (eachMoveSpace.length !== 0) {
      enemyCanMove = true;
      break;
    }
  }

  if (!enemyCanMove) {
    gamestate.drawCase = 'stalemate';
    gamestate.draw = true;
  }

  // threefold-repetition draw
  for (let i = 0; i < gamestate.pastBoards.length; i++) {
    let repeats = 1;
    const currentBoard = gamestate.pastBoards[i];
    // create a copy of pastBoards and remove the currentBoard from the copy
    const pastBoardsCopy = [...gamestate.pastBoards];
    pastBoardsCopy.splice(i, 1);
    // see if there are any repeats
    for (const otherBoard of pastBoardsCopy) {
      if (currentBoard === otherBoard) {
        repeats++;
      }
    }
    if (repeats > 2) {
      gamestate.drawCase = 'threefold repetition';
      gamestate.draw = true;
      break;
    }
  }

  // insufficient material draw
    // list all black and white squares
  const blackSquares = [];
  const whiteSquares = [];
  for (const coord of coords) {
    const tens = Math.floor(coord / 10);
    const ones = coord % 10;
    if ((tens % 2) === 0) {
      if ((ones % 2) === 0) {
        blackSquares.push(coord);
      } else {
        whiteSquares.push(coord);
      }
    } else {
      if ((ones % 2) === 0) {
        whiteSquares.push(coord);
      } else {
        blackSquares.push(coord);
      }
    }
  }
    // find remaining pieces
  const whitePieces = [];
  const blackPieces = [];
  for (const coord of coords) {
    if (board[coord].player === 'w') {
      whitePieces.push(board[coord].piece);
    } else if (board[coord].player === 'b') {
      blackPieces.push(board[coord].piece);
    }
  }
    // cases
  if (blackPieces.length === 1) {
    if (whitePieces.length === 1) {
      gamestate.drawCase = 'insufficient materials';
      gamestate.draw = true;
    } else if (whitePieces.length === 2) {
      if (whitePieces.includes('b') || whitePieces.includes('n')) {
        gamestate.drawCase = 'insufficient materials';
        gamestate.draw = true;
      }
    }
  } else if (whitePieces.length === 1) {
    if (blackPieces.length === 1) {
      gamestate.drawCase = 'insufficient materials';
      gamestate.draw = true;
    } else if (blackPieces.length === 2) {
      if (blackPieces.includes('b') || blackPieces.includes('n')) {
        gamestate.drawCase = 'insufficient materials';
        gamestate.draw = true;
      }
    }
  } else if (blackPieces.length === 2 && whitePieces.length === 2) {
    if (blackPieces.includes('b') && whitePieces.includes('b')) {
      const bishopCoords = [];
      for (const coord of coords) {
        if (board[coord].piece === 'b') {
          bishopCoords.push(coord);
        }
      }
      if (blackSquares.includes(bishopCoords[0]) && blackSquares.includes(bishopCoords[1])) {
        gamestate.drawCase = 'insufficient materials';
        gamestate.draw = true;
      } else if (whitePieces.includes(bishopCoords[0]) && whitePieces.includes(bishopCoords[1])) {
        gamestate.drawCase = 'insufficient materials';
        gamestate.draw = true;
      }
    }
  }
  if (gamestate.draw) {
    console.log(`Draw by ${gamestate.drawCase}`);
  }
}
