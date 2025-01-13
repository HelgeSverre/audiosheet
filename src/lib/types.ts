export type CellValue = string | number | null | CellObject;

// Union of all possible cell types
export type CellType = "waveform" | "oscillator" | "beat" | "metronome" | "time" | "adsr" | "audio" | "error";

// Base cell object interface
export interface CellObject {
  type: CellType;
  [key: string]: any;
}

// Valid wave types
export type WaveType = "sine" | "square" | "sawtooth" | "triangle";

// Waveform specific types
export type WaveformSource = "oscillator" | "parameters";

export interface WaveformCell extends CellObject {
  type: "waveform";
  source: WaveformSource;
  freq?: number;
  amplitude?: number;
  phase?: number;
  oscillator?: OscillatorCell;
}

export interface OscillatorCell extends CellObject {
  type: "oscillator";
  waveType: WaveType;
  freq: number;
  phase: number;
  amplitude: number;
}

export interface BeatCell extends CellObject {
  type: "beat";
  bpm: number;
  pattern: string;
  trigger: (value: boolean) => void;
  listen: (callback: (value: boolean) => void) => void;
}

export interface MetronomeCell extends CellObject {
  type: "metronome";
  bpm: number;
}

export interface TimeCell extends CellObject {
  type: "time";
  value: number;
}

export interface ADSRCell extends CellObject {
  type: "adsr";
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface AudioCell extends CellObject {
  type: "audio";
  frequency: number;
  subscribe: (callback: (value: boolean) => void) => void;
  waveType: WaveType;
}

export interface ErrorCell extends CellObject {
  type: "error";
  error: string;
}

// Parser types
export type Operator = "+" | "-" | "*" | "/";
export type Token = string;
export type FormulaArgument = string | number | CellObject;

// Function argument validation
export interface FunctionArgSpec {
  name: string;
  type: "number" | "string" | "cell" | "any";
  required?: boolean;
  validator?: (value: any) => boolean;
}

// Grid positions and references
export interface CellPosition {
  row: number;
  col: number;
}

export interface FormulaParseResult {
  type: string;
  value?: any;
  error?: string;
}

export type TokenType = "number" | "operator" | "cell_reference" | "string" | "function" | "parenthesis" | "comma";

export interface Token {
  type: TokenType;
  value: string | number;
}

export interface ParsedArgument {
  value: string | number;
  type: "cell_reference" | "number" | "string";
}

// Audio Types
export type WaveType = "sine" | "square" | "sawtooth" | "triangle";

export interface AudioParams {
  frequency: number;
  waveType: WaveType;
  gain?: number;
}

// Grid Types
export interface GridPosition {
  row: number;
  col: number;
}

export interface CellAddress {
  rowIndex: number;
  colIndex: number;
}

// Store types
export interface GridState {
  raw: string[][];
  evaluated: CellValue[][];
}

// For type narrowing and validation
export const isWaveType = (type: string): type is WaveType => ["sine", "square", "sawtooth", "triangle"].includes(type);

export const isCellObject = (value: any): value is CellObject =>
  value !== null && typeof value === "object" && "type" in value;

export const isErrorCell = (cell: CellValue): cell is ErrorCell => isCellObject(cell) && cell.type === "error";

export const isAudioCell = (cell: CellValue): cell is AudioCell => isCellObject(cell) && cell.type === "audio";

export const isBeatCell = (cell: CellValue): cell is BeatCell => isCellObject(cell) && cell.type === "beat";
