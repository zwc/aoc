import { createReadStream } from 'bun:fs';
import Highland from 'highland';

const match = /mul\(\d{1,3},\d{1,3}\)/g;

Highland(createReadStream('input.txt', 'utf8'))
  .split()
  .compact()
  .map(line => line.match(match))
  .filter(matches => matches !== null)
  .flatMap(matches => matches)
  .map(match => {
    const [, x, y] = match.match(/mul\((\d{1,3}),(\d{1,3})\)/);
    return [parseInt(x, 10), parseInt(y, 10)];
  })
  .reduce(0, (acc, [x, y]) => acc + x * y)
  .tap(console.log)
  .done(() => console.log('Done!'));