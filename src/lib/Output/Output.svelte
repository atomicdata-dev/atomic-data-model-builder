<script lang="ts">
  import Highlight from 'svelte-highlight';
  import json from 'svelte-highlight/languages/json';
  import atomOneDark from 'svelte-highlight/styles/atom-one-dark';
  import { store } from '../../atomic/ADStore';
  import { classesStore } from '../stores/classes';
  import { propertiesStore } from '../stores/properties';
  import { buildJSON } from './buildJson';

  const classSubscriptions = new Set<string>();
  const propertySubscriptions = new Set<string>();

  let outputText = 'Add some classes and properties to see the output.';
  let buildForImporter = false;
  let waringMessage = '';

  const update = () => {
    outputText = buildJSON(
      $classesStore,
      $store,
      $propertiesStore,
      buildForImporter,
    );

    if (document.querySelectorAll(':invalid').length > 0) {
      waringMessage = 'Warning: Some fields are invalid.';
    } else {
      waringMessage = '';
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
</script>

<svelte:head>
  {@html atomOneDark}
</svelte:head>
<section>
  <h2>Output</h2>
  <p class="waring">{waringMessage}</p>
  <input
    type="checkbox"
    id="import-toggle"
    bind:checked={buildForImporter}
    on:input={handleCheck}
  />
  <label for="import-toggle">Importer compatible JSON</label>
  <Highlight language={json} code={outputText} />
</section>

<style>
  .waring {
    color: orange;
  }
</style>
