const fs = require('fs');

const input = fs.readFileSync('./input.txt')
  .toString()
  .split('\n')
  .map(l => l.split(''));

const sizeX = input[0].length;
const sizeY = input.length;

// Check if it S + M or M + S
const checkXmas = (x, y, first, second) => {
  const firstX = x + first[0];
  const firstY = y + first[1];
  const secondX = x + second[0];
  const secondY = y + second[1];

  if (firstX < 0 || firstY < 0 || firstX >= sizeX || firstY >= sizeY) return false;
  if (secondX < 0 || secondY < 0 || secondX >= sizeX || secondY >= sizeY) return false;

  const firstLetter = input[firstY][firstX];
  const secondLetter = input[secondY][secondX];

  if (!((firstLetter === 'M' || firstLetter === 'S') &&
        (secondLetter === 'M' || secondLetter === 'S'))) return false;
  if (firstLetter === secondLetter) return false;

  return true;
};

let hits = 0;
for (let x = 0; x < sizeX; x++) {
  for (let y = 0; y < sizeY; y++) {
    if (input[y][x] === 'A') {
      const firstCross = checkXmas(x, y, [-1, -1], [1, 1]);
      const secondCross = checkXmas(x, y, [1, -1], [-1, 1]);
      if (firstCross && secondCross) hits++;
    }
  }
}

console.log(hits);