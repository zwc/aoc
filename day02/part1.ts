import { createReadStream } from 'bun:fs';
import Highland from 'highland';

function isStrictlyMonotonic(array) {
  const { increasing, decreasing } = array.reduce((acc, curr, i) => {
      if (i === 0) return acc;
      if (curr === array[i - 1]) acc.valid = false;
      if (curr > array[i - 1]) acc.decreasing = false; 
      if (curr < array[i - 1]) acc.increasing = false;
      return acc;
  }, { increasing: true, decreasing: true, valid: true });

  return increasing || decreasing;
}

function hasValidDifferences(array) {
  if (array.length < 2) return true;

  return array.every((curr, i) => {
      if (i === 0) return true;
      const diff = Math.abs(curr - array[i - 1]);
      return diff >= 1 && diff <= 3;
  });
}

Highland(createReadStream('input.txt', 'utf8'))
  .split()
  .compact()
  .map(line => line.split(/\s+/).map(Number))
  .filter(isStrictlyMonotonic)
  .filter(hasValidDifferences)
  .reduce(0, (acc, _) => acc + 1)
  .each(count => console.log(`Number of safe instructions: ${count}`));

