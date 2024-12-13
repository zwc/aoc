import * as fs from 'fs';

interface Machine {
  aMoveX: number;
  aMoveY: number;
  bMoveX: number;
  bMoveY: number;
  prizeX: number;
  prizeY: number;
}

const OFFSET = 10000000000000;

function parseLine(line: string): {aX?: number, aY?: number, bX?: number, bY?: number, pX?: number, pY?: number} {
  if (line.startsWith("Button A:")) {
    const regex = /Button A:\s*X([\+\-]\d+),\s*Y([\+\-]\d+)/;
    const match = line.match(regex);
    if (match) {
      return { aX: parseInt(match[1], 10), aY: parseInt(match[2], 10) };
    }
  } else if (line.startsWith("Button B:")) {
    const regex = /Button B:\s*X([\+\-]\d+),\s*Y([\+\-]\d+)/;
    const match = line.match(regex);
    if (match) {
      return { bX: parseInt(match[1], 10), bY: parseInt(match[2], 10) };
    }
  } else if (line.startsWith("Prize:")) {
    const regex = /Prize:\s*X=(\d+),\s*Y=(\d+)/;
    const match = line.match(regex);
    if (match) {
      return { pX: parseInt(match[1], 10), pY: parseInt(match[2], 10) };
    }
  }

  return {};
}

function findMinimumCostForMachine(machine: Machine): number | null {
  const { aMoveX, aMoveY, bMoveX, bMoveY, prizeX, prizeY } = machine;

  const D = aMoveX * bMoveY - aMoveY * bMoveX;
  if (D === 0) {
    return null;
  }

  const A_num = (prizeX * bMoveY - prizeY * bMoveX);
  const B_num = (aMoveX * prizeY - aMoveY * prizeX);

  if (A_num % D !== 0 || B_num % D !== 0) {
    return null;
  }

  const A = A_num / D;
  const B = B_num / D;

  if (A < 0 || B < 0) {
    return null;
  }

  const cost = 3 * A + B;
  return cost;
}

const data = fs.readFileSync('./input.txt', 'utf8');
const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0);

if (lines.length % 3 !== 0) {
  console.error("Input format error: lines are not in multiples of three.");
  process.exit(1);
}

const machines: Machine[] = [];
for (let i = 0; i < lines.length; i += 3) {
  const lineA = parseLine(lines[i]);
  const lineB = parseLine(lines[i+1]);
  const lineP = parseLine(lines[i+2]);

  const aX = lineA.aX ?? 0;
  const aY = lineA.aY ?? 0;
  const bX = lineB.bX ?? 0;
  const bY = lineB.bY ?? 0;

  const pX = (lineP.pX ?? 0) + OFFSET;
  const pY = (lineP.pY ?? 0) + OFFSET;

  machines.push({ aMoveX: aX, aMoveY: aY, bMoveX: bX, bMoveY: bY, prizeX: pX, prizeY: pY });
}

const costs = machines.map(m => findMinimumCostForMachine(m));
const solvableCosts = costs.filter(c => c !== null) as number[];

const totalCost = solvableCosts.reduce((sum, c) => sum + c, 0);

console.log(`${totalCost}`);
