const { readFileSync } = require('fs');
const { findBestPathTiles } = require('./part2');

const input = readFileSync('input.txt', 'utf8').split('\n');
const result = findBestPathTiles(input);
console.log(result);