<script lang="ts" context="module">
  export type Item = {
    label: string;
    subject: string;
    datatype: string;
    created?: boolean;
  };
</script>

<script lang="ts">
  import { Property, urls, Datatype } from '@tomic/lib';
  // https://github.com/rob-balfre/svelte-select
  import Select from 'svelte-select';
  import { createEventDispatcher } from 'svelte';
  import { store } from '../atomic/ADStore';
  import { flattenObj } from './flattenObj';
  import { externalProperties } from './stores/collections';
  import { toSlug } from './toSlug';
  import { propertiesStore } from './stores/properties';
  const dispatch = createEventDispatcher<{ select: Item }>();

  const typeMap = Object.entries(Datatype).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as Record<string, string>);

  // WARNING insanity ahead:
  const allProperties = flattenObj(urls.properties);

  delete allProperties.getAll;
  // End of insanity

  let items: Item[] = [];
  let filterText = '';

  $: if (filterText !== toSlug(filterText)) {
    filterText = toSlug(filterText);
  }

  $: {
    Promise.all(
      [...$propertiesStore, ...$externalProperties].map(subject => {
        return $store.getResourceAsync(subject);
      }),
    ).then(props => {
      items = props.map(resource => ({
        label: resource.get(urls.properties.shortname) as string,
        subject: resource.getSubject() as string,
        datatype: resource.get(urls.properties.datatype) as string,
      }));
    });
  }

  $: {
    if (filterText.length > 0) {
      // Add a create option to the items.
      items = [
        {
          subject: '',
          label: filterText,
          created: true,
          datatype: Datatype.STRING,
        },
        ...items.filter(i => !i.created),
      ];
    } else {
      items = items.filter(i => !i.created);
    }
  }

  const handleSelect = (e: CustomEvent<Item>) => {
    items = items.map(i => {
      delete i.created;
      return i;
    });

    dispatch('select', e.detail);
  };
</script>

<div class="wrapper">
  <Select
    {items}
    placeholder="Select or create property"
    bind:filterText
    on:change={handleSelect}
    on:blur
    class="property-select"
  >
    <div class="item" slot="item" let:item>
      {item.created ? 'Create' : ''}
      {item.label}
      <span class="datatype">
        {typeMap[item.datatype]}
      </span>
    </div>
  </Select>
</div>

<style>
  .wrapper {
    color: black;
  }
  .item {
    display: flex;
    justify-content: space-between;
  }
  .datatype {
    color: var(--gray-6);
  }

  :global(.property-select) {
    background-color: var(--t-bg-light) !important;
    border: none !important;
    color: var(--t-text) !important;
  }

  :global(.property-select) :global(.svelte-select-list) {
    background-color: var(--t-bg-light) !important;
    color: var(--t-text) !important;
  }

  :global(.property-select) :global(.hover) {
    background-color: var(--t-bg-light-2) !important;
    color: var(--t-text) !important;
  }
</style>
