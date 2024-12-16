import { describe, expect, it } from "bun:test";
import { findBestPathTiles } from "./part2";

describe("Reindeer Maze Part 2", () => {
  it("calculates the number of tiles on the best path for example 1", () => {
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

    const result = findBestPathTiles(example1);
    expect(result).toBe(45);
  });

  it("calculates the number of tiles on the best path for example 2", () => {
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

    const result = findBestPathTiles(example2);
    expect(result).toBe(64);
  });
});
