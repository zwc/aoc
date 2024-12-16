type Direction = 0 | 1 | 2 | 3; 

interface State {
    r: number;
    c: number;
    d: Direction;
}

const DR = [-1, 0, 1, 0];
const DC = [0, 1, 0, -1];

const ROTATION_COST = 1000;
const FORWARD_COST = 1;

function dirLeft(d: Direction): Direction {
    return ((d + 3) % 4) as Direction;
}
function dirRight(d: Direction): Direction {
    return ((d + 1) % 4) as Direction;
}

function isWall(ch: string): boolean {
    return ch === '#';
}

function inBounds(r: number, c: number, rows: number, cols: number): boolean {
    return r >= 0 && r < rows && c >= 0 && c < cols;
}

interface MazeResult {
    maze: string[][];
    startR: number;
    startC: number;
    endR: number;
    endC: number;
}

/**
 * Given a maze as a string array, find S and E positions.
 */
function parseMaze(input: string[]): MazeResult {
    let startR = -1;
    let startC = -1;
    let endR = -1;
    let endC = -1;
    const maze = input.map(line => line.split(''));

    for (let r = 0; r < maze.length; r++) {
        for (let c = 0; c < maze[r].length; c++) {
            if (maze[r][c] === 'S') {
                startR = r; startC = c;
            }
            if (maze[r][c] === 'E') {
                endR = r; endC = c;
            }
        }
    }

    if (startR === -1 || startC === -1 || endR === -1 || endC === -1) {
        throw new Error("Maze must contain S and E");
    }

    return { maze, startR, startC, endR, endC };
}

/**
 * Use a Dijkstra-like approach to find the shortest distance from the start state (S, facing East)
 * to all reachable states. We consider states as (r, c, direction).
 */
function dijkstra(
    maze: string[][],
    startR: number,
    startC: number,
    endR: number,
    endC: number
) {
    const rows = maze.length;
    const cols = maze[0].length;

    // Distances: dist[r][c][d]
    const INF = Number.POSITIVE_INFINITY;
    const dist: number[][][] = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () =>
            [INF, INF, INF, INF]
        )
    );

    // Priority queue (min-heap) for Dijkstra: stores [cost, r, c, d]
    // We'll implement a simple priority queue using a binary heap.
    type Node = [number, number, number, Direction];
    const pq: Node[] = [];

    function push(node: Node) {
        pq.push(node);
        let i = pq.length - 1;
        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            if (pq[p][0] <= pq[i][0]) break;
            [pq[p], pq[i]] = [pq[i], pq[p]];
            i = p;
        }
    }

    function pop(): Node | undefined {
        if (pq.length === 0) return undefined;
        const top = pq[0];
        pq[0] = pq[pq.length - 1];
        pq.pop();
        let i = 0;
        while (true) {
            let left = 2 * i + 1, right = 2 * i + 2;
            let smallest = i;
            if (left < pq.length && pq[left][0] < pq[smallest][0]) smallest = left;
            if (right < pq.length && pq[right][0] < pq[smallest][0]) smallest = right;
            if (smallest === i) break;
            [pq[i], pq[smallest]] = [pq[smallest], pq[i]];
            i = smallest;
        }
        return top;
    }

    // Start facing East = direction = 1
    dist[startR][startC][1] = 0;
    push([0, startR, startC, 1]);

    while (true) {
        const node = pop();
        if (!node) break;
        const [curDist, r, c, d] = node;
        if (curDist > dist[r][c][d]) continue;

        // If we are at E, we still process because we want all shortest dist known.
        // Next steps:
        // 1) Move forward if possible
        const nr = r + DR[d];
        const nc = c + DC[d];
        if (inBounds(nr, nc, rows, cols) && !isWall(maze[nr][nc])) {
            const nd = d;
            const ndist = curDist + FORWARD_COST;
            if (ndist < dist[nr][nc][nd]) {
                dist[nr][nc][nd] = ndist;
                push([ndist, nr, nc, nd]);
            }
        }

        // 2) Rotate left
        {
            const nd = dirLeft(d);
            const ndist = curDist + ROTATION_COST;
            if (ndist < dist[r][c][nd]) {
                dist[r][c][nd] = ndist;
                push([ndist, r, c, nd]);
            }
        }
        // 3) Rotate right
        {
            const nd = dirRight(d);
            const ndist = curDist + ROTATION_COST;
            if (ndist < dist[r][c][nd]) {
                dist[r][c][nd] = ndist;
                push([ndist, r, c, nd]);
            }
        }
    }

    return dist;
}

