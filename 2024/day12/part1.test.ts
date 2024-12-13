import { readFileSync } from 'fs';
import { describe, it, expect } from 'bun:test';
import { calculateTotalPrice } from './part1';

describe('Garden Groups - Part 1', () => {
  it('First example', () => {
    const input = `
AAAA
BBCD
BBCC
EEEC
`;
    const result = calculateTotalPrice(input);
    expect(result).toBe(140);
  });

  it('Second example', () => {
    const input = `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
`;
    const result = calculateTotalPrice(input);
    expect(result).toBe(772);
  });

  it('Third example', () => {
    const input = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`;
    const expected = 1930;
    const result = calculateTotalPrice(input);
    expect(result).toBe(expected);
  });

  it('Puzzle input', () => {
    const input = readFileSync('./input.txt', 'utf-8').toString();
    const result = calculateTotalPrice(input);
    expect(result).toBe(1352976);
  });
});