import { parseInput, buildDisk, calculateChecksum } from './part01';

/**
 * Moves whole files from right to left:
 * - For each file in order of decreasing file ID:
 *   - Find a span of free space (contiguous nulls) to the left of the file that fits the entire file.
 *   - If found, move the file as a whole into that span.
 *   - If not found, leave it in place.
 */
function compactWholeFiles(disk: (number | null)[]): (number | null)[] {
  // Identify files and their positions
  // A file is identified by an ID. We'll find all distinct file IDs and their blocks.
  const fileIDs = Array.from(new Set(disk.filter(x => x !== null))) as number[];
  fileIDs.sort((a, b) => b - a); // sort descending by file ID

  // For each file from highest ID to lowest ID
  for (const fileID of fileIDs) {
    // Get all positions of this file
    const filePositions = disk
      .map((val, idx) => ({ val, idx }))
      .filter(item => item.val === fileID)
      .map(item => item.idx);

    if (filePositions.length === 0) continue; // no blocks found (shouldn't happen but just in case)

    const fileLength = filePositions.length;
    const fileStart = Math.min(...filePositions);
    const fileEnd = Math.max(...filePositions);

    // We need to find a contiguous free space that:
    // 1. Is large enough to fit the entire file (fileLength).
    // 2. Is located *entirely to the left* of fileStart.
    // We'll scan from the left to right, up to fileStart-1, looking for a run of `null` of length >= fileLength.

    // Collect runs of free spaces up to fileStart-1
    let bestStart = -1;
    let bestLength = 0;
    let currentStart = -1;
    let currentLength = 0;

    for (let i = 0; i < fileStart; i++) {
      if (disk[i] === null) {
        if (currentStart === -1) {
          currentStart = i;
          currentLength = 1;
        } else {
          currentLength++;
        }
      } else {
        if (currentLength >= fileLength) {
          // Found a suitable run
          bestStart = currentStart;
          bestLength = currentLength;
          break; // No need to search further; leftmost suitable run
        }
        // Reset
        currentStart = -1;
        currentLength = 0;
      }
    }
    // Check if the last run at the end of loop was big enough
    if (currentLength >= fileLength && bestStart === -1) {
      bestStart = currentStart;
      bestLength = currentLength;
    }

    // If no suitable free space found, continue
    if (bestStart === -1) {
      continue;
    }

    // Move the file into this space
    // First, clear the old file position
    for (const pos of filePositions) {
      disk[pos] = null;
    }

    // Place the file at bestStart
    for (let j = 0; j < fileLength; j++) {
      disk[bestStart + j] = fileID;
    }
  }

  return disk;
}

export function compactAndChecksumWholeFiles(diskMap: string): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      const segments = parseInput(diskMap);
      const initialDisk = buildDisk(segments);
      const finalDisk = compactWholeFiles(initialDisk);
      const checksum = calculateChecksum(finalDisk);
      resolve(checksum);
    } catch (err) {
      reject(err);
    }
  });
}
