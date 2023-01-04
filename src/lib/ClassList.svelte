<script lang="ts">
  import { generateRandomSubject } from './randomSubject';
  import { classesStore } from './stores/classes';
  import { localURL } from './stores/config';
  import Class from './Class.svelte';
  import plus from '../assets/icons/eva/plus-outline.svg?raw';
  import Button from './Button.svelte';
  import Icon from 'svelte-icon/Icon.svelte';
  import { INTERNAL_BASE_ID } from './constants';

  const newClass = () => {
    const subject = generateRandomSubject();
    $classesStore = [...$classesStore, subject];
  };

  const handleClassDelete = (e: CustomEvent<string>) => {
    $classesStore = $classesStore.filter(c => c !== e.detail);
  };
</script>

{#each $classesStore as c (c)}
  <Class subject={c} on:delete={handleClassDelete} />
{/each}
<Button on:click={newClass}>
  <Icon data={plus} stroke="none" />
  New Class
</Button>
