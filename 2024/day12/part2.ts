import * as R from 'ramda';

type Cell = { row: number; col: number; type: string };
type Region = { type: string; cells: Cell[] };
export type Edge = [number, number, number, number];

const neighbors = [
  { dRow: -1, dCol: 0 },
  { dRow: 1, dCol: 0 },
  { dRow: 0, dCol: -1 },
  { dRow: 0, dCol: 1 }
];

function runBFS(
  grid: string[][],
  visited: boolean[][],
  startRow: number,
  startCol: number
): Cell[] {
  const rowCount = grid.length;
  const colCount = grid[0].length;
  const plantType = grid[startRow][startCol];

  const initialState = {
    queue: [{ row: startRow, col: startCol, type: plantType }],
    visited,
    plantType
  };

  return R.unfold(({ queue, visited, plantType }) => {
    if (queue.length === 0) return undefined;
    const current = queue.shift()!;
    const { row, col } = current;

    const newQueue = [...queue];
    for (const { dRow, dCol } of neighbors) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (
        newRow >= 0 && newRow < rowCount &&
        newCol >= 0 && newCol < colCount &&
        !visited[newRow][newCol] &&
        grid[newRow][newCol] === plantType
      ) {
        visited[newRow][newCol] = true;
        newQueue.push({ row: newRow, col: newCol, type: plantType });
      }
    }

    return [current, { queue: newQueue, visited, plantType }];
  }, initialState);
}

export function extractRegions(grid: string[][]): Region[] {
  const rowCount = grid.length;
  const colCount = grid[0].length;
  const visited = R.times(() => R.repeat(false, colCount), rowCount);

  const allCells = R.xprod(R.range(0, rowCount), R.range(0, colCount));

  return R.reduce((regions: Region[], [row, col]) => {
    if (!visited[row][col]) {
      visited[row][col] = true;
      const plantType = grid[row][col];
      const regionCells = runBFS(grid, visited, row, col);
      return R.append({ type: plantType, cells: regionCells }, regions);
    }
    return regions;
  }, [] as Region[], allCells);
}

function getPointKey(row: number, col: number): string {
  return `${row},${col}`;
}

function getEdgeKey(edge: Edge): string {
  return edge.join(',');
}

function getEdgeDirection(edge: Edge): 'H' | 'V' {
  const [startRow,,endRow] = edge;
  return startRow === endRow ? 'H' : 'V';
}

function directionOrder(dx: number, dy: number): [number, number][] {
  if (dx === 1 && dy === 0) return [[0,-1],[1,0],[0,1],[-1,0]];     // moving right
  if (dx === 0 && dy === 1) return [[1,0],[0,1],[-1,0],[0,-1]];     // moving down
  if (dx === -1 && dy === 0) return [[0,1],[-1,0],[0,-1],[1,0]];    // moving left
  return [[-1,0],[0,-1],[1,0],[0,1]];                               // moving up
}

export function findBoundaryEdges(grid: string[][], region: Region): Edge[] {
  const rowCount = grid.length;
  const colCount = grid[0].length;
  const boundaryEdges: Edge[] = [];

  for (const { row, col, type } of region.cells) {
    for (const { dRow, dCol } of neighbors) {
      const neighborRow = row + dRow;
      const neighborCol = col + dCol;
      const outOfBounds = neighborRow < 0 || neighborRow >= rowCount || neighborCol < 0 || neighborCol >= colCount;
      const differentType = !outOfBounds && grid[neighborRow][neighborCol] !== type;

      if (outOfBounds || differentType) {
        if (dRow === -1 && dCol === 0) {
          boundaryEdges.push([row, col, row, col + 1]);
        } else if (dRow === 1 && dCol === 0) {
          boundaryEdges.push([row + 1, col, row + 1, col + 1]);
        } else if (dRow === 0 && dCol === -1) {
          boundaryEdges.push([row, col, row + 1, col]);
        } else if (dRow === 0 && dCol === 1) {
          boundaryEdges.push([row, col + 1, row + 1, col + 1]);
        }
      }
    }
  }

  return boundaryEdges;
}

