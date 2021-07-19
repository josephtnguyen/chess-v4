/* global Coords */
/* export Board */
function Board() {
  const coords = new Coords();

  // add pieces to board
  for (const coord of coords) {
    this.empty(coord);

    if ((20 < coord && coord < 29) || (70 < coord && coord < 79)) {
      this[coord].piece = 'p';
    } else if (coord === 11 || coord === 18 || coord === 81 || coord === 88) {
      this[coord].piece = 'r';
    } else if (coord === 12 || coord === 17 || coord === 82 || coord === 87) {
      this[coord].piece = 'n';
    } else if (coord === 13 || coord === 16 || coord === 83 || coord === 86) {
      this[coord].piece = 'b';
    } else if (coord === 14 || coord === 84) {
      this[coord].piece = 'q';
    } else if (coord === 15 || coord === 85) {
      this[coord].piece = 'k';
    } else {
      this[coord].piece = null;
    }

    // assign color to pieces
    if (10 < coord && coord < 29) {
      this[coord].player = 'w';
    } else if (70 < coord && coord < 89) {
      this[coord].player = 'b';
    } else {
      this[coord].player = null;
    }
  }
}

Board.prototype.reset = function () {
  const coords = new Coords();

  // add pieces to board
  for (const coord of coords) {
    this.empty(coord);

    if ((20 < coord && coord < 29) || (70 < coord && coord < 79)) {
      this[coord].piece = 'p';
    } else if (coord === 11 || coord === 18 || coord === 81 || coord === 88) {
      this[coord].piece = 'r';
    } else if (coord === 12 || coord === 17 || coord === 82 || coord === 87) {
      this[coord].piece = 'n';
    } else if (coord === 13 || coord === 16 || coord === 83 || coord === 86) {
      this[coord].piece = 'b';
    } else if (coord === 14 || coord === 84) {
      this[coord].piece = 'q';
    } else if (coord === 15 || coord === 85) {
      this[coord].piece = 'k';
    } else {
      this[coord].piece = null;
    }

    // assign color to pieces
    if (10 < coord && coord < 29) {
      this[coord].player = 'w';
    } else if (70 < coord && coord < 89) {
      this[coord].player = 'b';
    } else {
      this[coord].player = null;
    }
  }

  return this;
}

Board.prototype.empty = function (coord) {
  this[coord] = {
    piece: null,
    player: null
  };
}

Board.prototype.isEmptyAt = function (coord) {
  if (!this[coord].piece) {
    return true;
  } else {
    return false;
  }
}

Board.prototype.movePiece = function (start, end) {
  //castling
  if(board[start].piece === 'k') {
    if (start === 15 && end === 13) {
      this.movePiece(11, 14);
    } else if (start === 15 && end === 17) {
      this.movePiece(18, 16);
    } else if (start === 85 && end === 83) {
      this.movePiece(81, 84);
    } else if (start === 85 && end === 87) {
      this.movePiece(88, 86);
    }
  }

  // basic move piece
  this[end] = this[start];
  this.empty(start);
}

Board.prototype.findMoveSpace = function (turn, start, killsOnly, gamestate) {
  const piece = this[start].piece;

  if (piece === 'p') {
    return this.pawnMoveSpace(turn, start, killsOnly, gamestate);
  } else if (piece === 'r') {
    return this.rookMoveSpace(turn, start);
  } else if (piece === 'n') {
    return this.knightMoveSpace(turn, start);
  } else if (piece === 'b') {
    return this.bishopMoveSpace(turn, start);
  } else if (piece === 'q') {
    return this.queenMoveSpace(turn, start);
  } else if (piece === 'k') {
    return this.kingMoveSpace(turn, start, killsOnly, gamestate);
  }
}

Board.prototype.pawnMoveSpace = function (turn, start, killsOnly, gamestate) {
  // turn is 'wb' or 'bw' where turn[0] is the current turn
  const coords = new Coords();
  const moveSpace = [];

  if (this[start].player === 'w') {
    // starting moves
    if (!killsOnly) {
      if (!this[start + 10].piece) {
        moveSpace.push(start + 10);
      }
      if ((start < 30) && this.isEmptyAt(start + 10) && this.isEmptyAt(start + 20)) {
        moveSpace.push(start + 20);
      }
    }
    // attack moves
    const pawnMoves = [9, 11];
    for (const pawnMove of pawnMoves) {
      const newSpot = start + pawnMove;
      if (!coords.isCoord(newSpot)) {
        continue;
      } else if (this.isEmptyAt(newSpot)) {
        continue;
      } else if (this[newSpot].player === turn[0]) {
        continue;
      } else if (this[newSpot].player === turn[1]) {
        moveSpace.push(newSpot);
      }
    }
  } else if (this[start].player === 'b') {
    // starting moves
    if (!killsOnly) {
      if (!this[start - 10].piece) {
        moveSpace.push(start - 10);
      }
      if ((start > 70) && this.isEmptyAt(start - 10) && this.isEmptyAt(start - 20)) {
        moveSpace.push(start - 20);
      }
    }
    // attack moves
    const pawnMoves = [-9, -11];
    for (const pawnMove of pawnMoves) {
      const newSpot = start + pawnMove;
      if (!coords.isCoord(newSpot)) {
        continue;
      } else if (this.isEmptyAt(newSpot)) {
        continue;
      } else if (this[newSpot].player === turn[0]) {
        continue;
      } else if (this[newSpot].player === turn[1]) {
        moveSpace.push(newSpot);
      }
    }
  }
  return moveSpace;
}

