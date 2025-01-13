import { get } from "svelte/store";
import {
  cellHasBeenEvaluated,
  ensureWithinBounds,
  evaluateCell,
  evaluatedGridData,
  globalTempo,
  rawGridData,
  time,
} from "./store";
import { parseCellAddress } from "./utils";
import type { AudioCell, CellValue } from "./types";

type Token = string;
type FormulaArgument = string | number;

export function evaluateFormula(formula: string, depth = 0): CellValue {
  if (depth > 10) {
    return { type: "error", error: "Maximum recursion depth exceeded" };
  }

  const tokens = tokenizeFormula(formula.slice(1));
  const formulaName = tokens[0].toLowerCase();

  try {
    switch (formulaName) {
      case "waveform":
        return parseWaveform(tokens.slice(1), depth + 1);
      case "osc":
      case "oscillator":
        return parseOscillator(parseFunctionArguments(tokens.slice(1)), depth + 1);
      case "beat":
        return parseBeat(parseFunctionArguments(tokens.slice(1)), depth + 1);
      case "metronome":
        return parseMetronome(parseFunctionArguments(tokens.slice(1)), depth + 1);
      case "time":
        return parseTime();
      case "concat":
        return parseConcat(parseFunctionArguments(tokens.slice(1)), depth + 1);
      case "adsr":
        return parseADSR(parseFunctionArguments(tokens.slice(1)), depth + 1);
      case "audio":
        return parseAudio(parseFunctionArguments(tokens.slice(1)), depth + 1);
      default:
        return parseArithmetic(tokens, depth + 1);
    }
  } catch (error) {
    return {
      type: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function parseAudio(args: string[], depth: number): AudioCell {
  if (args.length < 2 || args.length > 3) {
    throw new Error("Audio requires 2 or 3 arguments (frequency, trigger, [waveType])");
  }

  const [frequencyRef, triggerRef, waveTypeRef = "'sine'"] = args.map((arg) => parseArgument(arg, depth));
  const triggerCell = typeof triggerRef === "object" ? triggerRef : null;

  if (!triggerCell?.listen) {
    throw new Error("Second argument must be a beat cell");
  }

  return {
    type: "audio",
    frequency: Number(frequencyRef) || 440,
    subscribe: (cb: (value: boolean) => void) => triggerCell.listen(cb),
    waveType: parseArgument(waveTypeRef, depth).toString(),
  };
}

function tokenizeFormula(formula: string): Token[] {
  const tokens: Token[] = [];
  let currentToken = "";
  let inQuotes = false;

  for (let i = 0; i < formula.length; i++) {
    const char = formula[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      currentToken += char;
    } else if (
      !inQuotes &&
      (char === "(" || char === ")" || char === "," || char === "+" || char === "-" || char === "*" || char === "/")
    ) {
      // Add the current token if we have one
      if (currentToken) {
        tokens.push(currentToken.trim());
        currentToken = "";
      }
      // Add the operator/punctuation token
      tokens.push(char);
    } else if (!inQuotes && char === " ") {
      if (currentToken) {
        tokens.push(currentToken.trim());
        currentToken = "";
      }
    } else {
      currentToken += char;
    }
  }

  if (currentToken) {
    tokens.push(currentToken.trim());
  }

  return tokens.filter((token) => token !== "");
}

function parseFunctionArguments(tokens: Token[]): string[] {
  tokens = tokens.slice(1, -1);
  const args: string[] = [];
  let currentArg: string[] = [];
  let parenCount = 0;

  for (const token of tokens) {
    if (token === "(") parenCount++;
    else if (token === ")") parenCount--;

    if (token === "," && parenCount === 0) {
      args.push(currentArg.join(" ").trim());
      currentArg = [];
    } else {
      currentArg.push(token);
    }
  }

  if (currentArg.length > 0) {
    args.push(currentArg.join(" ").trim());
  }

  return args;
}

function parseArgument(arg: string, depth: number) {
  if (isCellReference(arg)) {
    return getEvaluatedCellValue(arg);
  } else if (isNumber(arg)) {
    return parseFloat(arg);
  } else if (isInteger(arg)) {
    return parseInt(arg, 10);
  } else {
    return arg?.replace(/"/g, ""); // Handle strings
  }
}

function parseWaveform(tokens: Token[], depth: number): CellValue {
  if (tokens.length === 1) {
    const oscillator = parseArgument(tokens[0], depth);

    if (typeof oscillator === "object" && oscillator?.type === "oscillator") {
      return {
        type: "waveform",
        source: "oscillator",
        oscillator,
      };
    } else {
      throw new Error("Invalid oscillator reference");
    }
  } else if (tokens.length >= 2 && tokens.length <= 3) {
    const [freq, amplitude, phase = "0"] = tokens.map((token) => parseArgument(token, depth));

    return {
      type: "waveform",
      source: "parameters",
      freq: parseFloat(String(freq)) || 1,
      amplitude: parseFloat(String(amplitude)) || 1,
      phase: parseFloat(String(phase)) || 0,
    };
  } else {
    throw new Error("Waveform requires 1, 2, or 3 arguments");
  }
}

// ... Additional parsing functions (parseOscillator, parseADSR, etc.)
// I can continue with these if you'd like, but they follow the same pattern
// Let me know if you want to see any specific ones

function isNumber(arg: string): boolean {
  if (arg === "" || arg === null) return false;
  return !isNaN(Number(arg)) && arg.includes(".");
}

function isInteger(arg: string): boolean {
  return Number.isInteger(parseFloat(arg));
}

function isCellReference(arg: string): boolean {
  return /^[A-Z]+\d+$/.test(arg);
}

export function getRawCellValue(row: number, col: number): string | null {
  return get(rawGridData)[row]?.[col] || null;
}

function parseOscillator(tokens: string[], depth: number) {
  if (tokens.length !== 4) {
    throw new Error("Oscillator requires 4 arguments");
  }

  // Ex: OSC("SINE", 440, 0, 1) or OSC("SINE", A1, 0, 1)
  const [waveType, freq, phase, amplitude] = tokens.map((arg) => parseArgument(arg, depth));

  return {
    type: "oscillator",
    waveType: String(waveType),
    freq: parseFloat(String(freq)) || 0,
    phase: parseFloat(String(phase)) || 0,
    amplitude: parseFloat(String(amplitude)) || 0,
  };
}

function parseADSR(tokens: string[], depth: number) {
  if (tokens.length !== 4) {
    throw new Error("ADSR requires 4 arguments");
  }

  const [attack, decay, sustain, release] = tokens.map((arg) => parseFloat(String(parseArgument(arg, depth))) || 0);

  return {
    type: "adsr",
    attack,
    decay,
    sustain,
    release,
  };
}

function parseBeat(tokens: string[], depth: number) {
  if (tokens.length !== 2) {
    throw new Error("Beat requires 2 arguments");
  }

  const [bpm, pattern] = tokens.map((arg) => parseArgument(arg, depth));
  const subscribers: ((value: boolean) => void)[] = [];

  return {
    type: "beat",
    bpm: parseFloat(String(bpm)) || 120,
    trigger: (value: boolean) => {
      subscribers.forEach((sub) => sub(value));
    },
    listen: (cb: (value: boolean) => void) => {
      subscribers.push(cb);
    },
    pattern: String(pattern).trim(),
  };
}

function parseMetronome(tokens: string[], depth: number) {
  tokens = tokens.filter((token) => token !== "(" && token !== ")");

  if (tokens.length > 1) {
    throw new Error("Metronome requires zero or one argument");
  }

  const [bpm] = tokens.map((arg) => parseArgument(arg, depth));
  return {
    type: "metronome",
    bpm: parseFloat(String(bpm)) || get(globalTempo),
  };
}

function parseTime(): CellValue {
  return {
    type: "time",
    value: get(time),
  };
}

function parseConcat(tokens: string[], depth: number) {
  const args = tokens.join("").split(",");

  if (args.length < 2) {
    throw new Error("Concat requires at least 2 arguments");
  }

  const separator = args[0];
  const values = args.slice(1);

  return values.map((part) => getEvaluatedCellValue(part.trim())).join(separator);
}

function parseArithmetic(tokens: Token[], depth: number): number {
  const output: number[] = [];
  const operators: string[] = [];

  const precedence: Record<string, number> = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  function applyOperator() {
    const operator = operators.pop()!;
    const b = output.pop()!;
    const a = output.pop()!;

    switch (operator) {
      case "+":
        output.push(a + b);
        break;
      case "-":
        output.push(a - b);
        break;
      case "*":
        output.push(a * b);
        break;
      case "/":
        if (b === 0) throw new Error("Division by zero");
        output.push(a / b);
        break;
    }
  }

  for (const token of tokens) {
    if (["+", "-", "*", "/"].includes(token)) {
      while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
        applyOperator();
      }
      operators.push(token);
    } else {
      let value = parseArgument(token, depth);

      // If it's a cell reference, get its value
      if (typeof value === "string" && isCellReference(value)) {
        value = getEvaluatedCellValue(value);
      }

      // Handle null or undefined values
      if (value === null || value === undefined) {
        value = 0;
      }

      // Convert to number
      const numValue = toNumber(value);
      if (isNaN(numValue)) {
        throw new Error(`Invalid arithmetic operand: ${value}`);
      }

      output.push(numValue);
    }
  }

  while (operators.length) {
    applyOperator();
  }

  return output[0];
}

export function getEvaluatedCellValue(cellRef: string): CellValue {
  const { rowIndex, colIndex } = parseCellAddress(cellRef);
  ensureWithinBounds(rowIndex, colIndex);

  if (!cellHasBeenEvaluated(rowIndex, colIndex)) {
    evaluateCell(rowIndex, colIndex);
  }

  return get(evaluatedGridData)[rowIndex]?.[colIndex] || null;
}

// Helper to safely convert any value to a number
function toNumber(value: any): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) return parsed;
  }
  throw new Error(`Cannot convert ${value} to number`);
}
