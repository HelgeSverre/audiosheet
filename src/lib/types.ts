// noinspection JSUnusedGlobalSymbols

export type CellValue = string | number | null | CellObject | ErrorCell;

export type WaveType = "sine" | "square" | "sawtooth" | "triangle";

export type NoteName = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";
export type ChordQuality =
  | "maj"
  | "min"
  | "dim"
  | "aug"
  | "maj7"
  | "min7"
  | "7"
  | "dim7"
  | "half-dim7"
  | "sus2"
  | "sus4";

// Union of all possible cell types
export type CellType =
  | "waveform"
  | "oscillator"
  | "beat"
  | "metronome"
  | "time"
  | "adsr"
  | "audio"
  | "error"
  | "sequence"
  | "chord";

export interface CellObject {
  type: CellType;

  [key: string]: any;
}

export interface ChordDefinition {
  intervals: number[]; // Semitones from root
  symbol: string; // e.g., "m" for minor, "maj7" for major 7th
  name: string; // Full name, e.g., "Minor Seventh"
}

export interface ChordResult {
  type: "chord";
  root: NoteName;
  quality: ChordQuality;
  frequencies: number[];
  notes: string[];
  symbol: string;
}

export type WaveformSource = "oscillator" | "parameters";

export type SequenceMode = "vertical" | "horizontal" | "matrix";

export interface ChordCell extends CellObject {
  type: "chord";
  value: string;
  root: NoteName;
  quality: ChordQuality;
  frequencies: number[];
  notes: string[];
  symbol: string;
}

export interface SequenceCell extends CellObject {
  type: "sequence";
  values: (number | null)[];
  currentStep: number;
  totalSteps: number;
  bpm: number;
  trigger: (value: boolean) => void;
  listen: (callback: (value: boolean) => void) => void;
  getCurrentValue: () => number | null;
  metadata: {
    mode: SequenceMode;
    range: CellRange;
    bpm: number;
  };
}

export interface CellRange {
  start: { row: number; col: number };
  end: { row: number; col: number };
}

export interface RangeSelector {
  active: boolean;
  start: { row: number; col: number } | null;
  end: { row: number; col: number } | null;
}

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
