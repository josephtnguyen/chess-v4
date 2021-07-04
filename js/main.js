/* global Coords */
let board = new Board();
const gamestate = resetGameState();

const $board = document.querySelector('.board');

document.addEventListener('click', handleClick);

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

function resetGameState() {
  const gamestate = {};
  gamestate.turn = 'wb';
  gamestate.nextTurn = 'bw';
  gamestate.seeingOptions = false;
  gamestate.start = 0;

  gamestate.check = false;
  gamestate.checkmate = false;
  gamestate.draw = false;

  gamestate.whiteQueenCastle = false;
  gamestate.whiteKingCastle = false;
  gamestate.whiteKingMoved = false;
  gamestate.whiteQueenRookMoved = false;
  gamestate.whiteKingRookMoved = false;

  gamestate.blackQueenCastle = false;
  gamestate.blackKingCastle = false;
  gamestate.blackKingMoved = false;
  gamestate.blackQueenRookMoved = false;
  gamestate.blackKingRookMoved = false;

  gamestate.enPassantWhite = 0;
  gamestate.enPasssantBlack = 0;

  return gamestate;
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

  // move piece
  board.movePiece(gamestate.start, end);
  gamestate.seeingOptions = false;
  updateHTMLBoard();

  // apply scans
  // pawnScan(); to be added
  checkmateScan();
  // drawScan(); to be added
  checkScan();
  // castleScan(); to be added

  // change turn
  gamestate.nextTurn = gamestate.turn;
  gamestate.turn = gamestate.turn[1] + gamestate.turn[0];
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
  const moveSpace = board.findMoveSpace(gamestate.turn, start, false);
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
  const moveSpace = board.findMoveSpace(turn, start, false);
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
  const enemyMoveSpace = potentialBoard.findEnemyMoveSpace(turn);

  // find ally king coord after move
  const coords = new Coords();
  let kingCoord;
  for (const coord of coords) {
    if (potentialBoard[coord].player === turn[0] && potentialBoard[coord].piece === 'k') {
      kingCoord = coord;
      console.log('found');
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

function checkmateScan() {
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
  console.log('Checkmate!');
}

function checkScan() {

}
