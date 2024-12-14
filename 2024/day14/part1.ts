import * as fs from 'fs';

interface Robot {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

const WIDTH = 101;
const HEIGHT = 103;
const TIME = 100;

const MIDDLE_X = Math.floor(WIDTH / 2);
const MIDDLE_Y = Math.floor(HEIGHT / 2);

const robots: Robot[] = [];

function modWrap(value: number, modulus: number): number {
    const result = value % modulus;
    return result < 0 ? result + modulus : result;
}

const lines = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');

for (const line of lines) {
    const match = line.match(/^p=(-?\d+),(-?\d+)\s+v=(-?\d+),(-?\d+)$/);
    if (!match) {
        continue;
    }
    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);
    const dx = parseInt(match[3], 10);
    const dy = parseInt(match[4], 10);

    robots.push({ x, y, dx, dy });
}

// After 100 seconds, update positions
for (const robot of robots) {
    const finalX = modWrap(robot.x + robot.dx * TIME, WIDTH);
    const finalY = modWrap(robot.y + robot.dy * TIME, HEIGHT);

    robot.x = finalX;
    robot.y = finalY;
}

let topLeftCount = 0;
let topRightCount = 0;
let bottomLeftCount = 0;
let bottomRightCount = 0;

for (const {x,y} of robots) {
    if (x === MIDDLE_X || y === MIDDLE_Y) {
        continue;
    }

    if (x < MIDDLE_X && y < MIDDLE_Y) {
        topLeftCount++;
    } else if (x > MIDDLE_X && y < MIDDLE_Y) {
        topRightCount++;
    } else if (x < MIDDLE_X && y > MIDDLE_Y) {
        bottomLeftCount++;
    } else if (x > MIDDLE_X && y > MIDDLE_Y) {
        bottomRightCount++;
    }
}

const safetyFactor = topLeftCount * topRightCount * bottomLeftCount * bottomRightCount;

console.log(safetyFactor);
