const fs = require('fs');
const highland = require("highland");

const rules = fs.readFileSync('rules.txt', 'utf-8')
  .split('\n')
  .map(rule => rule.split('|').map(Number));

const input = fs.readFileSync('input.txt', 'utf-8')
  .split('\n')
  .map(line => line.split(',').map(Number));

function validateRules(sequence) {
    const positions = {};
    sequence.forEach((num, index) => {
        positions[num] = index; // Only need the latest position
    });

    // Check all rules
    return rules.every(([a, b]) => {
        // Ignore the rule if either `a` or `b` is missing from the sequence
        if (!(a in positions) || !(b in positions)) return true;
        // Validate that `a` appears before `b`
        return positions[a] < positions[b];
    });
}

function reorderSequence(sequence) {
    const graph = new Map();
    const inDegree = new Map();

    sequence.forEach(page => {
        graph.set(page, []);
        inDegree.set(page, 0);
    });

    rules.forEach(([a, b]) => {
        if (sequence.includes(a) && sequence.includes(b)) {
            graph.get(a).push(b);
            inDegree.set(b, inDegree.get(b) + 1);
        }
    });

    const queue = Array.from(inDegree.entries())
        .filter(([_, degree]) => degree === 0)
        .map(([page]) => page);
    const sorted = [];

    while (queue.length) {
        const current = queue.shift();
        sorted.push(current);

        for (const neighbor of graph.get(current)) {
            inDegree.set(neighbor, inDegree.get(neighbor) - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        }
    }

    return sorted;
}

function findMiddlePage(sequence) {
    const middleIndex = Math.floor(sequence.length / 2);
    return sequence[middleIndex];
}

// Process input sequences
let sumMiddleValid = 0;
let sumMiddleReordered = 0;

highland(input)
  .fork()
  .filter(validateRules)
  .map(sequence => findMiddlePage(sequence))
  .reduce(0, (sum, middlePage) => sum + middlePage)
  .each(total => {
    sumMiddleValid = total;
    console.log(`Sum of middle pages from valid sequences: ${sumMiddleValid}`);
  });

highland(input)
  .filter(sequence => !validateRules(sequence))
  .map(sequence => reorderSequence(sequence))
  .map(sequence => findMiddlePage(sequence))
  .reduce(0, (sum, middlePage) => sum + middlePage)
  .each(total => {
    sumMiddleReordered = total;
    console.log(`Sum of middle pages from reordered sequences: ${sumMiddleReordered}`);
  });
