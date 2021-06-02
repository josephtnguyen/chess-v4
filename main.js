var board = createJSBoard();
var gamestate = resetGamestate();

var $board = document.querySelector('.board');

document.addEventListener('click', handleClick);

updateHTMLBoard();

// Resetting/Displaying the Board & Utility Functions
function createHTMLBoard() {
  $board.innerHTML = '';
  $board.applyClassToTile = applyClassToTile;

  var coords = coordsArray();

  for (var i = 0; i < coords.length; i++) {
    // create a new row div at the start of each row
    if (coords[i] % 10 === 1) {
      var $row = document.createElement('div');
      $row.className = 'row board-row';
    }

    // append either a tile to the row
    var $tile = document.createElement('div');
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

  var coords = coordsArray();
  for (var i = 0; i < coords.length; i++) {
    if (board[coords[i]]) {
      var row = Math.floor(coords[i] / 10) - 1;
      var col = Math.floor(coords[i] % 10) - 1;

      // append a div to display a chess piece
      var $piece = document.createElement('div');
      $piece.classList.add('chess-piece', board[coords[i]]);
      $board.children[row].children[col].append($piece);
    }
  }
}

function createJSBoard() {
  var coords = coordsArray();
  var board = {};

  // add pieces to board
  for (var i = 0; i < coords.length; i++) {
    if ((20 < coords[i] && coords[i] < 29) || (70 < coords[i] && coords[i] < 79)) {
      board[coords[i]] = 'p';
    } else if (coords[i] === 11 || coords[i] === 18 || coords[i] === 81 || coords[i] === 88) {
      board[coords[i]] = 'r';
    } else if (coords[i] === 12 || coords[i] === 17 || coords[i] === 82 || coords[i] === 87) {
      board[coords[i]] = 'n';
    } else if (coords[i] === 13 || coords[i] === 16 || coords[i] === 83 || coords[i] === 86) {
      board[coords[i]] = 'b';
    } else if (coords[i] === 14 || coords[i] === 84) {
      board[coords[i]] = 'q';
    } else if (coords[i] === 15 || coords[i] === 85) {
      board[coords[i]] = 'k';
    } else {
      board[coords[i]] = null;
    }

    // assign color to pieces
    if (10 < coords[i] && coords[i] < 29) {
      board[coords[i]] = 'w' + board[coords[i]];
    } else if (70 < coords[i] && coords[i] < 89) {
      board[coords[i]] = 'b' + board[coords[i]];
    }
  }

  board.movePiece = movePiece;
  board.findMoveSpace = findMoveSpace;
  board.findEnemyMoveSpace = findEnemyMoveSpace;

  return board;
}

function resetGamestate() {
  var gamestate = {};
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

function coordsArray() {
  var coords = [];
  for (var i = 10; i < 90; i += 10) {
    for (var j = 1; j < 9; j++) {
      coords.push(i + j);
    }
  }
  return coords;
}

function notACoord(number) {
  var coords = coordsArray();
  for (var i = 0; i < coords.length; i++) {
    if (number === coords[i]) {
      return false;
    }
  }
  return true;
}

function rowFromCoord(coord) {
  return Math.floor(coord / 10) - 1;
}

function colFromCoord(coord) {
  return Math.floor(coord % 10) - 1;
}

function applyClassToTile(coord, cssClass) {
  var row = rowFromCoord(coord);
  var col = colFromCoord(coord);
  this.children[row].children[col].classList.add(cssClass);
}

// Running Chess
function handleClick(event) {
  if (!event.target.closest('.board')) {
    gamestate.seeingOptions = false;
    updateHTMLBoard();
    return;
  }
  var coord = parseInt(event.target.closest('.tile').id);

  if (gamestate.seeingOptions) {
    decideMove(coord);
  } else {
    showOptions(coord);
  }
}

function decideMove(end) {
  var row = rowFromCoord(end);
  var col = colFromCoord(end);
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
  if (!board[start]) {
    return;
  }

  if (!isViableStart(start, gamestate.turn)) {
    return;
  }
  gamestate.start = start;
  console.log('gamestate.start:', gamestate.start);

  // select piece
  $board.applyClassToTile(start, 'selected');
  gamestate.seeingOptions = true;

  // find all potential moves
  var potentialMoves = [];
  var moveSpace = board.findMoveSpace(gamestate.turn, start, false);
  for (var i = 0; i < moveSpace.length; i++) {
    if (isViableMove(gamestate.turn, start, moveSpace[i])) {
      potentialMoves.push(moveSpace[i]);
    }
  }

  // highlight all potential moves
  for (var i = 0; i < potentialMoves.length; i++) {
    $board.applyClassToTile(potentialMoves[i], 'highlight');
  }
}

function findMoveSpace(turn, start, killsOnly) {
  var piece = this[start][1];

  if (piece === 'p') {
    return pawnMoveSpace(this, turn, start, killsOnly);
  } else if (piece === 'r') {
    return rookMoveSpace(this, turn, start);
  } else if (piece === 'n') {
    return knightMoveSpace(this, turn, start);
  } else if (piece === 'b') {
    return bishopMoveSpace(this, turn, start);
  } else if (piece === 'q') {
    return queenMoveSpace(this, turn, start);
  } else if (piece === 'k') {
    return kingMoveSpace(this, turn, start, killsOnly);
  }
}

function pawnMoveSpace(board, turn, start, killsOnly) {
  var moveSpace = [];
  if (board[start][0] === 'w') {
    // starting moves
    if (!killsOnly) {
      if (!board[start + 10]) {
        moveSpace.push(start + 10);
      }
      if ((start < 30) && !board[start + 10] && !board[start + 20]) {
        moveSpace.push(start + 20);
      }
    }
    // attack moves
    var pawnMoves = [9, 11];
    for (var i = 0; i < pawnMoves.length; i++) {
      var newSpot = start + pawnMoves[i];
      if (notACoord(newSpot)) {
        continue;
      } else if (!board[newSpot]) {
        continue;
      } else if (board[newSpot][0] === turn[0]) {
        continue;
      } else if (board[newSpot][0] === turn[1]) {
        moveSpace.push(newSpot);
      }
    }
  } else if (board[start][0] === 'b') {
    // starting moves
    if (!killsOnly) {
      if (!board[start - 10]) {
        moveSpace.push(start - 10);
      }
      if ((start > 70) && !board[start - 10] && !board[start - 20]) {
        moveSpace.push(start - 20);
      }
    }
    // attack moves
    var pawnMoves = [-9, -11];
    for (var i = 0; i < pawnMoves.length; i++) {
      var newSpot = start + pawnMoves[i];
      if (notACoord(newSpot)) {
        continue;
      } else if (!board[newSpot]) {
        continue;
      } else if (board[newSpot][0] === turn[0]) {
        continue;
      } else if (board[newSpot][0] === turn[1]) {
        moveSpace.push(newSpot);
      }
    }
  }
  return moveSpace;
}

function rookMoveSpace(board, turn, start) {
  var moveSpace = [];
  var rookMoves = [1, -1, 10, -10];

  for (var i = 0; i < rookMoves.length; i++) {
    for (var multiplier = 1; multiplier < 9; multiplier++) {
      var newSpot = start + rookMoves[i] * multiplier;
      if (notACoord(newSpot)) {
        break;
      } else if (!board[newSpot]) {
        moveSpace.push(newSpot);
      } else if (board[newSpot][0] === turn[0]) {
        break;
      } else if (board[newSpot][0] === turn[1]) {
        moveSpace.push(newSpot);
        break;
      }
    }
  }
  return moveSpace;
}

function knightMoveSpace(board, turn, start) {
  var moveSpace = [];
  var knightMoves = [21, 12, -21, -12, 8, 19, -8, -19];

  for (var i = 0; i < knightMoves.length; i++) {
    var newSpot = start + knightMoves[i];
    if (notACoord(newSpot)) {
      continue;
    } else if (!board[newSpot]) {
      moveSpace.push(newSpot);
    } else if (board[newSpot][0] === turn[0]) {
      continue;
    } else if (board[newSpot][0] === turn[1]) {
      moveSpace.push(newSpot);
    }
  }
  return moveSpace;
}

function bishopMoveSpace(board, turn, start) {
  var moveSpace = [];
  var bishopMoves = [11, -11, 9, -9];

  for (var i = 0; i < bishopMoves.length; i++) {
    for (var multiplier = 1; multiplier < 9; multiplier++) {
      var newSpot = start + bishopMoves[i] * multiplier;
      if (notACoord(newSpot)) {
        break;
      } else if (!board[newSpot]) {
        moveSpace.push(newSpot);
      } else if (board[newSpot][0] === turn[0]) {
        break;
      } else if (board[newSpot][0] === turn[1]) {
        moveSpace.push(newSpot);
        break;
      }
    }
  }
  return moveSpace;
}

function queenMoveSpace(board, turn, start) {
  var moveSpace = [];
  var queenMoves = [1, -1, 10, -10, 11, -11, 9, -9];

  for (var i = 0; i < queenMoves.length; i++) {
    for (var multiplier = 1; multiplier < 9; multiplier++) {
      var newSpot = start + queenMoves[i] * multiplier;
      if (notACoord(newSpot)) {
        break;
      } else if (!board[newSpot]) {
        moveSpace.push(newSpot);
      } else if (board[newSpot][0] === turn[0]) {
        break;
      } else if (board[newSpot][0] === turn[1]) {
        moveSpace.push(newSpot);
        break;
      }
    }
  }
  return moveSpace;
}

function kingMoveSpace(board, turn, start, killsOnly) {
  var moveSpace = [];
  var kingMoves = [10, -10, 1, -1, 11, -11, 9, -9];

  for (var i = 0; i < kingMoves.length; i++) {
    var newSpot = start + kingMoves[i];
    if (notACoord(newSpot)) {
      continue;
    } else if (!board[newSpot]) {
      moveSpace.push(newSpot);
    } else if (board[newSpot][0] === turn[0]) {
      continue;
    } else if (board[newSpot][0] === turn[1]) {
      moveSpace.push(newSpot);
    }
  }
  return moveSpace;
}

function findEnemyMoveSpace(turn) {
  var enemyMoveSpace = new Set();
  var enemyCoord = [];
  var coords = coordsArray();

  // find location of all enemy pieces
  for (var i = 0; i < coords.length; i++) {
    if (!this[coords[i]]) {
      continue;
    } else if (this[coords[i]][0] === turn[1]) {
      enemyCoord.push(coords[i]);
    }
  }

  // union all move spaces of enemy pieces
  for (i = 0; i < enemyCoord.length; i++) {
    var eachMoveSpace = this.findMoveSpace(turn[1] + turn[0], enemyCoord[i], true);
    for (var j = 0; j < eachMoveSpace.length; j++) {
      enemyMoveSpace.add(eachMoveSpace[j]);
    }
  }
  return [...enemyMoveSpace];
}

function isViableStart(start, turn) {
  if (board[start][0] !== turn[0]) {
    return false;
  }

  // find move space of start
  var moveSpace = board.findMoveSpace(turn, start, false);
  if (!moveSpace) {
    return false;
  }

  // is viable start if it has viable moves
  for (var i = 0; i < moveSpace.length; i++) {
    if (isViableMove(turn, start, moveSpace[i])) {
      return true;
    }
  }

  return false;

}

function isViableMove(turn, start, end) {
  var potentialBoard = {...board};
  potentialBoard.movePiece(start, end);
  var enemyMoveSpace = potentialBoard.findEnemyMoveSpace(turn);

  // find ally king coord after move
  var coords = coordsArray();
  for (var i = 0; i < coords.length; i++) {
    if (potentialBoard[coords[i]] === turn[0] + 'k') {
      var kingCoord = coords[i];
      break;
    }
  }

  // is not viable if king is in enemy move space
  for (i = 0; i < enemyMoveSpace.length; i++) {
    if (kingCoord === enemyMoveSpace[i]) {
      return false;
    }
  }

  return true;
}

function movePiece(start, end) {
  this[end] = this[start];
  this[start] = null;
}

function checkmateScan() {
  var enemyCoords = [];

  // find location of all enemies
  var coords = coordsArray();
  for (var i = 0; i < coords.length; i++) {
    if (board[coords[i]]) {
      if (board[coords[i]][0] === gamestate.turn[1]) {
        enemyCoords.push(coords[i]);
      }
    }
  }

  // return if there is no checkmate
  for (i = 0; i < enemyCoords.length; i++) {
    if (isViableStart(enemyCoords[i], gamestate.nextTurn)) {
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
