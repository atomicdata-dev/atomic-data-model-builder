<script lang="ts">
  import { get } from 'svelte/store';
  import Button from './Button.svelte';
  import Dialog from './Dialog/Dialog.svelte';
  import { externalSources } from './stores/collections';
  import { localURL } from './stores/localURL';
  import TextArea from './TextArea.svelte';
  import TextInput from './TextInput.svelte';

  export let show: boolean = false;

  let sourcesValue: string = get(externalSources).join('\n');

  const handleDone = () => {
    const sources = sourcesValue.split('\n');

    const filtered = sources.filter(source => {
      try {
        new URL(source);
        return true;
      } catch (e) {
        return false;
      }
    });

    $externalSources = filtered;

    show = false;
  };

  const handleLocalURLBlur = () => {
    if (!$localURL.endsWith('/')) {
      $localURL = $localURL + '/';
    }
  };
</script>

<Dialog bind:show>
  <svelte:fragment slot="title">
    <h1>Config</h1>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <form>
      <div class="form-field">
        <label for="localURL">Local URL:</label>
        <TextInput
          id="localURL"
          bind:value={$localURL}
          on:blur={handleLocalURLBlur}
        />
        <p class="helper">
          The url used to generate subjects for new classes and properties
        </p>
      </div>
      <div class="form-field">
        <label for="data-sources">Data Sources:</label>
        <TextArea id="data-sources" bind:value={sourcesValue} />
        <p class="helper">
          Atomic data servers to pull property and class data from. (seperated
          by newline)
        </p>
      </div>
    </form>
  </svelte:fragment>
  <svelte:fragment slot="controls">
    <Button on:click={handleDone}>Done</Button>
  </svelte:fragment>
</Dialog>

<style>
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  label {
    font-weight: bold;
  }

  .helper {
    color: var(--t-text-light);
  }
</style>
