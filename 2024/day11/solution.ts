import * as R from 'ramda';
import _ from 'highland';

const splitEvenDigits = (num: number): number[] => {
  const digits = num.toString();
  const mid = Math.floor(digits.length / 2);
  return [
    parseInt(digits.slice(0, mid), 10),
    parseInt(digits.slice(mid), 10),
  ];
};

const transformStone = (stone: number): number[] => {
  if (stone === 0) {
    return [1];
  }

  if (stone.toString().length % 2 === 0) {
    return splitEvenDigits(stone);
  }

  return [stone * 2024];
};

// Process a single blink using Highland streams
const blink = (stones: Highland.Stream<number>): Highland.Stream<number> =>
  stones.flatMap((stone) => _(transformStone(stone)));

// Simulate multiple blinks and return the total number of stones as a Promise
const simulateBlinks = async (stones: number[], blinks: number): Promise<number> => {
  const initialStream = _(stones);

  // Apply the blink transformations `blinks` times
  const finalStream = await _(R.range(0, blinks))
    .reduce(initialStream, (currentStream) => blink(currentStream)) // Chain the blinks
    .flatMap((stream) => stream.reduce(0, (count) => count + 1)) // Count the number of stones
    .toPromise(Promise);

  return finalStream;
};

export { simulateBlinks };
