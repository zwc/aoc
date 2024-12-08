import { createReadStream } from 'bun:fs';
import H from 'highland'
import * as R from 'ramda'

const stream = H<string>(createReadStream('input.txt', 'utf8'));

type Antenna = { x: number; y: number; f: string };

const extractAntennaFromChar = (char: string, x: number, y: number): Antenna[] =>
  char === '.' ? [] : [{ x, y, f: char }];

const extractAntennasFromLine = (line: string, y: number): Antenna[] =>
  R.addIndex<string, Antenna[]>(R.chain)(
    (char: string, x: number) => extractAntennaFromChar(char, x, y),
    line.split('')
  );

const extractAntennasFromGrid = (lines: string[]): Antenna[] =>
  R.addIndex<string, Antenna[]>(R.chain)(
    (line: string, y: number) => extractAntennasFromLine(line, y),
    lines
  );

stream
  .split()
  .map(l => l.trim())
  .filter(l => l.length > 0)
  .collect()
  .map(lines => {
    const height = lines.length;
    const width = lines[0].length;

    const antennas = extractAntennasFromGrid(lines);
    const frequencies = R.uniq(R.pluck('f', antennas))

    const pairs = arr =>
      R.addIndex(R.chain)((a, i) => R.map(b => [a, b], arr.slice(i + 1)), arr)

    const inBounds = (X: number, Y: number) => X >= 0 && Y >= 0 && X < width && Y < height

    const antinodesForFreq = freq => {
      const filtered = R.filter(a => a.f === freq, antennas)
      return R.chain(([a1, a2]) => {
        const dx = a2.x - a1.x
        const dy = a2.y - a1.y
        return [[a1.x - dx, a1.y - dy], [a2.x + dx, a2.y + dy]]
      }, pairs(filtered))
    }

    const allAntinodes = R.chain(antinodesForFreq, frequencies)
    const valid = R.filter(([X, Y]) => inBounds(X, Y), allAntinodes)
    const unique = R.uniq(R.map(([X, Y]) => `${X},${Y}`, valid))
    return unique.length
  })
  .each(console.log)
