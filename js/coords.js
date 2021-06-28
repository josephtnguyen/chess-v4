/* export Coords */
function Coords() {
  const coords = [];
  for (let i = 10; i < 90; i += 10) {
    for (let j = 1; j < 9; j++) {
      coords.push(i + j);
    }
  }
  return coords;
}
