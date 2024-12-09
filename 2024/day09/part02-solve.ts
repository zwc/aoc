import { readFileSync } from 'fs';
import { compactAndChecksumWholeFiles } from './part02';

(async () => {
  const inputData = readFileSync('input.txt', 'utf8');
  const trimmedInput = inputData.trim();
  const result = await compactAndChecksumWholeFiles(trimmedInput);
  console.log(result);
})();