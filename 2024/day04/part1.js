const fs = require('fs');

const input = fs.readFileSync('./input.txt')
  .toString()
  .split('\n')
  .map(l => l.split(''));

const sizeX = input[0].length;
const sizeY = input.length;

function checkDirection(x, y, dirX, dirY) {
  const compare = 'XMAS';
  for(let l = 0; l < 4; l++) {
    const xCord = x + (dirX * l);
    const yCord = y + (dirY * l);
    if(xCord < 0 || yCord < 0) { return false };
    if(xCord > sizeX - 1 || yCord > sizeY - 1) { return false };
    const check = input[xCord][yCord];
    if(check !== compare[l]) {
      return false;
    }
  }
  return true;
}

const directions = [
  [0, 1],
  [0, 0],
  [0, -1],
  [1, 1],
  [1, 0],
  [1, -1],
  [-1, 1],
  [-1, 0],
  [-1, -1]
];

let hits = 0;
for(let x = 0; x < sizeX; x++) {
  for(let y = 0; y < sizeY; y++) {
    for(let d = 0; d < directions.length; d++) {
      if(checkDirection(x, y, directions[d][0], directions[d][1])) {
        hits++;
      }
    }
  }
}

console.log(hits);