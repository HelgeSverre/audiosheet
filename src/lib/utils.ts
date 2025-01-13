interface CellAddress {
  rowIndex: number;
  colIndex: number;
}

// Convert column label (A, B, ..., Z, AA, etc.) to zero-based column index
export function getColumnIndex(columnLabel: string): number {
  let colIndex = 0;
  for (let i = 0; i < columnLabel.length; i++) {
    colIndex = colIndex * 26 + (columnLabel.charCodeAt(i) - 65 + 1);
  }
  return colIndex - 1;
}

// Convert zero-based column index to column label
export function getColumnLabel(index: number): string {
  let label = "";
  index++;
  while (index > 0) {
    const remainder = (index - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    index = Math.floor((index - 1) / 26);
  }
  return label;
}

export function cellAddressToXY(cellAddress: string): string {
  try {
    const { rowIndex, colIndex } = parseCellAddress(cellAddress);
    return `R${rowIndex}_C${colIndex}`;
  } catch (e) {
    return "";
  }
}

// Parse cell address like "AA12" and return { rowIndex, colIndex }
export function parseCellAddress(cellAddress: string): CellAddress {
  const match = cellAddress.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error("Invalid cell address");
  }
  const columnLabel = match[1];
  const rowIndex = parseInt(match[2], 10) - 1; // Convert 1-based row index to 0-based
  const colIndex = getColumnIndex(columnLabel);

  return { rowIndex, colIndex };
}

// Convert rowIndex and colIndex to a cell address like "AA12"
export function getCellAddress(rowIndex: number, colIndex: number): string {
  return `${getColumnLabel(colIndex)}${rowIndex + 1}`;
}

export function isGrid(arr: any[]): boolean {
  return Array.isArray(arr) && Array.isArray(arr[0]);
}
