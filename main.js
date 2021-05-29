var board = createJSBoard();
var flags = resetFlags();

var $board = document.querySelector('.board');

$board.addEventListener('click', handleClickPiece);
$board.addEventListener('click', handleMove);

updateHTMLBoard();

// Resetting/Displaying the Board & Utility Functions
function createHTMLBoard() {
  $board.innerHTML = '';

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

  board.movePiece = function (start, end) {
    board[end] = board[start];
    board[start] = null;
    updateHTMLBoard();
  }

  return board;
}

function resetFlags() {
  var flags = {};
  flags.turn = 'wb';
  flags.nextTurn = 'bw';
  flags.selecting = false;
  flags.start = 0;

  flags.check = false;
  flags.checkmate = false;
  flags.draw = false;

  flags.whiteQueenCastle = false;
  flags.whiteKingCastle = false;
  flags.whiteKingMoved = false;
  flags.whiteQueenRookMoved = false;
  flags.whiteKingRookMoved = false;

  flags.blackQueenCastle = false;
  flags.blackKingCastle = false;
  flags.blackKingMoved = false;
  flags.blackQueenRookMoved = false;
  flags.blackKingRookMoved = false;

  flags.enPassantWhite = 0;
  flags.enPasssantBlack = 0;

  return flags;
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

// Running Chess
function handleClickPiece(event) {
  if (flags.selecting) {
    return;
  }

  if (!event.target.matches('.chess-piece')) {
    return;
  }

  var turnOfPiece = event.target.classList[1][0];
  if (turnOfPiece !== flags.turn[0]) {
    return;
  }

  flags.start = parseInt(event.target.closest('.tile').id);

  // highlight movespace of piece
  var moveSpace = findMoveSpace(flags.turn, flags.start, false);
  console.log(moveSpace);
  for (var i = 0; i < moveSpace.length; i++) {
    var row = Math.floor(moveSpace[i] / 10) - 1;
    var col = Math.floor(moveSpace[i] % 10) - 1;
    $board.children[row].children[col].classList.add('highlight');
  }

  // allow user to select location to move
  flags.selecting = true;
}

function handleMove(event) {
  if (!flags.selecting) {
    return;
  }
}

function findMoveSpace(turn, start, killsOnly) {
  // returns array of possible moves
  var piece = board[start][1];

  if (piece === 'p') {
    return pawnMoveSpace(turn, start, killsOnly);
  } else if (piece === 'r') {
    return rookMoveSpace(turn, start);
  } else if (piece === 'n') {
    return knightMoveSpace(turn, start);
  } else if (piece === 'b') {
    return bishopMoveSpace(turn, start);
  } else if (piece === 'q') {
    return queenMoveSpace(turn, start);
  } else if (piece === 'k') {
    return kingMoveSpace(turn, start, killsOnly);
  }
}

function rookMoveSpace(turn, start) {
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

function knightMoveSpace(turn, start) {
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

    for (var multiplier = 1; multiplier < 9; multiplier++) {
    }
  }
  return moveSpace;
}

function playChess() {
  board = createJSBoard();
  flags = resetFlags();


}
