type Position = { x: number; y: number };
type Direction = 'N' | 'E' | 'S' | 'W';
type State = { position: Position; direction: Direction; score: number };

const MOVES_BY_DIRECTION: Record<Direction, Position> = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
};

const DIRECTIONS_ORDER: Direction[] = ['N', 'E', 'S', 'W'];

const parseGrid = (maze: string[]): { start: Position; end: Position; grid: string[][] } => {
  const grid = maze.map((line) => line.split(''));
  let start: Position | null = null;
  let end: Position | null = null;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'S') start = { x, y };
      if (grid[y][x] === 'E') end = { x, y };
    }
  }
  if (!start || !end) throw new Error("Maze must contain a start and end.");
  return { start, end, grid };
};

const canMoveTo = (grid: string[][], p: Position): boolean =>
  p.y >= 0 && p.y < grid.length && p.x >= 0 && p.x < grid[0].length && grid[p.y][p.x] !== '#';

const manhattanDistance = (a: Position, b: Position): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const findLowestScore = (maze: string[]): number => {
  const { start, end, grid } = parseGrid(maze);
  const isEnd = (p: Position): boolean => p.x === end.x && p.y === end.y;
  const startState: State = { position: start, direction: 'E', score: 0 };
  const visitedStates = new Set<string>();
  const openStates: State[] = [startState];

  while (openStates.length > 0) {
    openStates.sort((a, b) =>
      (a.score + manhattanDistance(a.position, end)) -
      (b.score + manhattanDistance(b.position, end))
    );
    const currentState = openStates.shift()!;
    const stateKey = `${currentState.position.x},${currentState.position.y},${currentState.direction}`;
    if (visitedStates.has(stateKey)) continue;
    visitedStates.add(stateKey);
    if (isEnd(currentState.position)) return currentState.score;
    const forwardPos = {
      x: currentState.position.x + MOVES_BY_DIRECTION[currentState.direction].x,
      y: currentState.position.y + MOVES_BY_DIRECTION[currentState.direction].y,
    };
    if (canMoveTo(grid, forwardPos)) {
      openStates.push({ position: forwardPos, direction: currentState.direction, score: currentState.score + 1 });
    }
    const clockwiseDir = DIRECTIONS_ORDER[(DIRECTIONS_ORDER.indexOf(currentState.direction) + 1) % 4];
    const counterClockwiseDir = DIRECTIONS_ORDER[(DIRECTIONS_ORDER.indexOf(currentState.direction) + 3) % 4];
    openStates.push({ position: currentState.position, direction: clockwiseDir, score: currentState.score + 1000 });
    openStates.push({ position: currentState.position, direction: counterClockwiseDir, score: currentState.score + 1000 });
  }

  return Infinity;
};

export { findLowestScore };
