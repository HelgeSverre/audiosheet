<script>
  import { onDestroy, onMount } from "svelte";
  import { createOscillator, getAudioContext } from "../lib/audio.ts";
  import { Pause, Play } from "lucide-svelte";
  import classNames from "classnames";

  export let frequency = 440;
  export let subscribe;
  export let waveType = "sine";

  let trigger = false;

  let audioContext;
  let oscillator;
  let gainNode;

  function playSound() {
    if (oscillator) {
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
    }
  }

  onMount(() => {
    audioContext = getAudioContext();
    const audio = createOscillator(frequency, waveType);
    oscillator = audio.oscillator;
    gainNode = audio.gainNode;
  });

  $: {
    subscribe((value) => {
      trigger = value;

      if (trigger) {
        playSound();
      }
    });
  }

  onDestroy(() => {
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
    }
    if (gainNode) {
      gainNode.disconnect();
    }
  });
</script>

<div class="min-w-44">
  <div
    class={classNames(
      "inline-flex h-full w-full items-center justify-between bg-yellow-300 p-1 px-2 text-black duration-500 ease-out",
      {
        "bg-yellow-400": trigger,
      },
    )}
  >
    <span class="flex items-center">
      {#if trigger}
        <Play size="12" class="animate-ping text-gray-800" />
      {:else}
        <Pause size="12" class="text-gray-800" />
      {/if}
    </span>
    <div class="flex flex-row items-center justify-end gap-2 text-sm font-medium tabular-nums">
      <span class="font-bold">{waveType}</span>

      <div>@ {frequency} Hz</div>
    </div>
  </div>
</div>
