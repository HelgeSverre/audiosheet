import { replaceGrid } from "./lib/store";

export function fillSequenceData() {
  // Vertical sequence (read down a column)
  // =SEQ(A1:A4, 120)  // Read values A1 through A4 at 120 BPM
  //
  // Horizontal sequence (read across a row)
  // =SEQ(A1:D1, 120, "horizontal")  // Read values A1 through D1
  //
  // Matrix sequence (read whole area)
  // =SEQ(A1:B2, 120, "matrix")  // Read all values in the A1:B2 range
  replaceGrid([
    ["120", "120", "120", "120"],
    ["=SEQ(A1:D1, 120, horizontal)", "", "", ""],
    ["", "", "", ""],
    ["100", "440", "", ""],
    ["200", "440", "", ""],
    ["300", "800", "", ""],
    ["400", "440", "", ""],
    ["500", "440", "", "=seq(A4:A7, 120, vertical)"],
    ["600", "440", "=SEQ(A4:B9, 120, matrix)", "=Audio(C8,C9)"],

    // ],

    // A1: 440    // frequency for note 1
    // A2: 880    // frequency for note 2
    // A3: 660    // frequency for note 3
    // A4: 220    // frequency for note 4
    // B1: =SEQ(A1:A4, 120)  // create sequence from frequencies
    // C1: =AUDIO(B1, B1)    // play sequence using sequence as both frequency and trigger

    // ["440", "880", "660", "220"],
    // ["=SEQ(A1:A3, 120)", "=SEQ(A1:A3, 120)", "=SEQ(A1:A3, 120)", "=SEQ(A1:A3, 120)"],
    // ["=AUDIO(B1, B1)", "=AUDIO(B1, B1)", "=AUDIO(B1, B1)", "=AUDIO(B1, B1)"],
  ]);
}

export function fillChordTestData() {
  let code = `
  let count = getValue("B1") || 0;
  onBeat(() => {
    count++;
    setValue('C6', count);
  });
  return count;
`;
  let jsScript = `=JS(${code})`;

  replaceGrid([
    /* 1 */ [
      "=CHORD('C', 'maj')",
      "=CHORD('C', 'min')",
      "=CHORD('C', 'dim')",
      "=CHORD('C', 'aug')",
      "=CHORD('C', 'maj7')",
      "=CHORD('C', 'min7')",
      "=CHORD('C', '7')",
    ],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    // /* 2 */ ["C", "D", "E", "F", "G", "A", "B"],
    // /* 3 */ ["1", "2", "3", "4", "5", "6", "7"],
    // /* 4 */ ["maj", "min", "dim", "aug", "maj7", "min7", "7"],
    // /* 5 */ ["=CHORD(A2, A4)", "=CHORD(B2, B4)", "=CHORD(C2, C4)", "=CHORD(D2, D4)"],
    // /* 6 */ [jsScript, "100"],
  ]);
}

export function fillAdsrData() {
  replaceGrid([
    ["0.1, 0.1, 0.5, 0.5", "0.3, 0.2, 0.7, 1", "0.5, 0.3, 0.6, 0.8", "0.05, 0.15, 0.8, 0.2"],
    ["=ADSR(A1, B1, C1, D1)", "=ADSR(B1, A1, D1, C1)", "=ADSR(C1, D1, A1, B1)", "=ADSR(D1, C1, B1, A1)"],
  ]);
}

export function fillWaveTestData() {
  replaceGrid([
    ["Oscillators", "", "Waveforms", "", "Beat", ""],
    ['=oscillator("sine", 2, 0, 0.5)', "Sine wave", "=waveform(2, 0.5, 0)", "", '=beat(120, "x - x - x - x -")'],
    [
      '=oscillator("square", 4, 0, 0.5)',
      "Square wave",
      "=waveform(A2)",
      "references A2",
      '=beat(90, "x - x - x - x -")',
    ],
    [
      '=oscillator("sawtooth", 1, 0, 0.5)',
      "Sawtooth",
      "=waveform(4, 0.25, 3.14)",
      "with freq amp phase ",
      '=beat(60, "x - - - - - - -")',
      "",
    ],
    [
      '=oscillator("triangle", 0.5, 0, 0.5)',
      "Triangle",
      "=waveform(A4)",
      "references A4",
      '=beat(180, "x-x-x-x-")',
      "",
    ],
  ]);
}

