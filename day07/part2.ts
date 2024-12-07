const fs = require('fs');

const highland = require('highland');
import * as R from 'ramda';

const parseInput = (line: string) => {  
  const [sum, numbers] = line.split(':');
  return {
    sum: parseInt(sum.trim(), 10),
    numbers: numbers.trim().split(' ').map(Number),
  };
};

const generateOperatorCombinations = (length: number): string[][] => {
  const operators = ['+', '*', '||'];
  if (length === 1) return operators.map(op => [op]);
  return R.xprod(operators, generateOperatorCombinations(length - 1)).map(
      R.flatten
  );
};

const evaluateExpression = (numbers: number[], operators: string[]) => {
  return R.reduce(
      (acc, [number, operator]) => {
          switch (operator) {
              case '+':
                  return acc + number;
              case '*':
                  return acc * number;
              case '||':
                  return parseInt(`${acc}${number}`, 10); // Concatenation
              default:
                  throw new Error(`Unsupported operator: ${operator}`);
          }
      },
      numbers[0],
      R.zip(R.tail(numbers), operators)
  );
};

const checkCombinations = (sum: number, numbers: number[]) => {
  const operatorCombinations = generateOperatorCombinations(numbers.length - 1);
  return R.filter(
      operators => evaluateExpression(numbers, operators) === sum,
      operatorCombinations
  );
};

const input = fs
  .readFileSync('input.txt', 'utf8')
  .toString()
  .split('\n')
  .map(parseInput);

highland(input)
  .map(({ sum, numbers }) => {
    const validCombinations = checkCombinations(sum, numbers);
    return { sum, numbers, validCombinations };
  })
  .filter(result => result.validCombinations.length > 0)
  .tap(console.log)
  .reduce(0, (total, result) => total + result.sum)
  .tap(console.log)
  .done(() => {
    console.log('done');
  });