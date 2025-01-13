<script>
  export let freq = 1;
  export let amplitude = 1;
  export let phase = 0;
  export let time;

  let containerHeight;
  let svgElement;

  $: points = computePoints(time, containerHeight);
  $: viewBox = `0 0 100 ${containerHeight || 30}`;

  function computePoints(currentTime, height) {
    if (!height) return "";

    const samples = 100;
    const width = 100;
    const effectiveHeight = height - 4; // Subtract 4 to give some padding
    const midPoint = effectiveHeight / 2;

    return Array.from({ length: samples }, (_, i) => {
      const x = (i / (samples - 1)) * width;
      const t = (i / (samples - 1) + currentTime) % 1;
      let y = Math.sin(2 * Math.PI * freq * t + phase);

      // Clamp y value between -1 and 1, then scale to fit within the effectiveHeight
      y = Math.max(-1, Math.min(1, y * amplitude));
      y = y * midPoint + midPoint + 2; // Add 2 to account for the padding

      return `${x},${y}`;
    }).join(" ");
  }
</script>

<div class="h-6 w-full min-w-[100px]" bind:clientHeight={containerHeight}>
  <svg bind:this={svgElement} viewBox={viewBox} preserveAspectRatio="none">
    <polyline points={points} fill="none" stroke="#007bff" stroke-width="2" vector-effect="non-scaling-stroke" />
  </svg>
</div>

<style>
  svg {
    width: 100%;
    height: 100%;
  }
</style>
