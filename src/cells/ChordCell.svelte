<script lang="ts">
  import type { ChordResult } from "../lib/types";

  export let cell: ChordResult;

  // Calculate positions for visual representation
  $: keys = new Array(12).fill(0);
  $: activeNotes = cell.notes.map((note) => parseInt(note.replace(/[A-G]#?/, "")) % 12);

  // For inversions and voicings
  $: sortedFrequencies = [...cell.frequencies].sort((a, b) => a - b);
  $: bassNote = cell.notes[0];

  // Format frequencies nicely
  const formatFreq = (freq: number) => Math.round(freq * 100) / 100;
</script>

<div class="flex min-w-60 flex-col gap-1 rounded border border-indigo-200 bg-indigo-50 p-2">
  <!-- Chord Name and Info -->
  <div class="flex items-center justify-between">
    <span class="text-sm font-semibold text-indigo-700">{cell.symbol}</span>
    <span class="text-xs text-indigo-600">Bass: {bassNote}</span>
  </div>

  <!-- Piano Roll Visualization -->
  <div class="flex h-8 gap-px">
    {#each keys as _, i}
      <div
        class="flex-1 rounded-b border-b-2 transition-all"
        class:bg-indigo-500={activeNotes.includes(i)}
        class:border-indigo-500={activeNotes.includes(i)}
        class:bg-white={!activeNotes.includes(i)}
        class:border-gray-200={!activeNotes.includes(i)}
      />
    {/each}
  </div>

  <!-- Frequencies -->
  <div class="flex flex-wrap gap-1 text-xs">
    {#each cell.frequencies as freq, i}
      <span class="rounded bg-indigo-100 px-1 font-mono">
        {formatFreq(freq)}Hz
      </span>
    {/each}
  </div>

  <!-- Notes -->
  <div class="flex flex-wrap gap-1 text-xs">
    {#each cell.notes as note}
      <span class="rounded bg-indigo-200 px-1">
        {note}
      </span>
    {/each}
  </div>
</div>
