<script lang="ts">
  import classNames from "classnames";
  import type { SequenceCell } from "../lib/types";

  export let cell: SequenceCell;
  export let time: number = 0;

  $: beatDuration = 60 / cell.bpm;
  $: currentStep = Math.floor(time / beatDuration) % cell.totalSteps;
  $: timeInStep = time % beatDuration;
  $: progress = (timeInStep / beatDuration) * 100;

  $: {
    currentStep != null && cell.trigger(currentStep);
  }
</script>

<div class="flex min-w-60 flex-col gap-1 border-2 p-1 duration-100 ease-in-out">
  <div class="flex items-center justify-between text-xs">
    <span class="font-medium">{cell.metadata.mode} @ {cell.bpm} BPM</span>
    <span class="tabular-nums">Step {currentStep + 1}/{cell.totalSteps}</span>
  </div>

  <div class="grid auto-cols-fr grid-flow-col gap-1">
    {#each cell.values as value, index}
      <div
        class={classNames(
          "relative flex h-8 items-center justify-center rounded border text-xs font-medium transition-colors",
          {
            "border-blue-500 bg-blue-100": index === currentStep,
            "border-gray-200": index !== currentStep,
            "opacity-50": value === null,
          },
        )}
      >
        {#if index === currentStep}
          <div
            class="absolute inset-x-0 bottom-0 h-1 bg-blue-500"
            style="width: {progress}%; transition: width 100ms linear;"
          />
        {/if}
        <span class="relative z-10">{value ?? "-"}</span>
      </div>
    {/each}
  </div>
</div>
