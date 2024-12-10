import { describe, it, expect } from 'bun:test';
import { sumTrailheadRatings } from './part2';

describe('Hiking Trails Part 2', () => {
  it('Example 1: Single trailhead with rating 3', () => {
    const input = `
.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....
`;
    const result = sumTrailheadRatings(input);
    expect(result).toBe(3);
  });

  it('Example 2: Single trailhead with rating 13', () => {
    const input = `
..90..9
...1.98
...2..7
6543456
765.987
876....
987....
`;
    const result = sumTrailheadRatings(input);
    expect(result).toBe(13);
  });

  it('Example 3: Single trailhead with rating 227', () => {
    const input = `
012345
123456
234567
345678
4.6789
56789.
`;
    const result = sumTrailheadRatings(input);
    expect(result).toBe(227);
  });

  it('Example 4: Larger example with ratings sum of 81', () => {
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
    const result = sumTrailheadRatings(input);
    expect(result).toBe(81);
  });
});
