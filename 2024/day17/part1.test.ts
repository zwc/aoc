import { test, expect } from "bun:test";
import { runProgram } from "./part1";

test("Given example from the puzzle", () => {
    const initialA = 729;
    const initialB = 0;
    const initialC = 0;
    const program = [0,1,5,4,3,0];
    const result = runProgram(initialA, initialB, initialC, program);
    expect(result).toBe("4,6,3,5,6,3,5,2,1,0");
});

test("No instructions", () => {
    const result = runProgram(0, 0, 0, []);
    expect(result).toBe(""); 
});

test("Simple out test", () => {
    const result = runProgram(10, 0, 0, [5,0]);
    expect(result).toBe("0");
});