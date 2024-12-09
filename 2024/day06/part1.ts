const highland = require('highland');
const chalk = require('chalk');
const fs = require('fs');

const mapArray = fs.readFileSync('input.txt', 'utf8').split('\n').map(row => row.split(''));

const directions = ['^', '>', 'v', '<'];
const moves = { '^': [-1, 0], '>': [0, 1], 'v': [1, 0], '<': [0, -1] };
const VIEW_WIDTH = 200;
const VIEW_HEIGHT = 40;

const rateLimits = {
    '^': 15,
    'v': 15,
    '>': 30,
    '<': 30,
};

function findGuard(map) {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (directions.includes(map[row][col])) {
                return { row: row, col: col, direction: map[row][col] };
            }
        }
    }
    return null;
}

function moveGuard(map, guard) {
    const [rowChange, colChange] = moves[guard.direction];
    const nextRow = guard.row + rowChange;
    const nextCol = guard.col + colChange;
    if (nextRow < 0 || nextRow >= map.length || nextCol < 0 || nextCol >= map[0].length) {
        return { row: nextRow, col: nextCol, direction: guard.direction, exited: true };
    }
    if (map[nextRow][nextCol] !== '#') {
        return { row: nextRow, col: nextCol, direction: guard.direction, exited: false };
    } else {
        const currentDirectionIndex = directions.indexOf(guard.direction);
        const newDirection = directions[(currentDirectionIndex + 1) % directions.length];
        return { ...guard, direction: newDirection, exited: false };
    }
}

function printMap(map, steps, guard) {
    const resultMap = map.map(row => [...row]);
    steps.forEach(step => {
        resultMap[step.row][step.col] = chalk.yellow('*');
    });
    if (
        guard.row >= 0 &&
        guard.row < map.length &&
        guard.col >= 0 &&
        guard.col < map[0].length
    ) {
        resultMap[guard.row][guard.col] = chalk.green(guard.direction);
    }
    const startRow = Math.max(0, guard.row - Math.floor(VIEW_HEIGHT / 2));
    const endRow = Math.min(map.length, startRow + VIEW_HEIGHT);
    const startCol = Math.max(0, guard.col - Math.floor(VIEW_WIDTH / 2));
    const endCol = Math.min(map[0].length, startCol + VIEW_WIDTH);
    console.clear();
    for (let row = startRow; row < endRow; row++) {
        console.log(resultMap[row].slice(startCol, endCol).join(''));
    }
    console.log('\n');
}

function simulateGuard(map) {
    const guard = findGuard(map);
    if (!guard) {
        console.log("Guard not found.");
        return;
    }

    const visited = new Set();
    const steps = [];

    function executeStep(push, next) {
        if (guard.exited) {
            console.log(chalk.red(`Guard exited the map.`));
            console.log(chalk.cyan(`Distinct places visited: ${visited.size}`));
            push(null, highland.nil);
            return;
        }
        steps.push({ row: guard.row, col: guard.col });
        visited.add(`${guard.row},${guard.col}`);
        push(null, { map, steps: [...steps], guard: { ...guard } });
        const newGuard = moveGuard(map, guard);
        Object.assign(guard, newGuard);
        setTimeout(next, rateLimits[guard.direction]);
    }

    return highland((push, next) => executeStep(push, next))
        .each(({ map, steps, guard }) => printMap(map, steps, guard))
        .done(() => {
            console.log(chalk.blue("Simulation complete."));
        });
}

simulateGuard(mapArray);
