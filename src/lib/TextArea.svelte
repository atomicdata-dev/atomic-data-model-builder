<script lang="ts">
  export let value: string = '';
  export let id: string = '';
  export let name: string = '';
  export let required: boolean = false;
</script>

<textarea {name} {id} {required} cols="30" rows="10" bind:value />

<style>
  textarea {
    background-color: var(--t-bg-light);
    border: none;
    border-radius: var(--radius-2);
    color: var(--t-text);
    padding: 1rem;
    height: 100%;
    resize: none;
  }
</style>
