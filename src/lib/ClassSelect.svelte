<script lang="ts" context="module">
  export type ClassItem = {
    label: string;
    subject: string;
    description: string;
    created?: boolean;
  };
</script>

<script lang="ts">
  import { urls } from '@tomic/lib';
  import { createEventDispatcher } from 'svelte';
  import Select from 'svelte-select';
  import { store } from '../atomic/ADStore';
  import { classesStore } from './stores/classes';
  import { externalClasses } from './stores/collections';
  import { toSlug } from './toSlug';

  const dispatch = createEventDispatcher<{ select: ClassItem }>();

  export let selectedSubject: string = '';

  let filterText: string = '';

  let value: ClassItem;
  let items: ClassItem[] = [];

  $: if (selectedSubject) {
    const setValue = async () => {
      const resource = await $store.getResourceAsync(selectedSubject);
      value = {
        label: resource.get(urls.properties.shortname) as string,
        subject: resource.getSubject() as string,
        description: resource.get(urls.properties.description) as string,
      };
    };

    setValue();
  }

  $: if (filterText !== toSlug(filterText)) {
    filterText = toSlug(filterText);
  }

  $: {
    Promise.all(
      [...$classesStore, ...$externalClasses].map(subject => {
        try {
          return $store.getResourceAsync(subject);
        } catch (e) {
          return undefined;
        }
      }),
    ).then(props => {
      items = props.map(resource => ({
        label: resource.get(urls.properties.shortname) as string,
        subject: resource.getSubject() as string,
        description: resource.get(urls.properties.description) as string,
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
          description: '',
          created: true,
        },
        ...items.filter(i => !i.created),
      ];
    } else {
      items = items.filter(i => !i.created);
    }
  }

  const handleSelect = (e: CustomEvent<ClassItem>) => {
    items = items.map(i => {
      delete i.created;
      return i;
    });
    console.log('selected', e.detail);
    dispatch('select', e.detail);
  };
</script>

<Select
  {items}
  bind:filterText
  {value}
  on:change={handleSelect}
  class="class-select"
  placeholder="Select or create class"
>
  <div class="item" slot="item" let:item>
    <span class="label">
      {item.created ? 'Create' : ''}
      {item.label}
    </span>
    <span class="description">{item.description}</span>
  </div>
</Select>

<style>
  .item {
    display: grid;
    grid-template-columns: 15ch auto;
    gap: 0.5rem;
  }

  .description {
    color: var(--t-text-light);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :global(.class-select) {
    background-color: var(--t-bg-light) !important;
    border: none !important;
    color: var(--t-text) !important;
  }

  :global(.class-select) :global(.svelte-select-list) {
    background-color: var(--t-bg-light) !important;
    color: var(--t-text) !important;
  }

  :global(.class-select) :global(.hover) {
    background-color: var(--t-bg-light-2) !important;
    color: var(--t-text) !important;
  }
</style>
