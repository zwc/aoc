const fs = require('fs');

type Antenna = {
  x: number;
  y: number;
  frequency: string;
};

function parseMap(map: string): { antennas: Antenna[]; width: number; height: number } {
  const lines = map.trim().split('\n');
  const antennas: Antenna[] = [];
  const height = lines.length;
  const width = lines[0]?.length ?? 0;

  lines.forEach((line, y) => {
      line.split('').forEach((char, x) => {
          if (char !== '.') {
              antennas.push({ x, y, frequency: char });
          }
      });
  });

  return { antennas, width, height };
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
      const t = b;
      b = a % b;
      a = t;
  }
  return a;
}

function getLineRepresentation(x1: number, y1: number, x2: number, y2: number) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  const g = gcd(dx, dy);
  dx /= g;
  dy /= g;

  // Ensure canonical direction
  if (dx < 0 || (dx === 0 && dy < 0)) {
      dx = -dx;
      dy = -dy;
  }

  const lineConst = (-dy) * x1 + (dx) * y1;
  return { dx, dy, lineConst, anchor: { x: x1, y: y1 } };
}

function enumerateLinePoints(
  dx: number,
  dy: number,
  anchorX: number,
  anchorY: number,
  width: number,
  height: number
): { x: number; y: number }[] {
  const result: { x: number; y: number }[] = [];

  // Add the anchor itself
  if (anchorX >= 0 && anchorX < width && anchorY >= 0 && anchorY < height) {
      result.push({ x: anchorX, y: anchorY });
  }

  // Move forward in direction (dx, dy)
  let currX = anchorX + dx;
  let currY = anchorY + dy;
  while (currX >= 0 && currX < width && currY >= 0 && currY < height) {
      result.push({ x: currX, y: currY });
      currX += dx;
      currY += dy;
  }

  // Move backward in direction (-dx, -dy)
  currX = anchorX - dx;
  currY = anchorY - dy;
  while (currX >= 0 && currX < width && currY >= 0 && currY < height) {
      result.push({ x: currX, y: currY });
      currX -= dx;
      currY -= dy;
  }

  return result;
}

function computeUniqueAntinodesWithHarmonics(input: string): number {
  const { antennas, width, height } = parseMap(input);

  const frequencies = Array.from(new Set(antennas.map(a => a.frequency)));

  const globalAntinodeSet = new Set<string>();

  for (const freq of frequencies) {
      const freqAntennas = antennas.filter(a => a.frequency === freq);
      if (freqAntennas.length < 2) {
          // Less than 2 antennas of this frequency means no line can be formed
          continue;
      }

      const lineMap = new Map<string, { dx: number; dy: number; lineConst: number; anchor: { x: number; y: number } }>();

      // Identify all unique lines for this frequency
      for (let i = 0; i < freqAntennas.length; i++) {
          for (let j = i + 1; j < freqAntennas.length; j++) {
              const a1 = freqAntennas[i];
              const a2 = freqAntennas[j];
              const { dx, dy, lineConst, anchor } = getLineRepresentation(a1.x, a1.y, a2.x, a2.y);
              const lineKey = `${dx},${dy},${lineConst}`;

              if (!lineMap.has(lineKey)) {
                  lineMap.set(lineKey, { dx, dy, lineConst, anchor });
              }
          }
      }

      // Enumerate all points on each unique line and add to the global set
      for (const { dx, dy, anchor } of lineMap.values()) {
          const pointsOnLine = enumerateLinePoints(dx, dy, anchor.x, anchor.y, width, height);
          for (const p of pointsOnLine) {
              globalAntinodeSet.add(`${p.x},${p.y}`);
          }
      }
  }

  return globalAntinodeSet.size;
}

const input = fs.readFileSync('input.txt', 'utf8');

const result = computeUniqueAntinodesWithHarmonics(input);
console.log('Number of unique antinode locations with harmonics:', result);
