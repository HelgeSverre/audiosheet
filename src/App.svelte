<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import WaveformCell from "./cells/WaveformCell.svelte";
  import OscillatorCell from "./cells/OscillatorCell.svelte";
  import BeatCell from "./cells/BeatCell.svelte";
  import MetronomeCell from "./cells/MetronomeCell.svelte";
  import TimeCell from "./cells/TimeCell.svelte";
  import classNames from "classnames";
  import { Download, Music, Pause, Play, Save, Square, Trash2, Upload } from "lucide-svelte";
  import { exportToFile, importFromFile, loadFromLocalStorage, saveToLocalStorage } from "./lib/storage";
  import {
    evaluateAllCells,
    evaluatedGridData,
    globalTempo,
    initializeStores,
    resetGrid,
    time,
    updateCell,
  } from "./lib/store";
  import {
    fillAdsrData,
    fillAudioTestData,
    fillBasicFormulaTestData,
    fillMiscTestData,
    fillWaveTestData,
  } from "./testData";
  import ADSRCell from "./cells/ADSRCell.svelte";
  import { getRawCellValue } from "./lib/parser";
  import ErrorCell from "./cells/ErrorCell.svelte";
  import AudioCell from "./cells/AudioCell.svelte";
  import { getCellAddress, getColumnLabel } from "./lib/utils";

  let inputRef;

  let isPlaying = false;
  let animationFrameId;
  let lastUpdateTime = 0;
  const fps = 60;
  const frameInterval = 1000 / fps;

  onMount(() => {
    initializeStores(50, 50);
    // loadFromLocalStorage();
    // fillAudioTestData();
    evaluateAllCells();
    animate();
  });

  onDestroy(() => {
    cancelAnimationFrame(animationFrameId);
  });

  let editingCell = null;

  async function startEditing(rowIndex, colIndex) {
    editingCell = { rowIndex, colIndex };
    await tick();
    inputRef?.focus();
  }

  function stopEditing() {
    editingCell = null;
  }

  function handlePlay() {
    isPlaying = true;
    animate();
  }

  function handlePause() {
    isPlaying = false;
    cancelAnimationFrame(animationFrameId);
  }

  function handleStop() {
    isPlaying = false;
    $time = 0;
    cancelAnimationFrame(animationFrameId);
  }

  /**
   * @param {DOMHighResTimeStamp} currentTime
   */
  function loop(currentTime) {
    if (currentTime - lastUpdateTime >= frameInterval) {
      const delta = (currentTime - lastUpdateTime) / 1000;
      $time += delta;
      lastUpdateTime = currentTime;
    }
    animationFrameId = requestAnimationFrame(loop);
  }

  function animate() {
    loop(performance.now());
  }

  /**
   * @param {number} rowIndex
   * @param {number} colIndex
   * @param {string} value
   */
  function handleCellChange(rowIndex, colIndex, value) {
    try {
      updateCell(rowIndex, colIndex, value);
      stopEditing();
    } catch (error) {
      console.error(error);
    }
  }

  let selectedCellAddress = "";
  let debug = false;

  function toggleDebug() {
    debug = !debug;
  }
</script>

