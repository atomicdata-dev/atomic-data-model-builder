<script lang="ts">
  import Container from './lib/Container.svelte';
  import ClassList from './lib/ClassList.svelte';
  import AppBar from './lib/AppBar.svelte';
  import Output from './lib/Output/Output.svelte';
</script>

<svelte:head>
  <meta property="og:image" content="/cover.jpg" />
  <meta property="twitter:image" content="/cover.jpg" />
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
