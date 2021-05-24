var board = createJSBoard();
var flags = resetFlags();


createHTMLBoard();

function createHTMLBoard() {
  var $board = document.querySelector('.board');
  $board.innerHTML = '';

  var coords = coordsArray();
  var addBlackTile = true;

  for (var i = 0; i < coords.length; i++) {
    if (coords[i] % 10 === 1) {
      var $row = document.createElement('div');
      $row.className = 'row';
    }

    var $tile = document.createElement('div');
    if (addBlackTile) {
      $tile.className = 'black-tile';
    } else {
      $tile.className = 'white-tile';
    }
    $row.appendChild($tile);

    if (coords[i] % 10 === 8) {
      $board.appendChild($row);
    } else {
      addBlackTile = !addBlackTile;
    }
  }
  return $board;
}

function createJSBoard() {
  var coords = coordsArray();
  var board = {};
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

    if (10 < coords[i] && coords[i] < 29) {
      board[coords[i]] = 'w' + board[coords[i]];
    } else if (70 < coords[i] && coords[i] < 89) {
      board[coords[i]] = 'b' + board[coords[i]];
    }
  }

  return board;
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

function resetFlags() {
  var flags = {};
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
