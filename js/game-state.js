/* export GameState */
function GameState() {
  this.turn = 'wb';
  this.nextTurn = 'bw';
  this.turnNum = 1;
  this.seeingOptions = false;
  this.start = 0;

  this.check = false;
  this.checkmate = false;
  this.draw = false;

  this.whiteQueenCastle = false;
  this.whiteKingCastle = false;
  this.whiteKingMoved = false;
  this.whiteQueenRookMoved = false;
  this.whiteKingRookMoved = false;

  this.blackQueenCastle = false;
  this.blackKingCastle = false;
  this.blackKingMoved = false;
  this.blackQueenRookMoved = false;
  this.blackKingRookMoved = false;

  this.enPassantWhite = 0;
  this.enPasssantBlack = 0;
}

GameState.prototype.reset = function () {
  this.turn = 'wb';
  this.nextTurn = 'bw';
  this.turnNum = 1;
  this.seeingOptions = false;
  this.start = 0;

  this.check = false;
  this.checkmate = false;
  this.draw = false;

  this.whiteQueenCastle = false;
  this.whiteKingCastle = false;
  this.whiteKingMoved = false;
  this.whiteQueenRookMoved = false;
  this.whiteKingRookMoved = false;

  this.blackQueenCastle = false;
  this.blackKingCastle = false;
  this.blackKingMoved = false;
  this.blackQueenRookMoved = false;
  this.blackKingRookMoved = false;

  this.enPassantWhite = 0;
  this.enPasssantBlack = 0;
}

GameState.prototype.changeTurn = function () {
  if (this.turn === 'bw') {
    this.turnNum++;
    console.log('turnNum:', this.turnNum);
  }
  this.nextTurn = this.turn;
  this.turn = this.turn[1] + this.turn[0];
}
