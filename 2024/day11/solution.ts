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

const blink = (stones: Highland.Stream<number>): Highland.Stream<number> =>
  stones.flatMap((stone) => _(transformStone(stone)));

const simulateBlinks = async (stones: number[], blinks: number): Promise<number> => {
  const initialStream = _(stones);

  const finalStream = await _(R.range(0, blinks))
    .reduce(initialStream, (currentStream) => blink(currentStream)) 
    .flatMap((stream) => stream.reduce(0, (count) => count + 1))
    .toPromise(Promise);

  return finalStream;
};

export { simulateBlinks };
