const { readFileSync } = require('fs');
const { findLowestScore } = require('./part1');

const input = readFileSync('input.txt', 'utf8').split('\n');
const result = findLowestScore(input);
console.log(result);