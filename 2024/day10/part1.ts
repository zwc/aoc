import { readFileSync } from 'fs';
import * as R from 'ramda';

const parseInput = (input: string): number[][] =>
  input.trim().split('\n').map(line => line.split('').map(Number));

const getNeighbors = (grid: number[][], x: number, y: number): [number, number][] => {
  const deltas = [
    [0, 1],  // right
    [0, -1], // left
    [1, 0],  // down
    [-1, 0], // up
  ];

  return deltas
    .map(([dx, dy]) => [x + dx, y + dy])
    .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < grid.length && ny < grid[0].length);
};

const findReachableNines = (grid: number[][], startX: number, startY: number): Set<string> => {
  const stack: [number, number][] = [[startX, startY]];
  const visited = new Set<string>();
  const result = new Set<string>();

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const key = `${x},${y}`;

    if (visited.has(key)) continue;
    visited.add(key);

    const currentHeight = grid[x][y];
    if (currentHeight === 9) {
      result.add(key);
      continue;
    }

    const neighbors = getNeighbors(grid, x, y);
    for (const [nx, ny] of neighbors) {
      if (grid[nx][ny] === currentHeight + 1) {
        stack.push([nx, ny]);
      }
    }
  }

  return result;
};

const computeTrailheadScores = (grid: number[][]): number[] => {
  const trailheads: [number, number][] = [];
  grid.forEach((row, x) => {
    row.forEach((value, y) => {
      if (value === 0) {
        trailheads.push([x, y]);
      }
    });
  });
  return trailheads.map(([x, y]) => findReachableNines(grid, x, y).size);
};

export const sumTrailheadScores = (input: string): number => {
  const grid = parseInput(input);
  const scores = computeTrailheadScores(grid);
  return R.sum(scores);
};

// Example usage
const input = readFileSync('input.txt', 'utf8');
console.log(sumTrailheadScores(input)); // Output: 36