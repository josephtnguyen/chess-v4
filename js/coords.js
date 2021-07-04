/* export Coords */
function Coords() {
  this.coords = [];
  for (let i = 10; i < 90; i += 10) {
    for (let j = 1; j < 9; j++) {
      this.coords.push(i + j);
    }
  }
}

Coords.prototype.isACoord = function (number) {
  for (const coord of this.coords) {
    if (number === coord) {
      return true;
    }
  }
  return false;
}
