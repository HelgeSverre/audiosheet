<script>
  import { Clock } from "lucide-svelte";

  export let time = 0;
</script>

<div class="min-w-20 max-w-full">
  <div class="inline-flex h-full w-full items-center justify-between bg-emerald-800 p-1 px-2 text-white">
    <span class="flex items-center">
      <Clock size="12" class="text-gray-200" />
    </span>
    <span class="text-xs font-medium tabular-nums text-gray-200">
      {time.toFixed(2)}
    </span>
  </div>
</div>
