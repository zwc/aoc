import { parseInput, buildDisk, calculateChecksum } from './part01';

function compactWholeFiles(disk: (number | null)[]): (number | null)[] {
  const fileIDs = Array.from(new Set(disk.filter(x => x !== null))) as number[];
  fileIDs.sort((a, b) => b - a); // sort descending by file ID

  for (const fileID of fileIDs) {
    const filePositions = disk
      .map((val, idx) => ({ val, idx }))
      .filter(item => item.val === fileID)
      .map(item => item.idx);

    if (filePositions.length === 0) continue;

    const fileLength = filePositions.length;
    const fileStart = Math.min(...filePositions);

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
