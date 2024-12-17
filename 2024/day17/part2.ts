import { readFileSync } from "fs";

let A = 0n;
let B = 0n;
let C = 0n;
let program: number[] = [];

const input = readFileSync("input.txt", "utf8");
const lines = input.split("\n").map(line => line.trim()).filter(line => line.length > 0);

for (const line of lines) {
    if (line.startsWith("Register A:")) {
        A = BigInt(parseInt(line.split(":")[1].trim(), 10));
    } else if (line.startsWith("Register B:")) {
        B = BigInt(parseInt(line.split(":")[1].trim(), 10));
    } else if (line.startsWith("Register C:")) {
        C = BigInt(parseInt(line.split(":")[1].trim(), 10));
    } else if (line.startsWith("Program:")) {
        const programPart = line.split(":")[1].trim();
        program = programPart.split(",").map(s => parseInt(s.trim(), 10));
    }
}

const expected = program.map(n => BigInt(n));

function runProgram(initialA: bigint, initialB: bigint, initialC: bigint, prog: number[], maxOutputLength?: number): bigint[] {
    let A = initialA;
    let B = initialB;
    let C = initialC;

    let ip = 0;
    const outputs: bigint[] = [];

    function comboValue(op: number): bigint {
        switch (op) {
            case 0: case 1: case 2: case 3:
                return BigInt(op);
            case 4:
                return A;
            case 5:
                return B;
            case 6:
                return C;
            default:
                throw new Error("Invalid combo operand 7 encountered.");
        }
    }

    function twoPower(power: bigint): bigint {
        return 2n ** power; // BigInt exponentiation
    }

    while (ip < prog.length) {
        if (ip + 1 >= prog.length) break; // no operand to read, halt

        const opcode = prog[ip];
        const operand = prog[ip + 1];
        let shouldAdvanceIP = true;

        switch (opcode) {
            case 0: {
                // adv: A = floor(A / (2^(combo operand)))
                const p = comboValue(operand);
                const div = twoPower(p);
                A = A / div;
                break;
            }
            case 1: {
                // bxl: B = B XOR literal operand
                B = B ^ BigInt(operand);
                break;
            }
            case 2: {
                // bst: B = (combo operand) mod 8
                const val = comboValue(operand);
                B = val & 0x7n;
                break;
            }
            case 3: {
                // jnz: if A != 0, ip = operand
                if (A !== 0n) {
                    ip = operand;
                    shouldAdvanceIP = false;
                }
                break;
            }
            case 4: {
                // bxc: B = B XOR C
                B = B ^ C;
                break;
            }
            case 5: {
                // out: output (combo operand mod 8)
                const val = comboValue(operand) & 0x7n;
                outputs.push(val);

                if (maxOutputLength !== undefined && outputs.length > maxOutputLength) {
                    return outputs;
                }
                break;
            }
            case 6: {
                // bdv: B = floor(A / (2^(combo operand)))
                const p = comboValue(operand);
                const div = twoPower(p);
                B = A / div;
                break;
            }
            case 7: {
                // cdv: C = floor(A / (2^(combo operand)))
                const p = comboValue(operand);
                const div = twoPower(p);
                C = A / div;
                break;
            }
            default:
                // Invalid opcode, halt
                return outputs;
        }

        if (shouldAdvanceIP) {
            ip += 2;
        }
    }

    return outputs;
}

function runMachine(candidate: bigint): bigint[] {
    return runProgram(candidate, B, C, program);
}

function compareTails(result: bigint[], prog: number[], lengthToCheck: number): boolean {
    if (result.length < lengthToCheck) return false;
    const startIndex = result.length - lengthToCheck;
    for (let i = 0; i < lengthToCheck; i++) {
        if (result[startIndex + i] !== BigInt(prog[prog.length - lengthToCheck + i])) {
            return false;
        }
    }
    return true;
}

function findNextDigit(currentDigit: number, solvedDigits: bigint): bigint {
    let baseValue = solvedDigits * 8n;
    for (let i = 0n; i < 8n; i++) {
        let candidate = baseValue + i;
        let result = runMachine(candidate);
        if (compareTails(result, program, currentDigit)) {
            console.log(`Found tail length ${currentDigit} matches for candidate (octal=${candidate.toString(8)}) decimal=${candidate}`);
            if (currentDigit === program.length) {
                return candidate;
            }
            let ret = findNextDigit(currentDigit + 1, candidate);
            if (ret !== -1n) {
                return ret;
            }
        }
    }
    return -1n;
}

// Kick off the search
let part2 = findNextDigit(1, 0n);
if (part2 === -1n) {
    console.log("No solution found.");
} else {
    console.log("Solution for A:", part2.toString());
}
