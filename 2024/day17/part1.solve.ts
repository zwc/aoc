import { readFileSync } from "fs";
import { runProgram } from "./part1";

const input = readFileSync("input.txt", "utf8");
const lines = input.split("\n").map(line => line.trim()).filter(line => line.length > 0);

let A = 0;
let B = 0;
let C = 0;
let program: number[] = [];

for (const line of lines) {
    if (line.startsWith("Register A:")) {
        A = parseInt(line.split(":")[1].trim(), 10);
    } else if (line.startsWith("Register B:")) {
        B = parseInt(line.split(":")[1].trim(), 10);
    } else if (line.startsWith("Register C:")) {
        C = parseInt(line.split(":")[1].trim(), 10);
    } else if (line.startsWith("Program:")) {
        const programPart = line.split(":")[1].trim();
        program = programPart.split(",").map(s => parseInt(s.trim(), 10));
    }
}

const result = runProgram(A, B, C, program);
console.log(result);