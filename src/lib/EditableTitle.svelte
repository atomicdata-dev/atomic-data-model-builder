<script lang="ts">
  import Icon from 'svelte-icon';
  import editoutline from '../assets/icons/eva/edit-outline.svg?raw';
  import TextInput from './TextInput.svelte';
  import { toSlug } from './toSlug';
  export let title: string;

  $: if (title !== toSlug(title)) {
    title = toSlug(title);
  }

  let editing: boolean = false;

  const enableEditing = () => {
    editing = true;
  };

  const disableEditing = () => {
    editing = false;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      disableEditing();
    }
  };
</script>

{#if editing}
  <TextInput
    bind:value={title}
    on:blur={disableEditing}
    on:keydown={handleKeyDown}
    autofocus
  />
{:else}
  <button on:click={enableEditing}>
    <h2>
      {title}
    </h2>
    <span class="icon">
      <Icon data={editoutline} fill="white" />
    </span>
  </button>
{/if}

<style>
  button {
    display: flex;
    background-color: transparent;
    padding: 0;
    border: none;
    color: var(--t-text);
    gap: 0.5rem;
    align-items: center;
    cursor: pointer;
    padding: 0;
    margin: 0;
  }

  h2 {
    padding: 0;
    margin: 0;
  }

  .icon {
    display: flex;
    align-items: center;
    font-weight: 400 !important;
    transform: scale(0);
    transition: transform 0.2s ease-in-out;
  }

  button:hover .icon {
    transform: scale(1);
  }
</style>
