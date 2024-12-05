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

export function reorderSequence(sequence: string[], rules: string[]) {
  const graph = new Map(sequence.map((page) => [page, []]));
  const inDegree = new Map(sequence.map((page) => [page, 0]));

  rules.forEach(([a, b]) => {
    if (sequence.includes(a) && sequence.includes(b)) {
      graph.get(a).push(b);
      inDegree.set(b, inDegree.get(b) + 1);
    }
  });

  const queue = [...inDegree.keys()].filter((page) => inDegree.get(page) === 0);
  const sorted = [];

  while (queue.length) {
    const current = queue.shift();
    sorted.push(current);
    for (const neighbor of graph.get(current)) {
      if (
        inDegree.set(neighbor, inDegree.get(neighbor) - 1).get(neighbor) === 0
      ) {
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