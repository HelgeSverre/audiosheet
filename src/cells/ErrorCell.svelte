<script>
  export let cell;
  export let row;
  export let col;
  export let raw;
</script>

<div class="bg-red-50 outline outline-offset-1 outline-red-500">
  <div
    class="line-clamp-2 text-balance p-1 px-2 font-mono text-xs font-medium leading-tight tracking-tight text-red-500 hover:line-clamp-none"
    title={cell.error}
  >
    {cell.error}
  </div>
  <div class="bg-red-100 text-white">
    <pre class="p-1 px-2 font-mono text-xs text-red-500">col:{col} row: {row}</pre>
    <pre class="p-1 px-2 font-mono text-xs text-red-500">{raw}</pre>
  </div>
</div>