export function fillMiscTestData() {
  replaceGrid([
    /* 1 */ ["120 bpm", "=metronome(120)", "66", "=metronome(C1)", "global", "=metronome()"],
    /* 2 */ ["freq", "amplitude", "phase"],
    /* 3 */ ["440", "0.5", "0"],
    /* 4 */ ['=oscillator("sawtooth", A4, B4, C4)', "Osc references values above"],
    /* 5 */ ["A3", "B3", "C3"],
    /* 6 */ ["=A3", "=B3", "=C3"],
    /* 7 */ ["=1 + 2", "=2*2", "=10/2", "=2^3"],
    /* 8 */ ["1", "2", "3", "4"],
    /* 9 */ ["=1+2+A8", "=C8+D8", "=B9+100"],
    /* 10 */ ["Audio Tests"],
    /* 11 */ ["440", '=BEAT(120, "x - x -")', '"sine"', "=AUDIO(A11, B11, C11)"],
    /* 12 */ ["880", '=BEAT(90, "x - - x - - x -")', '"square"', "=AUDIO(A12, B12, C12)"],
    /* 13 */ ["220", '=BEAT(60, "x - - - x - - -")', '"sawtooth"', "=AUDIO(A13, B13, C13)"],
  ]);
}

export function fillBasicFormulaTestData() {
  replaceGrid([
    ["100", "200", "=A6+B6", "400", "500", "=A1+B1"],
    ["=time()"],
    // Empty cells
    ["", "", "", "", "", "", "", "", "", ""],
    // String concatenation
    ["", "", "='Hello' & ' ' & 'World'", '="Hello" & " " & "World"', ""],
    // Testing references
    ["Ref A1", "=A1"],
    // 0 is invalid row
    ["Ref a0", "=A0"],

    ["", "", "", "", "", "", "", "", "", ""],
    // Testing invalid references
    ["REF INVALID", "=AAAA999"],
    // Testing case insensitivity and whitespace
    ["=TIME()", "", "=time()", "=time()", "= time()", "=time ()", "=time"],
  ]);
}

export function fillAudioTestData() {
  replaceGrid([
    ["Frequencies", "Beat Patterns", "Wave Types", "Audio Cells"],
    ["440", '=BEAT(120, "x - x -")', '"sine"', "=AUDIO(A2, B2, C2)"],
    ["880", '=BEAT(90, "x - - x - - x -")', '"square"', "=AUDIO(A3, B3, C3)"],
    ["220", '=BEAT(60, "x - - - x - - -")', '"sawtooth"', "=AUDIO(A4, B4, C4)"],
    ["120", '=BEAT(A5, "x - - - x - - -")', '"sawtooth"', "=AUDIO(A5, B5, C5)"],
    // ["330", '=BEAT(180, "x-x-x-x-")', '"triangle"', "=AUDIO(A5, B5, C5)"],
    // ["Octave Shift", "Tempo Change", "Dynamic Frequency"],
    // ["=A2 * 2", "=BEAT(B2.bpm * 1.5, B2.pattern)", "=A2 + (TIME() % 100)"],
    // ['=AUDIO(A7, B2, "sine")', '=AUDIO(A2, B7, "sine")', '=AUDIO(A8, B2, "sine")'],
    // ["Chord", "Arpeggio", "Melody"],
    // ['=AUDIO(A2, B2, "sine")', '=AUDIO(A2, B2, "sine")', '=AUDIO(A2, B2, "sine")'],
    // ['=AUDIO(A2*1.25, B2, "sine")', '=AUDIO(A3, B3, "sine")', '=AUDIO(A3, B3, "sine")'],
    // ['=AUDIO(A2*1.5, B2, "sine")', '=AUDIO(A4, B4, "sine")', '=AUDIO(A4, B4, "sine")'],
    // ["Complex Pattern", "Frequency Modulation", "Wave Type Modulation"],
    // [
    //   '=BEAT(120, "x-x-x--x-x--x-")',
    //   "=A2 * (1 + SIN(TIME() * 2) * 0.1)",
    //   '=CHOOSE(FLOOR(TIME() % 4) + 1, "sine", "square", "sawtooth", "triangle")',
    // ],
    // ['=AUDIO(A2, B13, "sine")', '=AUDIO(B14, B2, "sine")', "=AUDIO(A2, B2, C14)"],
  ]);
}
