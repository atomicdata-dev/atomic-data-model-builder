<script lang="ts">
  import IconButton from '../IconButton.svelte';
  import close from '../../assets/icons/eva/close-outline.svg?raw';

  export let show: boolean = false;
  let dialog: HTMLDialogElement;

  $: if (dialog && show) {
    dialog.showModal();
  }

  $: if (dialog && !show) {
    dialog.close();
  }

  const closeDialog = () => {
    show = false;
  };
</script>

<dialog bind:this={dialog}>
  <div class="titlebar">
    <slot name="title" />
    <IconButton icon={close} on:click={closeDialog} title="close" />
  </div>
  <slot name="content" />
  <div class="line" />
  <div class="controls">
    <slot name="controls" />
  </div>
</dialog>

<style>
  dialog {
    background-color: var(--t-bg);
    border-radius: var(--radius-2);
    width: min(100%, 60rem);
    padding: 1rem;
    color: var(--t-text);
    border: none;
    box-shadow: var(--shadow-4);
  }

  dialog:modal {
    overflow: visible;
  }
  dialog::backdrop {
    background-color: rgba(0 0 0 / 0.5);
    backdrop-filter: blur(3px);
  }

  .titlebar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .line {
    margin-block: 1rem;
    border-bottom: 1px solid var(--t-bg-light);
  }
  .controls {
    display: flex;
    justify-content: end;
  }
</style>
