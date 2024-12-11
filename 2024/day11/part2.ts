import { readFileSync } from 'fs';
import { simulateBlinks } from './performance.ts';

const stones = readFileSync('./input.txt', 'utf8').split(' ').map(Number);
console.log(await simulateBlinks(stones, 75));
