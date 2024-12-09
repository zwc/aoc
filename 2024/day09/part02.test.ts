import { describe, it, expect } from "bun:test";
import { compactAndChecksumWholeFiles } from "./part02";

describe("Compact Whole Files and Calculate Checksum (Part 2)", () => {
  it("should return 2858 for the new method on input 2333133121414131402", async () => {
    // According to the puzzle, after applying the new whole-file compaction,
    // the checksum for the given example is 2858.
    const input = "2333133121414131402";
    const result = await compactAndChecksumWholeFiles(input);
    expect(result).toBe(2858);
  });
});