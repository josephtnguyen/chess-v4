var board = createJSBoard();
var flags = resetFlags();

var $board = document.querySelector('.board');

updateHTMLBoard();

// Resetting/Displaying the Board & Utility Functions
function createHTMLBoard() {
  $board.innerHTML = '';

  var coords = coordsArray();
  var addBlackTile = true;

  for (var i = 0; i < coords.length; i++) {
    // create a new row div at the start of each row
    if (coords[i] % 10 === 1) {
      var $row = document.createElement('div');
      $row.className = 'row board-row';
    }

    // append either a black or white tile to the row
    var $tile = document.createElement('div');
    if (addBlackTile) {
      $tile.className = 'black-tile';
    } else {
      $tile.className = 'white-tile';
    }
    $row.append($tile);

    // append a div to display a chess piece
    var $piece = document.createElement('div');
    $piece.className = 'chess-piece'
    $tile.append($piece);

    // append the row to the board at the end of each row
    if (coords[i] % 10 === 8) {
      $board.append($row);
    } else {
      addBlackTile = !addBlackTile;
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
      $board.children[row].children[col].children[0].classList.add(board[coords[i]]);
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
      board[coords[i]] = 'k';
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
  flags.turn = 'w';
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

// Running Chess
function playChess() {
  board = createJSBoard();
  flags = resetFlags();


}
