import * as R from 'ramda';

type Point = [number, number];

const getNeighbors = (point: Point): Point[] => {
  const [x, y] = point;
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
};

const parseGrid = (input: string): string[][] => {
  return input.trim().split('\n').map(line => line.split(''));
};

const floodFill = (grid: string[][], visited: Set<string>, start: Point, plantType: string): Point[] => {
  const stack = [start];
  const region: Point[] = [];

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const key = `${x},${y}`;

    if (
      x >= 0 &&
      y >= 0 &&
      x < grid.length &&
      y < grid[0].length &&
      grid[x][y] === plantType &&
      !visited.has(key)
    ) {
      visited.add(key);
      region.push([x, y]);
      stack.push(...getNeighbors([x, y]));
    }
  }

  return region;
};

const calculatePerimeter = (grid: string[][], region: Point[]): number => {
  return R.sum(
    region.map(([x, y]) =>
      getNeighbors([x, y]).filter(
        ([nx, ny]) => nx < 0 || ny < 0 || nx >= grid.length || ny >= grid[0].length || grid[nx][ny] !== grid[x][y]
      ).length
    )
  );
};

export const calculateTotalPrice = (input: string): number => {
  const grid = parseGrid(input);
  const visited = new Set<string>();
  let totalPrice = 0;

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      const key = `${x},${y}`;
      if (!visited.has(key)) {
        const plantType = grid[x][y];
        const region = floodFill(grid, visited, [x, y], plantType);
        const area = region.length;
        const perimeter = calculatePerimeter(grid, region);
        totalPrice += area * perimeter;
      }
    }
  }

  return totalPrice;
};

