import * as fs from 'fs';

interface Robot {
    x: number;
    y: number;
    dx: number;
    dy: number;
}

const WIDTH = 101;
const HEIGHT = 103;
const TOTAL_TIME = 10000; // Simulate up to 10,000 seconds
const TARGET_STRING = 'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR'; // The Easter egg string

function modWrap(value: number, modulus: number): number {
    const result = value % modulus;
    return result < 0 ? result + modulus : result;
}

function parseInput(filePath: string): Robot[] {
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    const lines = content.split('\n');
    const robots: Robot[] = [];

    const regex = /^p=(-?\d+),(-?\d+)\s+v=(-?\d+),(-?\d+)$/;

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            const x = parseInt(match[1], 10);
            const y = parseInt(match[2], 10);
            const dx = parseInt(match[3], 10);
            const dy = parseInt(match[4], 10);
            robots.push({
                x: modWrap(x, WIDTH),
                y: modWrap(y, HEIGHT),
                dx,
                dy,
            });
        }
    }

    return robots;
}

function generateGrid(robots: Robot[]): string[] {
    const grid: string[][] = Array.from({ length: HEIGHT }, () => new Array<string>(WIDTH).fill('.'));

    for (const { x, y } of robots) {
        grid[y][x] = 'R';
    }

    return grid.map(row => row.join(''));
}

const robots = parseInput('./input.txt');

let easterEggFound = false;
let capturing = false;
let capturedGrids: { second: number; grid: string[] }[] = [];

for (let second = 1; second <= TOTAL_TIME; second++) {
    for (const robot of robots) {
        robot.x = modWrap(robot.x + robot.dx, WIDTH);
        robot.y = modWrap(robot.y + robot.dy, HEIGHT);
    }
    const grid = generateGrid(robots);

    if (!easterEggFound) {
        for (const line of grid) {
            if (line.includes(TARGET_STRING)) {
                console.log(`Easter Egg found at second ${second}:`);
                grid.forEach(line => console.log(line));
                easterEggFound = true;
                capturing = true;
                capturedGrids.push({ second, grid });
                break;
            }
        }
    } else if (capturing) {
        // Continue capturing grids until the target string is found again
        capturedGrids.push({ second, grid });
        for (const line of grid) {
            if (line.includes(TARGET_STRING)) {
                console.log(`Easter Egg sequence ended at second ${second}:`);
                capturedGrids.forEach(entry => {
                    console.log(`Second ${entry.second}`);
                    entry.grid.forEach(line => console.log(line));
                    console.log('');
                });
                capturing = false;
                break;
            }
        }
    }

    if (second % 1000 === 0) {
        console.log(`Processed second ${second}`);
    }

    if (!capturing && easterEggFound) {
        break;
    }
}
