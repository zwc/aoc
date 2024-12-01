import { createReadStream } from 'bun:fs';
import Highland from 'highland';

Highland(createReadStream('input.txt', 'utf8'))
  .split()
  .compact()
  .map(line => line.split(/\s+/).map(Number) as [number, number])
  .reduce<[number[], number[]]>(
    [[], []],
    ([left, right], [l, r]) => ([left.concat(l), right.concat(r)])
  )
  .map(([left, right]) => [left.sort((a, b) => a - b), right.sort((a, b) => a - b)])
  .map(([sortedLeft, sortedRight]) =>
    sortedLeft.reduce((total, left, i) => total + Math.abs(left - sortedRight[i]), 0)
  )
  .toCallback((err, distance) => {
    if (err) return console.error("Error:", err);
    console.log("Total Distance:", distance);
  });
