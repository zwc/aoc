import * as fs from 'fs';

interface Machine {
  aMoveX: number;
  aMoveY: number;
  bMoveX: number;
  bMoveY: number;
  prizeX: number;
  prizeY: number;
}

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

function findMinimumCostForMachine(machine: Machine, maxPresses = 100): number | null {
  const { aMoveX, aMoveY, bMoveX, bMoveY, prizeX, prizeY } = machine;
  
  let minCost: number | null = null;
  for (let aCount = 0; aCount <= maxPresses; aCount++) {
    for (let bCount = 0; bCount <= maxPresses; bCount++) {
      const xPos = aCount * aMoveX + bCount * bMoveX;
      const yPos = aCount * aMoveY + bCount * bMoveY;
      if (xPos === prizeX && yPos === prizeY) {
        const cost = aCount * 3 + bCount;
        if (minCost === null || cost < minCost) {
          minCost = cost;
        }
      }
    }
  }
  return minCost;
}

const data = fs.readFileSync('./input.txt', 'utf8');
const lines = data.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const machines: Machine[] = [];
for (let i = 0; i < lines.length; i += 3) {
  const lineA = parseLine(lines[i]);
  const lineB = parseLine(lines[i+1]);
  const lineP = parseLine(lines[i+2]);

  const aX = lineA.aX ?? 0;
  const aY = lineA.aY ?? 0;
  const bX = lineB.bX ?? 0;
  const bY = lineB.bY ?? 0;
  const pX = lineP.pX ?? 0;
  const pY = lineP.pY ?? 0;

  machines.push({ aMoveX: aX, aMoveY: aY, bMoveX: bX, bMoveY: bY, prizeX: pX, prizeY: pY });
}

const costs = machines.map(m => findMinimumCostForMachine(m, 100));
const solvableCosts = costs.filter(c => c !== null) as number[];
const totalCost = solvableCosts.reduce((sum, c) => sum + c, 0);

console.log(`${totalCost}`);