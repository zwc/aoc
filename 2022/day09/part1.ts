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

let headX = 0;
let headY = 0;
let tailX = 0;
let tailY = 0;

const visited = new Set<string>();
visited.add(`${tailX},${tailY}`);

const moveTail = (): void => {
  const dx = headX - tailX;
  const dy = headY - tailY;

  // Check if tail needs to move
  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
    // Already close enough, do nothing
    return;
  }

  // If in the same row or column and distance is 2:
  if (headX === tailX && Math.abs(dy) >= 2) {
    // Move tail vertically closer by 1 step
    tailY += dy > 0 ? 1 : -1;
  } else if (headY === tailY && Math.abs(dx) >= 2) {
    // Move tail horizontally closer by 1 step
    tailX += dx > 0 ? 1 : -1;
  } else {
    // Move tail diagonally closer by 1 step
    tailX += dx > 0 ? 1 : -1;
    tailY += dy > 0 ? 1 : -1;
  }

  visited.add(`${tailX},${tailY}`);
};

const processInstruction = (instruction: Instruction): Highland.Stream<void> => {
  const { direction, steps } = instruction;
  const [dx, dy] = directionDeltas[direction];

  return Highland(R.range(0, steps))
    .map(() => {
      headX += dx;
      headY += dy;
      moveTail();
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
