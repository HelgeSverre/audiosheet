import { getEvaluatedCellValue } from "./parser";
import { updateCell } from "./store";
import { parseCellAddress } from "./utils";
import { getAudioContext } from "./audio";

interface AudioSheetAPI {
  // Audio helpers
  createOscillator: (type: string, freq: number) => number;
  playNote: (freq: number, duration: number) => void;
  getBPM: () => number;

  // Cell access
  getValue: (cellRef: string) => any;
  setValue: (cellRef: string, value: any) => void;

  // Time-based helpers
  getCurrentTime: () => number;
  onBeat: (callback: (beat: number) => void) => void;

  // Math utilities
  random: (min: number, max: number) => number;
  scale: (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => number;
}

// Create a sandbox environment for running JS
function createSandbox(cellRef: string): AudioSheetAPI {
  console.log("JS:Sandbox - createSandbox", cellRef);
  return {
    createOscillator: (type, freq) => {
      // Safe wrapper around oscillator creation
      console.log("JS:Sandbox - createOscillator", type, freq);
    },

    playNote: (freq, duration) => {
      console.log("JS:Sandbox - playNote", freq, duration);
    },

    getBPM: () => {
      console.log("JS:Sandbox - getBPM");
      return 120;
    },

    getValue: (ref) => {
      console.log("JS:Sandbox - getValue", ref);
      // Safe way to access other cells
      return getEvaluatedCellValue(ref);
    },

    setValue: (ref, value) => {
      console.log("JS:Sandbox - setValue", ref, value);
      const { rowIndex, colIndex } = parseCellAddress(ref);
      updateCell(rowIndex, colIndex, value);
    },

    getCurrentTime: () => {
      console.log("JS:Sandbox - getCurrentTime");
      // Get current audio time
      return getAudioContext().currentTime;
    },

    onBeat: (callback) => {
      console.log("JS:Sandbox - onBeat");
      [].push(callback);
    },

    random: (min, max) => {
      console.log("JS:Sandbox - random", min, max);
      return Math.random() * (max - min) + min;
    },

    scale: (value, inMin, inMax, outMin, outMax) => {
      console.log("JS:Sandbox - scale", value, inMin, inMax, outMin, outMax);
      return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    },
  };
}

// Function to safely evaluate JS in a cell
export function evaluateJS(code: string, cellRef: string): any {
  // Create sandbox with API
  const sandbox = createSandbox(cellRef);

  // Create a safe function from the code
  const safeFunction = new Function(
    "api",
    `
    const {
      createOscillator, playNote, getBPM,
      getValue, setValue, getCurrentTime,
      onBeat, random, scale
    } = api;
    
    return (${code});
  `,
  );

  try {
    return safeFunction(sandbox);
  } catch (error) {
    return {
      type: "error",
      error: `JS Error: ${error?.message || error || "Unknown error"}`,
    };
  }
}
