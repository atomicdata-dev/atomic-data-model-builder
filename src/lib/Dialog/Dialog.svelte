<script lang="ts">
  import IconButton from '../IconButton.svelte';
  import close from '../../assets/icons/eva/close-outline.svg?raw';

  export let show: boolean = false;
  export let overflow: boolean = false;

  let dialog: HTMLDialogElement;

  $: if (dialog && show) {
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }

  $: if (dialog && !show) {
    dialog.close();
    document.body.style.overflow = 'visible';
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
  <div class="content-wrapper" class:overflow={!overflow}>
    <slot name="content" />
  </div>
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
    max-height: 90vh;
    overscroll-behavior: contain;
    max-height: 90dvh;
  }

  dialog:modal {
    overflow: visible;
  }
  dialog::backdrop {
    background-color: rgba(0 0 0 / 0.5);
    backdrop-filter: blur(3px);
  }

  .content-wrapper {
    max-height: 60vh;
  }

  .overflow {
    overflow-y: auto;
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
