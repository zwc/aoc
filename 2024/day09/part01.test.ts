import { describe, it, expect } from "bun:test";
import { parseInput, buildDisk, compactDisk, compactAndChecksum } from "./part01";

describe("Compact Disk and Calculate Checksum", () => {
  it("should return 1928 for input 2333133121414131402", async () => {
    const input = "2333133121414131402";
    const result = await compactAndChecksum(input);
    expect(result).toBe(1928);
  });

  it("should match the individual blocks described by the puzzle for 2333133121414131402 before compaction", () => {
    const input = "2333133121414131402";
    const segments = parseInput(input);
    const initialDisk = buildDisk(segments);

    const expected = [
      0,0,
      null,null,null,
      1,1,1,
      null,null,null,
      2,
      null,null,null,
      3,3,3,
      null,
      4,4,
      null,
      5,5,5,5,
      null,
      6,6,6,6,
      null,
      7,7,7,
      null,
      8,8,8,8,
      9,9
    ];

    expect(initialDisk).toEqual(expected);
  });

  it("should correctly interpret the disk map '12345'", () => {
    const segments12345 = parseInput("12345");
    const disk12345 = buildDisk(segments12345);
    expect(disk12345).toEqual([
      0,
      null,null,
      1,1,1,
      null,null,null,null,
      2,2,2,2,2
    ]);
  });

  it("should correctly interpret the disk map '90909'", () => {
    const segments90909 = parseInput("90909");
    const disk90909 = buildDisk(segments90909);
    expect(disk90909.length).toBe(27);
    expect(disk90909.slice(0,9)).toEqual(Array(9).fill(0));
    expect(disk90909.slice(9,18)).toEqual(Array(9).fill(1));
    expect(disk90909.slice(18,27)).toEqual(Array(9).fill(2));
  });
});
