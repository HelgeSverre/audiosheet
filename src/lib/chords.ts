// Mapping of note names to MIDI note numbers (C4 = 60)
import type { ChordDefinition, ChordQuality, NoteName } from "./types";

export const NOTE_TO_MIDI: Record<NoteName, number> = {
  "C": 60,
  "C#": 61,
  "D": 62,
  "D#": 63,
  "E": 64,
  "F": 65,
  "F#": 66,
  "G": 67,
  "G#": 68,
  "A": 69,
  "A#": 70,
  "B": 71,
};

// Standard chord definitions using semitone intervals
export const CHORD_TYPES: Record<ChordQuality, ChordDefinition> = {
  "maj": {
    intervals: [0, 4, 7],
    symbol: "",
    name: "Major",
  },
  "min": {
    intervals: [0, 3, 7],
    symbol: "m",
    name: "Minor",
  },
  "dim": {
    intervals: [0, 3, 6],
    symbol: "dim",
    name: "Diminished",
  },
  "aug": {
    intervals: [0, 4, 8],
    symbol: "aug",
    name: "Augmented",
  },
  "maj7": {
    intervals: [0, 4, 7, 11],
    symbol: "maj7",
    name: "Major Seventh",
  },
  "min7": {
    intervals: [0, 3, 7, 10],
    symbol: "m7",
    name: "Minor Seventh",
  },
  "7": {
    intervals: [0, 4, 7, 10],
    symbol: "7",
    name: "Dominant Seventh",
  },
  "dim7": {
    intervals: [0, 3, 6, 9],
    symbol: "dim7",
    name: "Diminished Seventh",
  },
  "half-dim7": {
    intervals: [0, 3, 6, 10],
    symbol: "ø7",
    name: "Half-Diminished Seventh",
  },
  "sus2": {
    intervals: [0, 2, 7],
    symbol: "sus2",
    name: "Suspended Second",
  },
  "sus4": {
    intervals: [0, 5, 7],
    symbol: "sus4",
    name: "Suspended Fourth",
  },
};

// Convert MIDI note number to frequency
export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Get note name from MIDI number (with octave)
export function midiToNoteName(midi: number): string {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const noteName = noteNames[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${noteName}${octave}`;
}

// Parse a note name with optional octave (e.g., "C4", "F#", "Bb3")
export function parseNoteName(note: string): number {
  const match = note.match(/^([A-G][#b]?)(\d)?$/);
  if (!match) throw new Error(`Invalid note name: ${note}`);

  const [, noteName, octave] = match;
  const baseNote = NOTE_TO_MIDI[noteName as NoteName];
  if (baseNote === undefined) throw new Error(`Invalid note name: ${noteName}`);

  const octaveNum = octave ? parseInt(octave) : 4;
  return baseNote + (octaveNum - 4) * 12;
}