/**
 * After running dijkstra, we have dist[r][c][d].
 * To find which tiles are on at least one shortest path:
 * 1) Find the minimal distance to the end tile: min_d dist[endR][endC][d].
 * 2) We'll do a backward check. We know a state (r,c,d) is on a shortest path if:
 *    There exists a next state (r', c', d') reachable by a valid move/rotation from (r,c,d)
 *    such that dist[r][c][d] + cost((r,c,d)->(r',c',d')) = dist[r'][c'][d'],
 *    AND dist[r'][c'][d'] is a known shortest-dist to the end.
 *
 * We'll mark all such states and by extension their (r,c) tiles.
 *
 * For efficiency, we can:
 * - Create a boolean array "onPath[r][c][d]" and fill it by starting from the end states.
 * - Once we mark end states as on shortest path, we propagate backwards.
 * - Alternatively, we can just do a multi-pass check: 
 *   Use a reverse BFS/DFS from all minimal end states. In a large maze, this might be intensive, but should be fine for a puzzle.
 *
 * We'll attempt a direct backward check. For that, we need to consider the reverse actions of forward/rotate.
 *
 * Reverse actions:
 * - If going forward (r,c,d) -> (nr,nc,d), cost = +1:
 *   Then backward: (nr,nc,d) can come from (r,c,d) if dist[r][c][d] + 1 = dist[nr][nc][d].
 * - If rotating left: (r,c,d) -> (r,c,dirRight(d)), cost = +1000
 *   Backwards: (r,c,d) can come from (r,c,dirLeft(d)) if dist[r][c][dirLeft(d)] + 1000 = dist[r][c][d].
 * - If rotating right: similarly.
 */
function findTilesOnBestPaths(
    maze: string[][],
    dist: number[][][],
    startR: number,
    startC: number,
    endR: number,
    endC: number
): boolean[][] {
    const rows = maze.length;
    const cols = maze[0].length;

    // Find minimal end distance
    let minEndDist = Number.POSITIVE_INFINITY;
    for (let d = 0 as Direction; d <= 3; d++) {
        if (dist[endR][endC][d] < minEndDist) {
            minEndDist = dist[endR][endC][d];
        }
    }

    // States on shortest path
    const onPath = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () =>
            [false, false, false, false]
        )
    );

    // Queue for BFS (backwards)
    const queue: State[] = [];
    // Initialize with all end states that achieve minEndDist
    for (let d = 0 as Direction; d <= 3; d++) {
        if (dist[endR][endC][d] === minEndDist) {
            onPath[endR][endC][d] = true;
            queue.push({ r: endR, c: endC, d });
        }
    }

    // We'll find all states that lead to these states on shortest paths
    while (queue.length > 0) {
        const { r, c, d } = queue.pop()!;

        const curDist = dist[r][c][d];
        // Consider reverse of forward move:
        // Forward move: from (r - DR[d], c - DC[d], d) to (r, c, d) costs +1
        // So backwards:
        const pr = r - DR[d];
        const pc = c - DC[d];
        if (pr >= 0 && pr < rows && pc >= 0 && pc < cols && !isWall(maze[pr][pc])) {
            const pd = d;
            if (dist[pr][pc][pd] + FORWARD_COST === curDist) {
                if (!onPath[pr][pc][pd]) {
                    onPath[pr][pc][pd] = true;
                    queue.push({ r: pr, c: pc, d: pd });
                }
            }
        }

        // Reverse of rotate left:
        // rotate left cost: (r,c,dirRight(d)) -> (r,c,d) with +1000
        // So backwards: (r,c,d) could come from (r,c,dirRight(d)) with +1000
        {
            const pd = dirRight(d);
            if (dist[r][c][pd] + ROTATION_COST === curDist) {
                if (!onPath[r][c][pd]) {
                    onPath[r][c][pd] = true;
                    queue.push({ r, c, d: pd });
                }
            }
        }

        // Reverse of rotate right:
        // rotate right cost: (r,c,dirLeft(d)) -> (r,c,d) with +1000
        {
            const pd = dirLeft(d);
            if (dist[r][c][pd] + ROTATION_COST === curDist) {
                if (!onPath[r][c][pd]) {
                    onPath[r][c][pd] = true;
                    queue.push({ r, c, d: pd });
                }
            }
        }
    }

    // Now we have onPath marked at the state level. We need which tiles are on at least one best path.
    // A tile is on a best path if any orientation at that tile is on a best path.
    const tileOnPath = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => false)
    );

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (onPath[r][c][0] || onPath[r][c][1] || onPath[r][c][2] || onPath[r][c][3]) {
                // Exclude walls
                if (!isWall(maze[r][c])) {
                    tileOnPath[r][c] = true;
                }
            }
        }
    }

    return tileOnPath;
}

export function findBestPathTiles(input: string[]): number {
  const { maze, startR, startC, endR, endC } = parseMaze(input);
  const dist = dijkstra(maze, startR, startC, endR, endC);
  const tileOnPath = findTilesOnBestPaths(maze, dist, startR, startC, endR, endC);

  let count = 0;
  for (let r = 0; r < tileOnPath.length; r++) {
      for (let c = 0; c < tileOnPath[r].length; c++) {
          if (tileOnPath[r][c]) {
              count++;
          }
      }
  }

  return count;
}
