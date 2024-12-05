const fs = require('fs');
const highland = require('highland');

import { validateRules, findMiddlePage, reorderSequence } from './main.ts';

const [rulesBlock, inputBlock] = fs
  .readFileSync('input.txt', 'utf-8')
  .split('\n\n');

const rules = rulesBlock
  .split('\n')
  .map((rule) => rule.split('|').map(Number));

const input = inputBlock
  .split('\n')
  .map((line) => line.split(',').map(Number));

let sumMiddleValid = 0;
let sumMiddleReordered = 0;

highland(input)
  .filter(seq => validateRules(seq, rules))
  .map((sequence) => findMiddlePage(sequence))
  .reduce(0, (sum, middlePage) => sum + middlePage)
  .each((total) => {
    sumMiddleValid = total;
    console.log(`Sum of middle pages from valid sequences: ${sumMiddleValid}`);
  });

highland(input)
  .filter((sequence) => !validateRules(sequence, rules))
  .map((sequence) => reorderSequence(sequence, rules))
  .map((sequence) => findMiddlePage(sequence))
  .reduce(0, (sum, middlePage) => sum + middlePage)
  .each((total) => {
    sumMiddleReordered = total;
    console.log(
      `Sum of middle pages from reordered sequences: ${sumMiddleReordered}`
    );
  });
