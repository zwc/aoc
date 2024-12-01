import { createReadStream } from 'bun:fs';
import Highland from 'highland';

type LineNumbers = [number, number];
type NumberArrays = [number[], number[]];

Highland(createReadStream('input.txt', 'utf8'))
  .split()
  .compact()
  .map((line: string): LineNumbers => line.split(/\s+/).map(Number) as LineNumbers)
  .reduce<NumberArrays>([[], []], ([left, right], [l, r]) => ([left.concat(l), right.concat(r)]))
  .map(([left, right]) => 
    left.reduce((similarityIndex, num) => similarityIndex + num * right.filter(r => r === num).length, 0)
  )
  .toCallback((err, result) => {
    if (err) return console.error("Error:", err);
    console.log("Total Distance:", result);
  });
