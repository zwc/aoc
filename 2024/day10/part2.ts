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

const countDistinctTrails = (grid: number[][], startX: number, startY: number): number => {
  const stack: [number, number, string][] = [[startX, startY, `${startX},${startY}`]];
  const trails = new Set<string>();

  while (stack.length > 0) {
    const [x, y, trail] = stack.pop()!;

    const currentHeight = grid[x][y];
    if (currentHeight === 9) {
      trails.add(trail);
      continue;
    }

    const neighbors = getNeighbors(grid, x, y);
    for (const [nx, ny] of neighbors) {
      if (grid[nx][ny] === currentHeight + 1) {
        stack.push([nx, ny, `${trail}->${nx},${ny}`]);
      }
    }
  }

  return trails.size;
};

const computeTrailheadRatings = (grid: number[][]): number[] => {
  const trailheads: [number, number][] = [];

  grid.forEach((row, x) => {
    row.forEach((value, y) => {
      if (value === 0) {
        trailheads.push([x, y]);
      }
    });
  });

  return trailheads.map(([x, y]) => countDistinctTrails(grid, x, y));
};

export const sumTrailheadRatings = (input: string): number => {
  const grid = parseInput(input);
  const ratings = computeTrailheadRatings(grid);
  return R.sum(ratings);
};

const input = readFileSync('./input.txt', 'utf8');
console.log(sumTrailheadRatings(input));