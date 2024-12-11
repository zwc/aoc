import { describe, it, expect } from 'bun:test';
import { simulateBlinks } from './solution.ts';

describe('Pluto Stones Simulation', () => {
  it('should simulate 1 blink correctly', async () => {
    const initialStones = [125, 17];
    const blinks = 1;

    const count = await simulateBlinks(initialStones, blinks);
    expect(count).toBe(3); // Total stones after 1 blink
  });

  it('should simulate 3 blinks correctly', async () => {
    const initialStones = [125, 17];
    const blinks = 3;

    const count = await simulateBlinks(initialStones, blinks);
    expect(count).toBe(5); // Total stones after 3 blinks
  });

  it('should simulate 6 blinks correctly', async () => {
    const initialStones = [125, 17];
    const blinks = 6;

    const count = await simulateBlinks(initialStones, blinks);
    expect(count).toBe(22); // Total stones after 6 blinks
  });

  it('should simulate 25 blinks correctly', async () => {
    const initialStones = [125, 17];
    const blinks = 25;

    const count = await simulateBlinks(initialStones, blinks);
    expect(count).toBe(55312); // Total stones after 25 blinks
  });
});