function buildAdjacencyMap(edges: Edge[]): Map<string, Edge[]> {
  const adjacency = new Map<string, Edge[]>();
  for (const edge of edges) {
    const [startRow, startCol, endRow, endCol] = edge;
    const startPoint = getPointKey(startRow, startCol);
    const endPoint = getPointKey(endRow, endCol);

    if (!adjacency.has(startPoint)) adjacency.set(startPoint, []);
    adjacency.get(startPoint)!.push(edge);

    if (!adjacency.has(endPoint)) adjacency.set(endPoint, []);
    adjacency.get(endPoint)!.push(edge);
  }
  return adjacency;
}

function sortVertices(vertices: string[]): string[] {
  return vertices.sort((a, b) => {
    const [aRow, aCol] = a.split(',').map(Number);
    const [bRow, bCol] = b.split(',').map(Number);
    return aRow === bRow ? aCol - bCol : aRow - bRow;
  });
}

function findLoops(adjacency: Map<string, Edge[]>): Edge[][] {
  const visitedEdges = new Set<string>();
  const allVertices = sortVertices(Array.from(adjacency.keys()));
  const loops: Edge[][] = [];

  for (const vertex of allVertices) {
    const startingEdges = adjacency.get(vertex)!;
    for (const startingEdge of startingEdges) {
      if (!visitedEdges.has(getEdgeKey(startingEdge))) {
        loops.push(traceLoop(adjacency, startingEdge, visitedEdges));
      }
    }
  }

  return loops;
}

function traceLoop(adjacency: Map<string, Edge[]>, startingEdge: Edge, visitedEdges: Set<string>): Edge[] {
  const loop: Edge[] = [];
  visitedEdges.add(getEdgeKey(startingEdge));
  loop.push(startingEdge);

  let [curStartRow, curStartCol, curEndRow, curEndCol] = startingEdge;
  let currentNode = getPointKey(curEndRow, curEndCol);
  let directionX = curEndCol - curStartCol;
  let directionY = curEndRow - curStartRow;
  const startNode = getPointKey(curStartRow, curStartCol);

  while (currentNode !== startNode) {
    const candidateEdges = adjacency.get(currentNode)!;
    const unvisited = candidateEdges.filter(e => !visitedEdges.has(getEdgeKey(e)));
    if (!unvisited.length) break;

    const preferences = directionOrder(directionX, directionY);
    let chosenEdge: Edge | null = null;

    for (const [pdx, pdy] of preferences) {
      chosenEdge = unvisited.find(e => matchesPreferredDirection(e, currentNode, pdx, pdy));
      if (chosenEdge) break;
    }

    if (!chosenEdge) break;
    visitedEdges.add(getEdgeKey(chosenEdge));
    loop.push(chosenEdge);

    const [nr1, nc1, nr2, nc2] = chosenEdge;
    if (getPointKey(nr1, nc1) === currentNode) {
      directionX = nc2 - nc1;
      directionY = nr2 - nr1;
      currentNode = getPointKey(nr2, nc2);
    } else {
      directionX = nc1 - nc2;
      directionY = nr1 - nr2;
      currentNode = getPointKey(nr1, nc1);
    }
  }

  return loop;
}

function matchesPreferredDirection(edge: Edge, currentNode: string, pdx: number, pdy: number): boolean {
  const [eStartRow, eStartCol, eEndRow, eEndCol] = edge;
  const startKey = getPointKey(eStartRow, eStartCol);
  if (startKey === currentNode) {
    return (eEndCol - eStartCol) === pdx && (eEndRow - eStartRow) === pdy;
  } else {
    return (eStartCol - eEndCol) === pdx && (eStartRow - eEndRow) === pdy;
  }
}

function countSidesFromLoops(loops: Edge[][]): number {
  return R.sum(R.map((loopEdges: Edge) => {
    const directions = R.map(getEdgeDirection, loopEdges);
    let sideCount = 1;
    for (let i = 1; i < directions.length; i++) {
      if (directions[i] !== directions[i - 1]) sideCount++;
    }
    return sideCount;
  }, loops));
}

export function calculateNumberOfSidesForRegion(grid: string[][], region: Region): number {
  const edges = findBoundaryEdges(grid, region);
  const adjacency = buildAdjacencyMap(edges);
  const loops = findLoops(adjacency);
  return countSidesFromLoops(loops);
}

function computeRegionPrice(grid: string[][], region: Region): number {
  return region.cells.length * calculateNumberOfSidesForRegion(grid, region);
}

export function computeTotalPrice(grid: string[][]): number {
  return R.sum(R.map(r => computeRegionPrice(grid, r), extractRegions(grid)));
}
