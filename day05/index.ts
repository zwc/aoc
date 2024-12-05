const fs = require('fs');
const highland = require('highland');

import { validateRules, findMiddlePage, reorderSequence } from './main.ts';

const [rulesBlock, inputBlock] = fs
  .readFileSync('input.txt', 'utf-8')
  .split('\n\n');

const rules = rulesBlock
  .split('\n')
  .map((rule: string) => rule.split('|').map(Number));

const input = inputBlock
  .split('\n')
  .map((line: string) => line.split(',').map(Number));

let sumMiddleValid = 0;
let sumMiddleReordered = 0;

highland(input)
  .filter((sequence: string[]) => validateRules(sequence, rules))
  .map((sequence: string[]) => findMiddlePage(sequence))
  .reduce(0, (sum: number, middlePage: number) => sum + middlePage)
  .each((total: number) => {
    sumMiddleValid = total;
    console.log(`Sum of middle pages from valid sequences: ${sumMiddleValid}`);
  });

highland(input)
  .filter((sequence: string[]) => !validateRules(sequence, rules))
  .map((sequence: string[]) => reorderSequence(sequence, rules))
  .map((sequence: string[]) => findMiddlePage(sequence))
  .reduce(0, (sum: number, middlePage: number) => sum + middlePage)
  .each((total: number) => {
    sumMiddleReordered = total;
    console.log(
      `Sum of middle pages from reordered sequences: ${sumMiddleReordered}`
    );
  });
