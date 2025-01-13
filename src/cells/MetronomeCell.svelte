<script>
  import classNames from "classnames";

  export let bpm = 120;
  export let time = 0;

  $: beatDuration = 60 / bpm;
  $: currentBeat = Math.floor((time % (beatDuration * 4)) / beatDuration);
</script>

<div class="w-40">
  <div class="flex items-center justify-between gap-2 whitespace-nowrap bg-slate-800 px-2 py-1 text-white">
    <div class="flex items-center gap-1">
      {#each Array(4) as _, index}
        <div
          class={classNames("size-3 rounded-sm duration-300 ease-out", {
            "bg-blue-500": index === currentBeat,
            "bg-gray-600": index !== currentBeat,
          })}
        ></div>
      {/each}
    </div>
    <div class="flex flex-1 items-center justify-end gap-px">
      <span class="text-sm font-bold text-gray-200">
        {bpm}
      </span>
      <span class="text-xs font-medium tracking-tight text-gray-400">BPM</span>
    </div>
  </div>
</div>
