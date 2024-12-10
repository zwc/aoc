import { describe, it, expect } from 'bun:test';
import { sumTrailheadScores } from './part1';

describe('Hiking Trails', () => {
  it('Example 1: Simple 4x4 grid', () => {
    const input = `
0123
1234
8765
9876
`;
    const result = sumTrailheadScores(input);
    expect(result).toBe(1);
  });

  it('Example 2: Trailhead with 2 reachable 9s', () => {
    const input = `
...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9
`;
    const result = sumTrailheadScores(input);
    expect(result).toBe(2);
  });

  it('Example 3: Trailhead with a score of 4', () => {
    const input = `
..90..9
...1.98
...2..7
6543456
765.987
876....
987....
`;
    const result = sumTrailheadScores(input);
    expect(result).toBe(4);
  });

  it('Example 4: Larger example with multiple trailheads', () => {
    const input = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`;
    const result = sumTrailheadScores(input);
    expect(result).toBe(36);
  });
});
