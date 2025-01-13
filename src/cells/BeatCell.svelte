<script>
  import classNames from "classnames";

  export let bpm = 1200;
  export let pattern = "- - - -";
  export let trigger;
  export let time = 0;

  $: beatDuration = 60 / bpm;
  $: currentBeat = Math.floor((time % (beatDuration * pattern.length)) / beatDuration);
  $: isActive = pattern[currentBeat] === "x";

  $: timeToNextBeat = beatDuration - (time % beatDuration);
  $: progressPercentage = ((beatDuration - timeToNextBeat) / beatDuration) * 100;

  $: {
    currentBeat != null && trigger(isActive);
  }
</script>

<div
  class={classNames("flex min-w-60 flex-col gap-1 border-2 p-1  duration-100 ease-in-out  ", {
    "border-blue-500 bg-blue-50": isActive,
    "border-transparent": !isActive,
  })}
>
  <div class="grid w-auto grid-cols-8 gap-1">
    {#each pattern.split("") as step, index}
      <div
        class={classNames(
          "relative inline-flex  items-center justify-center text-xs font-bold ring-2 transition-all duration-75 ease-in-out",
          {
            "bg-black text-white": step === "x",
            "bg-gray-300": step !== "x",
            "ring-2 ring-blue-500": index === currentBeat,
            "ring-transparent": index !== currentBeat,
          },
        )}
      >
        {#if index === currentBeat}
          <div
            class="absolute inset-x-0 bottom-0 h-1 bg-blue-500"
            style="width: {progressPercentage}%; transition: width 100ms linear;"
          ></div>
        {/if}
        <span class="relative z-10 text-[8px]">{index + 1}</span>
      </div>
    {/each}
  </div>
</div>
