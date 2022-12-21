<script lang="ts">
  import { onMount } from 'svelte';
  import { Store } from '@tomic/lib';
  import { initStore } from '@tomic/svelte';
  import Container from './lib/Container.svelte';
  import ClassList from './lib/ClassList.svelte';
  import AppBar from './lib/AppBar.svelte';
  import Output from './lib/Output/Output.svelte';
  import cover from './assets/cover.jpg';
  onMount(() => {
    const store = new Store();

    initStore(store);
  });
</script>

<svelte:head>
  <meta property="og:image" content={cover} />
  <meta property="twitter:image" content={cover} />
</svelte:head>
<AppBar />
<main>
  <Container>
    <div class="wrapper">
      <ClassList />
      <Output />
    </div>
  </Container>
</main>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
