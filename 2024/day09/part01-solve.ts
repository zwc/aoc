import { readFileSync } from 'fs';
import { compactAndChecksum } from './part01';

(async () => {
  const inputData = readFileSync('input.txt', 'utf8');
  const trimmedInput = inputData.trim();
  const result = await compactAndChecksum(trimmedInput);
  console.log(result);
})();