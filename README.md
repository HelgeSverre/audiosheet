# AudioSheet

A musical spreadsheet that lets you create, visualize, and play with audio using familiar spreadsheet formulas.

## Overview

AudioSheet combines the familiar interface of a spreadsheet with audio synthesis capabilities. Create waveforms, design
beat patterns, and compose music using simple formulas and cell references.

## Features

- **Audio Synthesis**: Create oscillators with different waveforms (sine, square, sawtooth, triangle)
- **Beat Programming**: Design rhythmic patterns with customizable BPM
- **Visual Feedback**: See your waveforms and patterns in real-time
- **Formula-Based**: Use spreadsheet-style formulas to create and modify sounds
- **Cell References**: Reference other cells to create complex audio relationships
- **ADSR Envelopes**: Shape your sounds with Attack, Decay, Sustain, Release controls
- **Live Updates**: Changes are reflected in real-time while playing

## Formula Examples

```shell
=OSCILLATOR("sine", 440, 0, 1)    // Create a sine wave at 440Hz
=WAVEFORM(2, 0.5, 0)             // Visualize a waveform
=BEAT(120, "x - x -")            // Create a rhythmic pattern at 120 BPM
=AUDIO(440, B1, "sine")          // Play audio triggered by a beat pattern
=ADSR(0.1, 0.1, 0.5, 0.2)       // Create an ADSR envelope
```

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Built With

- Svelte
- TypeScript
- Web Audio API
- TailwindCSS

## Demo Patterns

Try these examples to get started:

### Basic Beat

```
A1: =BEAT(120, "x - x -")
B1: =AUDIO(440, A1, "sine")
```

### Waveform Visualization

```
A1: =OSCILLATOR("sine", 2, 0, 0.5)
B1: =WAVEFORM(A1)
```

### ADSR Envelope

```
A1: 0.1, 0.2, 0.5, 0.1
B1: =ADSR(A1)
```

## Development

### Project Structure

```
src/
  ├── components/    # Svelte components
  ├── lib/          # Core logic (parser, audio)
  ├── types/        # TypeScript type definitions
  └── utils/        # Helper functions
```

### Adding New Cell Types

1. Define the type in `types/index.ts`
2. Create a new component in `components/cells/`
3. Add parsing logic in `lib/parser.ts`
4. Register in `App.svelte`

## TODO lIST

- `=EUCLIDEAN(8, 3)`
- `=SCALE("C major", 4)`
- `=PROB(["C4", "E4", "G4"], [0.5, 0.3, 0.2], 120)`
- `=BEAT(120, "x ? x ?", 0.7)` (probability)
- `=SEQ(A3, 120, "arpeggio")`
- `=CHORDSEQ("ii-V-I", "C", 120)`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- Inspired by spreadsheet formula patterns
- Built on Web Audio API standards
- Uses modern Svelte patterns
