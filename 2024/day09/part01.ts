import Highland from 'highland';
import * as R from 'ramda';

type Segment = {
  id: number | null;
  type: 'file' | 'free';
  length: number;
};

export function parseInput(diskMap: string): Segment[] {
  const digits = R.map((ch: string) => parseInt(ch, 10), diskMap.split(''));
  const segments: Segment[] = [];
  let fileCount = 0;
  let i = 0;

  while (i < digits.length) {
    const fileLen = digits[i];
    i++;
    segments.push({ id: fileCount, type: 'file', length: fileLen });
    fileCount++;

    if (i < digits.length) {
      const freeLen = digits[i];
      i++;
      // Even zero-length free segment is allowed; it just adds no blocks
      if (freeLen > 0) {
        segments.push({ id: null, type: 'free', length: freeLen });
      }
    }
  }

  return segments;
}

export function buildDisk(segments: Segment[]): (number | null)[] {
  const toBlocks = (seg: Segment) =>
    seg.type === 'file' ? R.repeat(seg.id, seg.length) : R.repeat(null, seg.length);
  return R.chain(toBlocks, segments);
}

function hasGap(disk: (number | null)[]): boolean {
  const firstFileIndex = R.findIndex((val) => val !== null, disk);
  const lastFileIndex = R.findLastIndex((val) => val !== null, disk);

  if (firstFileIndex === -1 || lastFileIndex === -1) {
    // No files at all means no gaps.
    return false;
  }

  // Check if there's any null between the first and last file block
  const between = disk.slice(firstFileIndex, lastFileIndex + 1);
  return R.includes(null, between);
}

export function compactDisk(disk: (number | null)[]): (number | null)[] {
  while (hasGap(disk)) {
    const gapIndex = R.findIndex(R.equals(null), disk);
    const rightIndex = R.findLastIndex((val) => val !== null, disk);
    // Move one block from the end to the gap
    disk[gapIndex] = disk[rightIndex];
    disk[rightIndex] = null;
  }
  return disk;
}

export function calculateChecksum(disk: (number | null)[]): number {
  return R.addIndex(R.reduce)(
    (acc: number, val: number | null, idx: number) =>
      val === null ? acc : acc + idx * val,
    0,
    disk
  );
}

export function compactAndChecksum(diskMap: string): Promise<number> {
  return new Promise((resolve, reject) => {
    Highland([diskMap])
      .map(parseInput)
      .map(buildDisk)
      .map(compactDisk)
      .map(calculateChecksum)
      .errors((err) => reject(err))
      .toArray((res: number[]) => {
        resolve(res[0]);
      });
  });
}