Board.prototype.rookMoveSpace = function (turn, start) {
  const coords = new Coords();
  const moveSpace = [];

  const rookMoves = [1, -1, 10, -10];
  for (const rookmove of rookMoves) {
    for (let multiplier = 1; multiplier < 9; multiplier++) {
      const newSpot = start + rookmove * multiplier;
      if (!coords.isCoord(newSpot)) {
        break;
      } else if (this.isEmptyAt(newSpot)) {
        moveSpace.push(newSpot);
      } else if (this[newSpot].player === turn[0]) {
        break;
      } else if (this[newSpot].player === turn[1]) {
        moveSpace.push(newSpot);
        break;
      }
    }
  }
  return moveSpace;
}

Board.prototype.knightMoveSpace = function (turn, start) {
  const coords = new Coords();
  const moveSpace = [];

  const knightMoves = [21, 12, -21, -12, 8, 19, -8, -19];
  for (const knightMove of knightMoves) {
    const newSpot = start + knightMove;
    if (!coords.isCoord(newSpot)) {
      continue;
    } else if (this.isEmptyAt(newSpot)) {
      moveSpace.push(newSpot);
    } else if (this[newSpot].player === turn[0]) {
      continue;
    } else if (this[newSpot].player === turn[1]) {
      moveSpace.push(newSpot);
    }
  }
  return moveSpace;
}

Board.prototype.bishopMoveSpace = function (turn, start) {
  const coords = new Coords();
  const moveSpace = [];

  const bishopMoves = [11, -11, 9, -9];
  for (const bishopMove of bishopMoves) {
    for (let multiplier = 1; multiplier < 9; multiplier++) {
      const newSpot = start + bishopMove * multiplier;
      if (!coords.isCoord(newSpot)) {
        break;
      } else if (this.isEmptyAt(newSpot)) {
        moveSpace.push(newSpot);
      } else if (this[newSpot].player === turn[0]) {
        break;
      } else if (this[newSpot].player === turn[1]) {
        moveSpace.push(newSpot);
        break;
      }
    }
  }
  return moveSpace;
}

Board.prototype.queenMoveSpace = function (turn, start) {
  const coords = new Coords();
  const moveSpace = [];

  const queenMoves = [1, -1, 10, -10, 11, -11, 9, -9];
  for (const queenMove of queenMoves) {
    for (let multiplier = 1; multiplier < 9; multiplier++) {
      const newSpot = start + queenMove * multiplier;
      if (!coords.isCoord(newSpot)) {
        break;
      } else if (this.isEmptyAt(newSpot)) {
        moveSpace.push(newSpot);
      } else if (this[newSpot].player === turn[0]) {
        break;
      } else if (this[newSpot].player === turn[1]) {
        moveSpace.push(newSpot);
        break;
      }
    }
  }
  return moveSpace;
}

Board.prototype.kingMoveSpace = function (turn, start, killsOnly, gamestate) {
  const coords = new Coords();
  const moveSpace = [];
  const kingMoves = [10, -10, 1, -1, 11, -11, 9, -9];

  // normal moves
  for (const kingMove of kingMoves) {
    const newSpot = start + kingMove;
    if (!coords.isCoord(newSpot)) {
      continue;
    } else if (this.isEmptyAt(newSpot)) {
      moveSpace.push(newSpot);
    } else if (this[newSpot].player === turn[0]) {
      continue;
    } else if (this[newSpot].player === turn[1]) {
      moveSpace.push(newSpot);
    }
  }

  // castling
  if (!killsOnly) {
    const canCastleKeys = turn === 'wb'
      ? ['whiteKingCanCastle', 'whiteQueenCanCastle']
      : ['blackKingCanCastle', 'blackQueenCanCastle'];
    for (const canCastleKey of canCastleKeys) {
      if (gamestate[canCastleKey]) {
        if (canCastleKey === 'whiteKingCanCastle') {
          moveSpace.push(17);
        } else if (canCastleKey === 'whiteQueenCanCastle') {
          moveSpace.push(13);
        } else if (canCastleKey === 'blackKingCanCastle') {
          moveSpace.push(87);
        } else if (canCastleKey === 'blackQueenCanCastle') {
          moveSpace.push(83);
        }
      }
    }
  }
  return moveSpace;
}

Board.prototype.findEnemyMoveSpace = function (turn, gamestate) {
  const enemyMoveSpace = new Set();
  const enemyCoords = [];
  const coords = new Coords();

  // find location of all enemy pieces
  for (const coord of coords) {
    if (this.isEmptyAt(coord)) {
      continue;
    } else if (this[coord].player === turn[1]) {
      enemyCoords.push(coord);
    }
  }

  // union all move spaces of enemy pieces
  for (const enemyCoord of enemyCoords) {
    const eachMoveSpace = this.findMoveSpace(turn[1] + turn[0], enemyCoord, true, gamestate);
    for (const move of eachMoveSpace) {
      enemyMoveSpace.add(move);
    }
  }
  return [...enemyMoveSpace];
}

Board.prototype.isRunwayOpen = function (region, gamestate) {
  const enemyMoveSpace =  region[0] === 'w' ? this.findEnemyMoveSpace('wb', gamestate) :
                          region[0] === 'b' ? this.findEnemyMoveSpace('bw', gamestate) :
                          null;
  const runway =          region === 'wk' ? [16, 17] :
                          region === 'wq' ? [12, 13, 14] :
                          region === 'bk' ? [86, 87] :
                          region === 'bq' ? [82, 83, 84] :
                          null;
  const kingRunway =      region === 'wk' ? [16, 17] :
                          region === 'wq' ? [13, 14] :
                          region === 'bk' ? [86, 87] :
                          region === 'bq' ? [83, 84] :
                          null;

  for (const coord of runway) {
    if (!this.isEmptyAt(coord)) {
      return false;
    }
  }
  for (const coord of kingRunway) {
    if (enemyMoveSpace.includes(coord)) {
      return false;
    }
  }
  return true;
}
