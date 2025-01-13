import { derived, get, writable, type Writable } from "svelte/store";
import { evaluateFormula } from "./parser";
import type { CellValue } from "./types";
import { isGrid } from "./utils";

export const rawGridData: Writable<string[][]> = writable([]);
export const evaluatedGridData: Writable<CellValue[][]> = writable([]);
export const time: Writable<number> = writable(0);
export const globalTempo: Writable<number> = writable(120);

export const rowCount = derived(rawGridData, ($rawGridData) => $rawGridData.length);
export const columnCount = derived(rawGridData, ($rawGridData) => $rawGridData[0]?.length ?? 0);

export function initializeStores(rowCount: number, colCount: number): void {
  rawGridData.set(
    Array(rowCount)
      .fill(null)
      .map(() => Array(colCount).fill("")),
  );

  evaluatedGridData.set(
    Array(rowCount)
      .fill(null)
      .map(() => Array(colCount).fill("")),
  );
}

export function updateCell(row: number, col: number, value: string): void {
  console.log("Update cell called", { row, col, value });
  rawGridData.update((data) => {
    const newData = [...data];
    if (!newData[row]) newData[row] = [];
    newData[row][col] = value;
    return newData;
  });

  evaluateAllCells();
}

export function cellHasBeenEvaluated(row: number, col: number): boolean {
  try {
    const evaluated = get(evaluatedGridData)[row][col];
    return evaluated !== undefined && evaluated !== null;
  } catch (e) {
    return false;
  }
}

export function evaluateCell(row: number, col: number): void {
  const rawGrid = get(rawGridData);
  const rawValue = rawGrid[row]?.[col];

  let evaluatedValue: CellValue;

  if (typeof rawValue === "string" && rawValue.startsWith("=")) {
    try {
      evaluatedValue = evaluateFormula(rawValue, row, col);
    } catch (err) {
      evaluatedValue = {
        type: "error",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  } else {
    evaluatedValue = rawValue;
  }

  evaluatedGridData.update((data) => {
    const newData = [...data];
    if (!newData[row]) newData[row] = [];
    newData[row][col] = evaluatedValue;
    return newData;
  });
}

export function evaluateAllCells(): void {
  const rawData = get(rawGridData);
  rawData.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => {
      evaluateCell(rowIndex, colIndex);
    });
  });
}

export function ensureWithinBounds(row: number, col: number): boolean {
  if (row === null || col === null) {
    throw new Error("Invalid cell reference");
  }

  if (row < 0 || col < 0) {
    throw new Error("Cell reference out of bounds (negative)");
  }

  const currentRowCount = get(rowCount);
  const currentColCount = get(columnCount);

  if (row >= currentRowCount || col >= currentColCount) {
    throw new Error("Cell reference out of bounds (exceeds grid size)");
  }

  return true;
}

export function replaceGrid(newGridData: string[][], evaluate = true): void {
  console.log("Replace Grid called", { newGridData, evaluate });

  if (!isGrid(newGridData)) {
    console.error("replaceGrid expects a 2D array");
    return;
  }

  // Make all rows have the same number of columns
  const maxColCount = Math.max(...newGridData.map((row) => row.length));

  // Build new grid with uniform columns
  const uniformGrid = newGridData.map((row) => {
    const newRow = [...row];
    while (newRow.length < maxColCount) {
      newRow.push("");
    }
    return newRow;
  });

  rawGridData.set(uniformGrid);
  evaluatedGridData.set(
    Array(uniformGrid.length)
      .fill(null)
      .map(() => Array(maxColCount).fill("")),
  );

  if (evaluate) {
    evaluateAllCells();
  }
}

export function resetGrid(): void {
  const currentRowCount = get(rowCount);
  const currentColCount = get(columnCount);

  rawGridData.set(
    Array(currentRowCount)
      .fill(null)
      .map(() => Array(currentColCount).fill("")),
  );

  evaluatedGridData.set(
    Array(currentRowCount)
      .fill(null)
      .map(() => Array(currentColCount).fill("")),
  );
}
