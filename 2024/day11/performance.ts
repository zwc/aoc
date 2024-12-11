const transformAndCount = (stoneCounts: Map<number, number>): Map<number, number> => {
  const newCounts = new Map<number, number>();

  for (const [stone, count] of stoneCounts.entries()) {
    if (stone === 0) {
      // Rule 1: Change zero value stones to 1
      newCounts.set(1, (newCounts.get(1) || 0) + count);
    } else if (stone.toString().length % 2 === 0) {
      // Rule 2: Even-digit stones split into 2
      const digits = stone.toString();
      const mid = Math.floor(digits.length / 2);
      const left = parseInt(digits.slice(0, mid), 10);
      const right = parseInt(digits.slice(mid), 10);

      newCounts.set(left, (newCounts.get(left) || 0) + count);
      newCounts.set(right, (newCounts.get(right) || 0) + count);
    } else {
      // Rule 3: Odd-digit stones multiply by 2024
      const transformed = stone * 2024;
      newCounts.set(transformed, (newCounts.get(transformed) || 0) + count);
    }
  }

  return newCounts;
};

const simulateBlinks = (stones: number[], blinks: number): number => {
  let stoneCounts = new Map<number, number>();
  for (const stone of stones) {
    stoneCounts.set(stone, (stoneCounts.get(stone) || 0) + 1);
  }

  for (let i = 0; i < blinks; i++) {
    console.log(`Processing blink ${i + 1}/${blinks}...`);
    stoneCounts = transformAndCount(stoneCounts);
  }

  return Array.from(stoneCounts.values()).reduce((a, b) => a + b, 0);
};

export { simulateBlinks };
