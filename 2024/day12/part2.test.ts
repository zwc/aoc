import { readFileSync } from 'fs';
import { describe, it, expect } from 'bun:test';
import type { Edge } from './part2';
import { extractRegions, findBoundaryEdges, computeTotalPrice } from './part2';

describe('Fencing Price Calculations', () => {

  describe('extractRegions', () => {
    it('should return a single region for a uniform grid', () => {
      const grid = [
        ['A', 'A', 'A'],
        ['A', 'A', 'A'],
        ['A', 'A', 'A']
      ];
      const regions = extractRegions(grid);
      expect(regions.length).toBe(1);
      expect(regions[0].type).toBe('A');
      expect(regions[0].cells.length).toBe(9);
    });
  
    it('should return multiple regions for a grid with disconnected regions of the same type', () => {
      const grid = [
        ['A', 'A', 'B'],
        ['A', 'B', 'B'],
        ['C', 'C', 'C']
      ];
      const regions = extractRegions(grid);
      expect(regions.length).toBe(3);
  
      const aRegion = regions.find(r => r.type === 'A');
      expect(aRegion).toBeDefined();
      expect(aRegion!.cells.length).toBe(3);
  
      const bRegion = regions.find(r => r.type === 'B');
      expect(bRegion).toBeDefined();
      expect(bRegion!.cells.length).toBe(3);
  
      const cRegion = regions.find(r => r.type === 'C');
      expect(cRegion).toBeDefined();
      expect(cRegion!.cells.length).toBe(3);
    });
  
    it('should handle multiple separate regions of the same type', () => {
      const grid = [
        ['X', 'X', 'O'],
        ['X', 'O', 'O'],
        ['X', 'X', 'X']
      ];
      const regions = extractRegions(grid);
      expect(regions.length).toBe(2);
  
      const xRegion = regions.find(r => r.type === 'X');
      expect(xRegion).toBeDefined();
      expect(xRegion!.cells.length).toBe(6);
  
      const oRegion = regions.find(r => r.type === 'O');
      expect(oRegion).toBeDefined();
      expect(oRegion!.cells.length).toBe(3);
    });
  
    it('should handle a single cell grid', () => {
      const grid = [['Z']];
      const regions = extractRegions(grid);
      expect(regions.length).toBe(1);
      expect(regions[0].type).toBe('Z');
      expect(regions[0].cells.length).toBe(1);
      expect(regions[0].cells[0]).toEqual({ row: 0, col: 0, type: 'Z' });
    });
  
    it('should handle a grid with multiple distinct plant types in separate regions', () => {
      const grid = [
        ['A', 'A', 'B', 'B'],
        ['A', 'A', 'B', 'C'],
        ['D', 'D', 'C', 'C']
      ];
      const regions = extractRegions(grid);
      expect(regions.length).toBe(4);
  
      const aReg = regions.find(r => r.type === 'A');
      expect(aReg).toBeDefined();
      expect(aReg!.cells.length).toBe(4);
  
      const bReg = regions.find(r => r.type === 'B');
      expect(bReg).toBeDefined();
      expect(bReg!.cells.length).toBe(3);
  
      const cReg = regions.find(r => r.type === 'C');
      expect(cReg).toBeDefined();
      expect(cReg!.cells.length).toBe(3);
  
      const dReg = regions.find(r => r.type === 'D');
      expect(dReg).toBeDefined();
      expect(dReg!.cells.length).toBe(2);
    });
  
    it('should handle non-square grids', () => {
      const grid = [
        ['X', 'X', 'X', 'Y'],
        ['X', 'Y', 'Y', 'Y']
      ];
      const regions = extractRegions(grid);
      expect(regions.length).toBe(2);
  
      const xReg = regions.find(r => r.type === 'X');
      expect(xReg).toBeDefined();
      expect(xReg!.cells.length).toBe(4);
  
      const yReg = regions.find(r => r.type === 'Y');
      expect(yReg).toBeDefined();
      expect(yReg!.cells.length).toBe(4);
    });
  });

  describe('findBoundaryEdges', () => {
    it('should return correct edges for a single-cell region at the grid corner', () => {
      const grid = [
        ['A', 'B'],
        ['B', 'B']
      ];
      const region = { type: 'A', cells: [{ row: 0, col: 0, type: 'A' }] };      
      const edges = findBoundaryEdges(grid, region);
      const expectedEdges: Edge[] = [
        [0,0,0,1],
        [0,0,1,0],
        [0,1,1,1],
        [1,0,1,1]
      ];
      
      expect(edges.sort()).toEqual(expectedEdges.sort());
    });
  
    it('should handle a multi-cell region in the middle of the grid', () => {
      const grid = [
        ['A', 'A', 'A', 'A'],
        ['A', 'X', 'X', 'A'],
        ['A', 'X', 'X', 'A'],
        ['A', 'A', 'A', 'A']
      ];
      const region = {
        type: 'X',
        cells: [
          { row: 1, col: 1, type: 'X' },
          { row: 1, col: 2, type: 'X' },
          { row: 2, col: 1, type: 'X' },
          { row: 2, col: 2, type: 'X' }
        ]
      };
      const edges = findBoundaryEdges(grid, region);
      const expectedEdges: Edge[] = [
        [1,1,1,2],
        [1,1,2,1],
        [1,2,1,3],
        [1,3,2,3],
        [2,1,3,1],
        [3,1,3,2],
        [2,3,3,3],
        [3,2,3,3],
      ];

      expect(edges.sort()).toEqual(expectedEdges.sort());
    });
  
    it('should handle a region covering the entire grid', () => {
      const grid = [
        ['X', 'X'],
        ['X', 'X']
      ];
      const region = {
        type: 'X',
        cells: [
          { row: 0, col: 0, type: 'X' },
          { row: 0, col: 1, type: 'X' },
          { row: 1, col: 0, type: 'X' },
          { row: 1, col: 1, type: 'X' }
        ]
      };
      const edges = findBoundaryEdges(grid, region);

      const expectedEdges: Edge[] = [
        [0,0,0,1],
        [0,0,1,0],
        [0,1,0,2],
        [0,2,1,2],
        [1,0,2,0],
        [2,0,2,1],
        [1,2,2,2],
        [2,1,2,2],
      ];

      expect(edges.sort()).toEqual(expectedEdges.sort());
    });
  
    it('should handle a complex scenario with multiple types adjacent', () => {
      const grid = [
        ['A', 'A', 'B'],
        ['A', 'X', 'B'],
        ['A', 'A', 'B']
      ];
      const region = { type: 'X', cells: [{ row: 1, col: 1, type: 'X' }] };
      const edges = findBoundaryEdges(grid, region);
      const expectedEdges: Edge[] = [
        [1,1,1,2],
        [1,1,2,1],
        [1,2,2,2],
        [2,1,2,2],
      ];

      expect(edges.sort()).toEqual(expectedEdges.sort());
    });
  });

  describe('Actual input', () => {
    it('should compute the correct price', () => {
      const input = readFileSync('./input.txt', 'utf-8').toString();
      const map = input.split('\n').map(row => row.split(''));
      const result = computeTotalPrice(map);
      expect(result).toBe(808796);
    });
  });
});
