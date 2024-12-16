import { describe, it, expect, } from 'bun:test';
import { findLowestScore } from './part1.ts';

describe("Reindeer Maze", () => {
  const example1 = [
    "###############",
    "#.......#....E#",
    "#.#.###.#.###.#",
    "#.....#.#...#.#",
    "#.###.#####.#.#",
    "#.#.#.......#.#",
    "#.#.#####.###.#",
    "#...........#.#",
    "###.#.#####.#.#",
    "#...#.....#.#.#",
    "#.#.#.###.#.#.#",
    "#.....#...#.#.#",
    "#.###.#.#.#.#.#",
    "#S..#.....#...#",
    "###############",
  ];

  const example2 = [
    "#################",
    "#...#...#...#..E#",
    "#.#.#.#.#.#.#.#.#",
    "#.#.#.#...#...#.#",
    "#.#.#.#.###.#.#.#",
    "#...#.#.#.....#.#",
    "#.#.#.#.#.#####.#",
    "#.#...#.#.#.....#",
    "#.#.#####.#.###.#",
    "#.#.#.......#...#",
    "#.#.###.#####.###",
    "#.#.#...#.....#.#",
    "#.#.#.#####.###.#",
    "#.#.#.........#.#",
    "#.#.#.#########.#",
    "#S#.............#",
    "#################",
  ];

  it("calculates the lowest score for example 1", () => {
    const result = findLowestScore(example1);
    expect(result).toBe(7036); // Expected score for example 1
  });

  it("calculates the lowest score for example 2", () => {
    const result = findLowestScore(example2);
    expect(result).toBe(11048); // Expected score for example 2
  });

  it("handles small maze with simple path", () => {
    const simpleMaze = [
      "#####",
      "#S..E",
      "#####",
    ];
    const result = findLowestScore(simpleMaze);
    expect(result).toBe(3);
  });

  it("handles maze with dead ends", () => {
    const deadEndMaze = [
      "#####",
      "#S#.#",
      "#.#E#",
      "#...#",
      "#####",
    ];
    const result = findLowestScore(deadEndMaze);
    expect(result).toBe(3005); // Includes one turn
  });

  it("handles maze with no valid path", () => {
    const noPathMaze = [
      "#####",
      "#S#E#",
      "#####",
    ];
    const result = findLowestScore(noPathMaze);
    expect(result).toBe(Infinity); // No valid path
  });
});
