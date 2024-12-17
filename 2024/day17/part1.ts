export function runProgram(initialA: number, initialB: number, initialC: number, program: number[]): string {
  // Registers
  let A = initialA;
  let B = initialB;
  let C = initialC;

  // Instruction pointer
  let ip = 0;

  // Output collection
  const outputs: number[] = [];

  // Helper function to get combo operand value
  // Combo operands 0-3 => literal 0-3
  // Combo operand 4 => value in A
  // Combo operand 5 => value in B
  // Combo operand 6 => value in C
  // Combo operand 7 => not valid (won't appear in valid programs)
  function getComboValue(op: number): number {
      if (op < 4) {
          return op;
      } else if (op === 4) {
          return A;
      } else if (op === 5) {
          return B;
      } else if (op === 6) {
          return C;
      } else {
          // Should not happen for valid programs
          throw new Error("Invalid combo operand 7 encountered.");
      }
  }

  // Run until we run out of instructions
  while (ip < program.length) {
      const opcode = program[ip];
      const operand = program[ip + 1]; // operand always follows opcode

      // If we cannot read operand, it means we are at the end (or invalid)
      // In that case, we'll halt as well.
      if (ip + 1 >= program.length) {
          break;
      }

      let shouldAdvanceIP = true; // most instructions advance ip by 2

      switch (opcode) {
          case 0: {
              // adv: A = floor(A / (2^(combo operand)))
              const divisorPower = getComboValue(operand);
              const divisor = Math.pow(2, divisorPower);
              A = Math.floor(A / divisor);
              break;
          }

          case 1: {
              // bxl: B = B XOR literal operand
              B = B ^ operand;
              break;
          }

          case 2: {
              // bst: B = (combo operand) mod 8
              const val = getComboValue(operand);
              B = val & 0b111; // mod 8
              break;
          }

          case 3: {
              // jnz: if A != 0, ip = literal operand
              // otherwise, do nothing special
              if (A !== 0) {
                  ip = operand;
                  shouldAdvanceIP = false;
              }
              break;
          }

          case 4: {
              // bxc: B = B XOR C
              // operand is read but ignored
              B = B ^ C;
              break;
          }

          case 5: {
              // out: output (combo operand mod 8)
              const val = getComboValue(operand);
              outputs.push(val & 0b111);
              break;
          }

          case 6: {
              // bdv: B = floor(A / (2^(combo operand)))
              const divisorPower = getComboValue(operand);
              const divisor = Math.pow(2, divisorPower);
              B = Math.floor(A / divisor);
              break;
          }

          case 7: {
              // cdv: C = floor(A / (2^(combo operand)))
              const divisorPower = getComboValue(operand);
              const divisor = Math.pow(2, divisorPower);
              C = Math.floor(A / divisor);
              break;
          }

          default:
              // Invalid opcode - halt
              return outputs.join(",");
      }

      if (shouldAdvanceIP) {
          ip += 2; 
      }
  }

  return outputs.join(",");
}