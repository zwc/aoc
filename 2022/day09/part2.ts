import { createReadStream } from 'fs';
import Highland from 'highland';
import * as R from 'ramda';

interface Instruction {
  direction: 'R' | 'L' | 'U' | 'D';
  steps: number;
}

const parseLine = (line: string): Instruction => {
  const [dir, stepsStr] = line.trim().split(' ');
  return {
    direction: dir as Instruction['direction'],
    steps: parseInt(stepsStr, 10),
  };
};

const directionDeltas: Record<Instruction['direction'], [number, number]> = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, -1],
  D: [0, 1],
};

const ropeLength = 10;
const knotPositions = R.repeat<[number, number]>([0, 0], ropeLength);

// Track visited positions of the tail
const visited = new Set<string>();
visited.add(`${knotPositions[ropeLength - 1][0]},${knotPositions[ropeLength - 1][1]}`);

const moveKnot = (front: [number, number], back: [number, number]): [number, number] => {
  const [fx, fy] = front;
  const [bx, by] = back;
  const dx = fx - bx;
  const dy = fy - by;
  
  // If adjacent or overlapping, no move needed
  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
    return [bx, by];
  }

  // Move in a straight line if aligned and distance is >=2, otherwise diagonally
  let newX = bx;
  let newY = by;

  if (fx === bx && Math.abs(dy) >= 2) {
    // Same column, move vertically
    newY += (dy > 0) ? 1 : -1;
  } else if (fy === by && Math.abs(dx) >= 2) {
    // Same row, move horizontally
    newX += (dx > 0) ? 1 : -1;
  } else {
    // Move diagonally closer
    newX += (dx > 0) ? 1 : -1;
    newY += (dy > 0) ? 1 : -1;
  }

  return [newX, newY];
};

const processInstruction = (instruction: Instruction): Highland.Stream<void> => {
  const { direction, steps } = instruction;
  const [dx, dy] = directionDeltas[direction];

  return Highland(R.range(0, steps)).map(() => {
    // Move the head
    knotPositions[0] = [knotPositions[0][0] + dx, knotPositions[0][1] + dy];

    // Now move each subsequent knot
    for (let i = 1; i < ropeLength; i++) {
      knotPositions[i] = moveKnot(knotPositions[i - 1], knotPositions[i]);
    }

    // Record the tail position
    const tail = knotPositions[ropeLength - 1];
    visited.add(`${tail[0]},${tail[1]}`);
  });
};

Highland(createReadStream('input.txt'))
  .split()
  .compact()
  .map(parseLine)
  .flatMap(processInstruction)
  .done(() => {
    console.log(visited.size);
  });
