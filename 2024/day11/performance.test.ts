import { describe, it, expect } from 'bun:test';
import { simulateBlinks } from './performance.ts';

describe('Pluto Stones Simulation', () => {
  it('should simulate 1 blink correctly', async () => {
    const initialStones = [125, 17];
    const blinks = 1;

    const count = await simulateBlinks(initialStones, blinks);
    expect(count).toBe(3); 
  });

  it('should simulate 3 blinks correctly', async () => {
    const initialStones = [125, 17];
    const blinks = 3;

    const count = await simulateBlinks(initialStones, blinks);
    expect(count).toBe(5);
  });

  it('should simulate 6 blinks correctly', async () => {
    const initialStones = [125, 17];
    const blinks = 6;

    const count = await simulateBlinks(initialStones, blinks);
    expect(count).toBe(22);
  });

  it('should simulate 25 blinks correctly', async () => {
    const initialStones = [125, 17];
    const blinks = 25;

    const count = await simulateBlinks(initialStones, blinks);
    expect(count).toBe(55312);
  });

  it('should simulate 75 blinks correctly', async () => {
    const initialStones = [125, 17];
    const blinks = 75;

    const count = await simulateBlinks(initialStones, blinks);
    expect(count).toBe(65601038650482);
  });
});