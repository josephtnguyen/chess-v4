/* export GameState */
function GameState() {
  this.turn = 'wb';
  this.nextTurn = 'bw';
  this.turnNum = 1;
  this.seeingOptions = false;
  this.start = 0;

  this.check = {
    wb: false,
    bw: false
  };
  this.checkmate = false;

  this.whiteQueenCanCastle = false;
  this.whiteKingCanCastle = false;
  this.whiteKingMoved = false;
  this.whiteQueenRookMoved = false;
  this.whiteKingRookMoved = false;

  this.blackQueenCanCastle = false;
  this.blackKingCanCastle = false;
  this.blackKingMoved = false;
  this.blackQueenRookMoved = false;
  this.blackKingRookMoved = false;

  this.promoting = null;

  this.enPassantWhite = 0;
  this.enPasssantBlack = 0;

  this.draw = false;
  this.drawCase = null;
  this.pastBoards = [];
  this.pawnKingMoveCounter = 0;
}

GameState.prototype.reset = function () {
  this.turn = 'wb';
  this.nextTurn = 'bw';
  this.turnNum = 1;
  this.seeingOptions = false;
  this.start = 0;

  this.check = {
    wb: false,
    bw: false
  };
  this.checkmate = false;

  this.whiteQueenCanCastle = false;
  this.whiteKingCanCastle = false;
  this.whiteKingMoved = false;
  this.whiteQueenRookMoved = false;
  this.whiteKingRookMoved = false;

  this.blackQueenCanCastle = false;
  this.blackKingCanCastle = false;
  this.blackKingMoved = false;
  this.blackQueenRookMoved = false;
  this.blackKingRookMoved = false;

  this.promoting = null;

  this.enPassantWhite = 0;
  this.enPasssantBlack = 0;

  this.draw = false;
  this.drawCase = null;
  this.pastBoards = [];
  this.pawnKingMoveCounter = 0;
}

GameState.prototype.changeTurn = function () {
  if (this.turn === 'bw') {
    this.turnNum++;
    console.log('turnNum:', this.turnNum);
  }
  this.nextTurn = this.turn;
  this.turn = this.turn[1] + this.turn[0];
}

GameState.prototype.checkIfMoved = function (board) {
  const coords = [15, 85, 18, 11, 88, 81];
  const movedKeys = [
    'whiteKingMoved',
    'blackKingMoved',
    'whiteKingRookMoved',
    'whiteQueenRookMoved',
    'blackKingRookMoved',
    'blackQueenRookMoved'
  ];
  for (let i = 0; i < movedKeys.length; i++) {
    if (board.isEmptyAt(coords[i])) {
      gamestate[movedKeys[i]] = true;
    }
  }
}

GameState.prototype.updateCastling = function (runway, runwayOpen) {
  const turn =          runway[0] === 'w' ? 'wb' :
                        runway[0] === 'b' ? 'bw' :
                        null;
  const kingMovedKey =  runway[0] === 'w' ? 'whiteKingMoved' :
                        runway[0] === 'b' ? 'blackKingMoved' :
                        null;
  const rookMovedKey =  runway === 'wk' ? 'whiteKingRookMoved' :
                        runway === 'wq' ? 'whiteQueenRookMoved' :
                        runway === 'bk' ? 'blackKingRookMoved' :
                        runway === 'bq' ? 'blackQueenRookMoved' :
                        null;
  const canCastleKey =  runway === 'wk' ? 'whiteKingCanCastle' :
                        runway === 'wq' ? 'whiteQueenCanCastle' :
                        runway === 'bk' ? 'blackKingCanCastle' :
                        runway === 'bq' ? 'blackQueenCanCastle' :
                        null;

  if (runwayOpen && !this[kingMovedKey] && !this[rookMovedKey] && !this.check[turn]) {
    this[canCastleKey] = true;
  } else {
    this[canCastleKey] = false;
  }
}
