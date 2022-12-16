<script lang="ts">
  export let value: string;
  export let placeholder: string | undefined = undefined;
  export let disabled: boolean | undefined = undefined;
  export let required: boolean | undefined = undefined;
  export let id: string | undefined = undefined;
</script>

<input
  type="text"
  bind:value
  {placeholder}
  {disabled}
  {required}
  {id}
  on:blur
/>

<style>
  input {
    background-color: var(--t-bg-light);
    color: var(--t-text);
    border: none;
    padding: 0.4rem;
    border-radius: var(--radius-2);
  }

  input:disabled {
    background-color: var(--t-bg-light-2);
    color: var(--t-text-light);
  }
</style>
