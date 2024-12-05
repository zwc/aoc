export function validateRules(sequence: string[], rules: string[]) {
  const positions : { [key: string]: number } = {};
  sequence.forEach((num, index) => {
    positions[num] = index; // Only need the latest position
  });

  return rules.every(([a, b]) => {
    if (!(a in positions) || !(b in positions)) return true;
    return positions[a] < positions[b];
  });
}

export function reorderSequence(sequence: string[], rules: [string, string][]): string[] {
  const graph = new Map<string, string[]>(sequence.map((page) => [page, []]));
  const inDegree = new Map<string, number>(sequence.map((page) => [page, 0]));

  rules.forEach(([a, b]) => {
    if (sequence.includes(a) && sequence.includes(b)) {
      graph.get(a)!.push(b); // Non-null assertion because `a` is guaranteed to be in `sequence`
      inDegree.set(b, (inDegree.get(b) ?? 0) + 1);
    }
  });

  const queue: string[] = [...inDegree.keys()].filter((page) => inDegree.get(page) === 0);
  const sorted: string[] = [];

  while (queue.length) {
    const current = queue.shift()!;
    sorted.push(current);
    for (const neighbor of graph.get(current)!) {
      const updatedInDegree = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, updatedInDegree);
      if (updatedInDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  return sorted;
}

export function findMiddlePage(sequence: string[]) {
  const middleIndex = Math.floor(sequence.length / 2);
  return sequence[middleIndex];
}