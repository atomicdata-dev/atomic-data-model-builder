<script lang="ts">
  import IconButton from './IconButton.svelte';
  import options from '../assets/icons/eva/options-2-outline.svg?raw';
  import Container from './Container.svelte';
  import Config from './Config.svelte';

  let showConfig = false;
</script>

<header>
  <Container>
    <div class="wrapper">
      <h1>Atomic Data Model Builder</h1>
      <IconButton
        icon={options}
        size="1.5rem"
        title="Configure app"
        on:click={() => (showConfig = true)}
      />
    </div>
  </Container>
</header>
<Config bind:show={showConfig} />

<style>
  header {
    padding: 0;
    background-color: var(--t-bg-light-2);
  }
  .wrapper {
    display: flex;
    justify-content: space-between;
  }
</style>
