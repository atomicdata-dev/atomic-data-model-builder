<script lang="ts">
  import { urls } from '@tomic/lib';
  import { getResource, getValue } from '@tomic/svelte';
  import { createEventDispatcher } from 'svelte';
  import Icon from 'svelte-icon';
  import cubeoutline from '../assets/icons/eva/cube-outline.svg?raw';
  import trash2outline from '../assets/icons/eva/trash-2-outline.svg?raw';
  import EditableTitle from './EditableTitle.svelte';
  import IconButton from './IconButton.svelte';
  import PropList from './PropList.svelte';
  import { localURL } from './stores/localURL';
  import TextArea from './TextArea.svelte';
  const dispatch = createEventDispatcher<{ delete: string }>();
  export let subject: string;

  let resource = getResource(subject, {
    newResource: true,
  });

  let name = getValue<string>(resource, urls.properties.shortname);
  let description = getValue<string>(resource, urls.properties.description);
  let requiredProps = getValue<string[]>(resource, urls.properties.requires);
  let recommendedProps = getValue<string[]>(
    resource,
    urls.properties.recommends,
  );
  let isA = getValue<string[]>(resource, urls.properties.isA);
  let parent = getValue<string>(resource, urls.properties.parent);

  isA.set([urls.classes.class]);
  parent.set($localURL);

  $: if ($name === undefined) {
    $name = 'untitled';
  }
</script>

<div class="wrapper">
  <div style="grid-area: title" class="title">
    <Icon data={cubeoutline} />
    <EditableTitle bind:title={$name} />
    <span class="delete-icon-wrapper">
      <IconButton
        icon={trash2outline}
        on:click={() => dispatch('delete', subject)}
        title="Delete class"
      />
    </span>
  </div>
  <div style="grid-area: requires" class="form-container">
    <h3>Requires</h3>
    <PropList bind:properties={$requiredProps} />
  </div>
  <div style="grid-area: recommends" class="form-container">
    <h3>Recommends</h3>
    <PropList bind:properties={$recommendedProps} />
  </div>
  <div style="grid-area: description" class="form-container">
    <h3>Description</h3>
    <TextArea bind:value={$description} required />
  </div>
</div>

<style>
  .wrapper {
    display: grid;
    grid-template-areas:
      'title title'
      'requires description'
      'recommends description';
    grid-template-columns: 1fr 1fr;
    padding: 1rem;
    gap: 1rem;
    border: 1px solid var(--t-text);
    border-radius: var(--radius-2);
  }

  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .delete-icon-wrapper {
    margin-left: auto;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 600px) {
    .wrapper {
      grid-template-areas:
        'title'
        'requires'
        'recommends'
        'description';
      grid-template-columns: 1fr;
    }
  }
</style>
