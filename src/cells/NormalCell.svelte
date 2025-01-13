<script>
  import { createEventDispatcher } from "svelte";

  export let value;
  export let placeholder;

  const dispatch = createEventDispatcher();

  function onChange(e) {
    const newValue = e.target.value;
    value = newValue;
    dispatch("change", newValue);
  }
</script>

<div class="flex flex-row">
  <input type="text" class="w-auto" value={value} on:blur={(e) => onChange(e)} placeholder={placeholder} />
</div>
