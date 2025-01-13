<script>
  export let time = 0;
  export let attack;
  export let decay;
  export let sustain;
  export let release;

  // Increase the sample size for better precision
  $: points = computePoints(attack, decay, sustain, release);
  $: percentage = (time / (attack + decay + 1 + release)) * 100;

  function computePoints(attack, decay, sustain, release) {
    const width = 100;
    const height = 50;
    const totalTime = attack + decay + 1 + release;
    const points = [];
    const samples = 100; // Use a higher sample size

    for (let i = 0; i < samples; i++) {
      const t = (i / samples) * totalTime;
      let y;

      if (t < attack) {
        y = t / attack;
      } else if (t < attack + decay) {
        y = 1 - ((t - attack) / decay) * (1 - sustain);
      } else if (t < attack + decay + 1) {
        y = sustain;
      } else {
        y = sustain * (1 - (t - (attack + decay + 1)) / release);
      }

      points.push({ x: (t / totalTime) * width, y: height - y * height });
    }

    return points;
  }

  // Function to convert points to SVG path
  function pointsToPath(points) {
    return points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ");
  }
</script>

<div class="--h-10 relative w-full bg-slate-50">
  <svg viewBox="0 0 100 50" width="100" height="50" class="h-full max-h-10 w-full" preserveAspectRatio="xMinYMid meet">
    <path d={pointsToPath(points)} stroke="#007bff" stroke-width="2" fill="none" vector-effect="non-scaling-stroke" />
  </svg>
</div>
