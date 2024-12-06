const highland = require('highland');
const chalk = require('chalk');
const fs = require('fs');

const mapArray = fs.readFileSync('input.txt', 'utf8').split('\n').map(row => row.split(''));

const directions = ['^', '>', 'v', '<'];
const moves = { '^': [-1, 0], '>': [0, 1], 'v': [1, 0], '<': [0, -1] };

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

function detectLoops(map) {
    const guard = findGuard(map);
    if (!guard) {
        console.log("Guard not found.");
        return;
    }

    const loopPositions = new Set();

    function causesLoop(map, obstructionRow, obstructionCol) {
        const testMap = map.map(row => [...row]);
        testMap[obstructionRow][obstructionCol] = '#';

        const guardState = { ...guard };
        const visitedStates = new Set();

        while (true) {
            const stateKey = `${guardState.row},${guardState.col},${guardState.direction}`;
            if (visitedStates.has(stateKey)) {
                return true;
            }
            visitedStates.add(stateKey);

            const nextMove = moveGuard(testMap, guardState);
            if (nextMove.exited) {
                return false;
            }
            Object.assign(guardState, nextMove);
        }
    }

    const guardPath = [];
    const guardState = { ...guard };

    while (true) {
        if (guardState.exited) break;
        guardPath.push({ row: guardState.row, col: guardState.col });
        const nextMove = moveGuard(map, guardState);
        Object.assign(guardState, nextMove);
    }

    guardPath.forEach(({ row, col }) => {
        if (map[row][col] !== '#' && causesLoop(map, row, col)) {
            loopPositions.add(`${row},${col}`);
        }
    });

    const resultMap = map.map(row => [...row]);
    loopPositions.forEach(pos => {
        const [row, col] = pos.split(',').map(Number);
        resultMap[row][col] = chalk.red('O');
    });

    console.clear();
    resultMap.forEach(row => console.log(row.join('')));
    console.log(chalk.green(`Total loops detected: ${loopPositions.size}`));
}

detectLoops(mapArray);
