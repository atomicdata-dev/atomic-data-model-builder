<script lang="ts">
  import Icon from 'svelte-icon/Icon.svelte';

  export let icon: string;
  export let size: string = '1rem';
  export let disabled: boolean = false;
  export let title: string;
</script>

<button on:click {disabled} {title} type="button">
  <Icon data={icon} {size} stroke="none" />
</button>

<style>
  button {
    display: flex;
    aspect-ratio: 1/1;
    align-items: center;
    background-color: transparent;
    border: none;
    color: var(--t-text);
    cursor: pointer;
    border-radius: var(--radius-2);
    transition: background-color 100ms ease-in-out, color 100ms ease-in-out;
  }

  button:hover:not(:disabled),
  button:focus:not(:disabled) {
    background-color: var(--t-bg-light);
  }

  button:disabled {
    cursor: auto;
    color: var(--t-bg-light);
  }
</style>
