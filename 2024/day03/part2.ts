import { createReadStream } from 'node:fs';
import Highland from 'highland';

const regex = /(do\(\))|(don't\(\))|(mul\((?<a>\d{1,3}),((?<b>\d{1,3}))\))/g;

Highland(createReadStream('./input.txt', 'utf8'))
  .split() // Split input into lines
  .compact() // Remove empty lines
  .reduce({ p2: 0, count: true }, (state, line) => {
    for (const match of line.matchAll(regex)) {
      if (match[0] === 'do()') {
        state.count = true;
      } else if (match[0] === "don't()") {
        state.count = false;
      } else {
        const result = match.groups.a * match.groups.b;
        if (state.count) {
          state.p2 += result;
        }
      }
    }
    return state;
  })
  .tap(({ p2 }) => console.log(p2))
  .done(() => console.log('Done!'));