<div class="flex h-full w-full flex-1 flex-col gap-0">
  <div class="flex h-10 w-full flex-row items-center gap-6 px-4">
    <div class="flex items-center justify-start gap-4">
      <!-- Logo and Title -->
      <div class="inline-flex items-center space-x-2">
        <Music size="16" class="text-gray-700" />
        <span class="text-sm font-semibold text-gray-800">BeatSheet</span>
      </div>

      <!-- Transport Controls -->
      <div class="flex items-center gap-1">
        <button class="toolbar-button p-1.5" on:click={toggleDebug}> Debug</button>
        {#if isPlaying}
          <button class="toolbar-button p-1.5" on:click={handlePause}>
            <Pause size="16" />
          </button>
        {:else}
          <button class="toolbar-button p-1.5" on:click={handlePlay}>
            <Play size="16" />
          </button>
        {/if}
        <button class="toolbar-button p-1.5" on:click={handleStop}>
          <Square size="16" />
        </button>
      </div>
    </div>

    <!-- Tempo Input -->
    <div class=" flex items-center gap-2">
      <span class="text-xs font-medium text-gray-700">BPM</span>
      <input
        type="number"
        bind:value={$globalTempo}
        min="1"
        max="300"
        class="toolbar-input"
        on:change={() => evaluateAllCells()}
      />
    </div>

    <!-- Spacer -->
    <div class="flex-grow"></div>

    <!-- File Import/Export -->
    <div class="flex items-center gap-1">
      <button class="toolbar-button" on:click={saveToLocalStorage}>
        <Save size="16" />
        Save
      </button>
      <button class="toolbar-button" on:click={loadFromLocalStorage}>
        <Save size="16" />
        Restore
      </button>
      <button class="toolbar-button" on:click={resetGrid}>
        <Trash2 size="16" />
        Clear
      </button>
    </div>
    <div class="flex items-center gap-1">
      <button class="toolbar-button" on:click={exportToFile}>
        <Download size="16" />
        Export
      </button>
      <label class="toolbar-button">
        <Upload size="16" />
        Import
        <input type="file" accept=".json" on:change={importFromFile} class="hidden" />
      </label>
    </div>

    <!-- Test Data Fill -->
    <div class="flex items-center gap-1">
      <button class="toolbar-button" on:click={fillWaveTestData}>Waves</button>
      <button class="toolbar-button" on:click={fillAdsrData}>ADSR</button>
      <button class="toolbar-button" on:click={fillMiscTestData}>Misc</button>
      <button class="toolbar-button" on:click={fillBasicFormulaTestData}>Basic</button>
      <button class="toolbar-button" on:click={fillAudioTestData}>Audio</button>
    </div>
  </div>
  <div class="h-full flex-1 overflow-auto overscroll-contain bg-white">
    <table class="bg-white">
      <thead>
        <tr>
          <th class="row-header tabular-nums">
            <div class="font-mono text-xs font-normal tracking-wide">
              <span>{selectedCellAddress}</span>
            </div>
          </th>
          {#each Array($evaluatedGridData[0]?.length) as _, colIndex}
            <th class="row-header tabular-nums">{getColumnLabel(colIndex)}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each $evaluatedGridData as row, rowIndex}
          <tr>
            <th>{rowIndex + 1}</th>
            {#each row as cell, colIndex (`cell-${rowIndex}-${colIndex}`)}
              <td
                class={classNames("cell-wrapper hover:bg-blue-50", {
                  "cell-wrapper--formula": typeof cell === "string" && cell.startsWith("="),
                  "cell-wrapper--waveform": typeof cell === "object" && cell.type === "waveform",
                  "cell-wrapper--oscillator": typeof cell === "object" && cell.type === "oscillator",
                  "cell-wrapper--beat": typeof cell === "object" && cell.type === "beat",
                  "cell-wrapper--metronome": typeof cell === "object" && cell.type === "metronome",
                  "cell-wrapper--time": typeof cell === "object" && cell.type === "time",
                  "cell-wrapper--empty": cell === "" || cell === undefined || cell === null,
                })}
                on:mouseenter={() => (selectedCellAddress = getCellAddress(rowIndex, colIndex))}
                on:click={() => startEditing(rowIndex, colIndex)}
              >
                {#if debug && cell !== ""}
                  <div class="w-full bg-black text-xs text-white">
                    <div class="font-bold text-emerald-300">{cell.type || typeof cell}</div>
                    <div>{getRawCellValue(rowIndex, colIndex)} => {cell?.value ?? "?"}</div>
                  </div>
                {/if}

                {#if editingCell && editingCell.rowIndex === rowIndex && editingCell.colIndex === colIndex}
                  <input
                    type="text"
                    class="w-full p-1"
                    value={getRawCellValue(rowIndex, colIndex)}
                    on:blur={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    on:keydown={(e) => e.key === "Enter" && handleCellChange(rowIndex, colIndex, e.target.value)}
                    on:keyup={(e) => e.key === "Escape" && stopEditing()}
                    placeholder={getCellAddress(rowIndex, colIndex)}
                    bind:this={inputRef}
                  />
                {:else if typeof cell === "object"}
                  {#if cell?.type === "error"}
                    <ErrorCell cell={cell} row={rowIndex} col={colIndex} raw={getRawCellValue(rowIndex, colIndex)} />
                  {:else if cell?.type === "waveform"}
                    <WaveformCell freq={cell.freq} amplitude={cell.amplitude} phase={cell.phase} time={$time} />
                  {:else if cell?.type === "oscillator"}
                    <OscillatorCell
                      waveType={cell.waveType}
                      freq={cell.freq}
                      amplitude={cell.amplitude}
                      phase={cell.phase}
                      time={$time}
                    />
                  {:else if cell?.type === "beat"}
                    <BeatCell bpm={cell.bpm} pattern={cell.pattern} time={$time} trigger={cell.trigger} />
                  {:else if cell?.type === "metronome"}
                    <MetronomeCell bpm={cell.bpm} time={$time} />
                  {:else if cell?.type === "time"}
                    <TimeCell time={$time} />
                  {:else if cell?.type === "adsr"}
                    <ADSRCell
                      attack={cell.attack}
                      decay={cell.decay}
                      sustain={cell.sustain}
                      release={cell.release}
                      time={$time}
                    />
                  {:else if cell?.type === "audio"}
                    <AudioCell frequency={cell.frequency} subscribe={cell.subscribe} waveType={cell.waveType} />
                  {/if}
                {:else}
                  <div class="p-1">{cell}</div>
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
