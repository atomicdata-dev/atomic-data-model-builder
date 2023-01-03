<script lang="ts">
  import Highlight from 'svelte-highlight';
  import json from 'svelte-highlight/languages/json';
  import atomOneDark from 'svelte-highlight/styles/atom-one-dark';
  import { fade } from 'svelte/transition';
  import { store } from '@tomic/svelte';
  import { classesStore } from '../stores/classes';
  import { propertiesStore } from '../stores/properties';
  import { buildJSON } from './buildJson';
  import { exportType } from '../stores/config';
  import Button from '../Button.svelte';
  import { exportToServer } from './exportToServer';

  const classSubscriptions = new Set<string>();
  const propertySubscriptions = new Set<string>();

  let outputText = 'Add some classes and properties to see the output.';
  let buildForImporter = false;
  let warningMessage = '';

  $: if ($exportType === 'remote') {
    buildForImporter = false;
    update();
  }

  const update = () => {
    outputText = buildJSON(
      $classesStore,
      $store,
      $propertiesStore,
      buildForImporter,
    );

    if (document.querySelectorAll(':invalid').length > 0) {
      warningMessage = 'Warning: Some required fields are empty.';
    } else {
      warningMessage = '';
    }
  };

  const manageSubscribe = (subjects: string[], subscriptions: Set<string>) => {
    for (const item of subjects) {
      if (!subscriptions.has(item)) {
        $store.subscribe(item, update);
      }
    }

    // cleanup
    for (const subscription of subscriptions) {
      if (!subjects.includes(subscription)) {
        $store.unsubscribe(subscription, update);
      }
    }
  };

  $: {
    manageSubscribe($classesStore, classSubscriptions);
    manageSubscribe($propertiesStore, propertySubscriptions);
  }

  // @ts-ignore
  const handleCheck = (e: FormEventHandler<HTMLInputElement>) => {
    buildForImporter = (e.target as HTMLInputElement).checked;
    update();
  };

  const handleExportToServer = () => {
    const localSubjects = [...$classesStore, ...$propertiesStore];

    exportToServer($store, localSubjects);
  };
</script>

<svelte:head>
  {@html atomOneDark}
</svelte:head>
<section>
  <h2>Output</h2>
  {#if warningMessage}
    <p class="waring" transition:fade={{ duration: 100 }}>{warningMessage}</p>
  {/if}
  {#if $exportType === 'remote'}
    <Button disabled={warningMessage.length > 0} on:click={handleExportToServer}
      >Export to server</Button
    >
  {:else}
    <input
      type="checkbox"
      id="import-toggle"
      bind:checked={buildForImporter}
      on:input={handleCheck}
    />
    <label for="import-toggle">Importer compatible JSON</label>
  {/if}
  <Highlight language={json} code={outputText} />
</section>

<style>
  .waring {
    color: orange;
  }
</style>
