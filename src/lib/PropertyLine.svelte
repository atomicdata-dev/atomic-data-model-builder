<script lang="ts">
  import { Datatype, Property, urls } from '@tomic/lib';
  import { createEventDispatcher } from 'svelte';
  import { getResource, getValue, store } from '@tomic/svelte';
  import trash2outline from '../assets/icons/eva/trash-2-outline.svg?raw';
  import options from '../assets/icons/eva/options-2-outline.svg?raw';
  import IconButton from './IconButton.svelte';
  import SelectInput from './SelectInput.svelte';
  import { externalProperties } from './stores/collections';
  import TextInput from './TextInput.svelte';
  import Dialog from './Dialog/Dialog.svelte';
  import ClassSelect, { type ClassItem } from './ClassSelect.svelte';
  import Button from './Button.svelte';
  import { localURL } from './stores/localURL';
  import { generateRandomSubject } from './randomSubject';
  import { classesStore } from './stores/classes';

  const dispatch = createEventDispatcher<{
    delete: string;
  }>();

  export let subject: string;
  let isExternal: boolean;
  let hasOptions = false;
  let showDialog = false;

  let resource = getResource(subject);

  let shortname = getValue<string>(resource, urls.properties.shortname);
  let description = getValue<string>(resource, urls.properties.description);
  let datatype = getValue<string>(resource, urls.properties.datatype);
  let classType = getValue<string>(resource, urls.properties.classType);

  $: isExternal = $externalProperties.includes(subject);

  $: if (
    !isExternal &&
    ($datatype === Datatype.ATOMIC_URL || $datatype === Datatype.RESOURCEARRAY)
  ) {
    hasOptions = true;
  } else {
    hasOptions = false;
    $classType = undefined;
  }

  const createNewLocalClass = async (name: string): Promise<string> => {
    const newSubject = generateRandomSubject($localURL);

    const resource = $store.getResourceLoading(newSubject, {
      newResource: true,
    });

    await resource.set(urls.properties.shortname, name, $store);
    await resource.set(urls.properties.description, '', $store);
    await resource.set(urls.properties.isA, [urls.classes.class], $store);
    await resource.set(urls.properties.parent, $localURL, $store);

    // Add the resource to the local properties store so other components can see it too.
    $classesStore = [...$classesStore, newSubject];

    return newSubject;
  };

  const selectClassType = async (e: CustomEvent<ClassItem>) => {
    const { subject, label } = e.detail;

    if (subject === '') {
      // If the subject is not set yet it means it was just created and we will add it to the store.
      $classType = await createNewLocalClass(label);
    } else {
      $classType = subject;
    }
  };

  const types = Object.keys(Datatype);
</script>

<form class="wrapper">
  <TextInput
    bind:value={$shortname}
    placeholder="shortname"
    disabled={isExternal}
  />
  <TextInput
    bind:value={$description}
    placeholder="description"
    disabled={isExternal}
    required
  />
  <SelectInput name="type" bind:value={$datatype} disabled={isExternal}>
    {#each types as type}
      <option value={Datatype[type]} selected={Datatype[type] === $datatype}>
        {type}
      </option>
    {/each}
  </SelectInput>
  <IconButton
    on:click={() => (showDialog = true)}
    icon={options}
    disabled={!hasOptions}
    title="Configure"
  />
  <IconButton
    on:click={() => dispatch('delete', subject)}
    icon={trash2outline}
    title="Remove property"
  />
</form>
{#if hasOptions}
  <Dialog bind:show={showDialog} overflow>
    <svelte:fragment slot="title">
      <h1>Configure {$shortname}</h1>
    </svelte:fragment>
    <svelte:fragment slot="content">
      <label for="">Constrain to class</label>
      <ClassSelect on:select={selectClassType} selectedSubject={$classType} />
    </svelte:fragment>
    <svelte:fragment slot="controls">
      <Button on:click={() => (showDialog = false)}>Done</Button>
    </svelte:fragment>
  </Dialog>
{/if}

<style>
  .wrapper {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.3rem;
  }

  @media (max-width: 900px) {
    .wrapper {
      border-bottom: 1px solid var(--t-bg-light);
      flex-wrap: wrap;
      padding-bottom: 0.5rem;
      margin-bottom: 0.5rem;
    }
  }
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
</style>
