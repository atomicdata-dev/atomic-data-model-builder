<script lang="ts">
  import { Datatype, urls } from '@tomic/lib';
  import plus from '../assets/icons/eva/plus-outline.svg?raw';
  import { store } from '../atomic/ADStore';
  import IconButton from './IconButton.svelte';
  import PropertyLine from './PropertyLine.svelte';
  import PropertySelect, { type Item } from './PropertySelect.svelte';
  import { generateRandomSubject } from './randomSubject';
  import { localURL } from './stores/localURL';
  import { propertiesStore } from './stores/properties';

  export let properties: string[] = [];
  let selectorActive = false;

  const createNewLocalProperty = async (name: string): Promise<string> => {
    const newSubject = generateRandomSubject($localURL);

    const resource = $store.getResourceLoading(newSubject, {
      newResource: true,
    });

    await resource.set(urls.properties.shortname, name, $store);
    await resource.set(urls.properties.datatype, Datatype.STRING, $store);
    await resource.set(urls.properties.isA, [urls.classes.property], $store);
    await resource.set(urls.properties.parent, $localURL, $store);

    // Add the resource to the local properties store so other components can see it too.
    $propertiesStore = [...$propertiesStore, newSubject];

    return newSubject;
  };

  const newProperty = async (e: CustomEvent<Item>) => {
    const { subject, label } = e.detail;

    if (subject === '') {
      // If the subject is not set yet it means it was just created and we will add it to the store.
      properties = [...properties, await createNewLocalProperty(label)];
    } else {
      properties = [...properties, subject];
    }

    selectorActive = false;
  };

  const deleteProperty = (e: CustomEvent<string>) => {
    properties = properties.filter(p => p !== e.detail);
  };
</script>

<ul>
  {#each properties as property (property)}
    <li>
      <PropertyLine subject={property} on:delete={deleteProperty} />
    </li>
  {/each}
  <li>
    {#if selectorActive}
      <PropertySelect
        on:select={newProperty}
        on:blur={() => (selectorActive = false)}
      />
    {:else}
      <IconButton
        icon={plus}
        on:click={() => (selectorActive = true)}
        title="Add property"
      />
    {/if}
  </li>
</ul>

<style>
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
</style>
