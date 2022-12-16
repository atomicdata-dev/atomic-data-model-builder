<script lang="ts">
  export let name: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let disabled: boolean | undefined = undefined;
  export let required: boolean | undefined = undefined;
  export let value: string | undefined = undefined;
</script>

<select {name} {id} {disabled} {required} on:change bind:value>
  <slot />
</select>

<style>
  select {
    background-color: var(--t-bg-light);
    color: var(--t-text);
    border: none;
    border-radius: var(--radius-2);
  }

  select:disabled {
    background-color: var(--t-bg-light-2);
    color: var(--t-text-light);
  }
</style>
