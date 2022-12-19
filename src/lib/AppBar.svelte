<script lang="ts">
  import IconButton from './IconButton.svelte';
  import options from '../assets/icons/eva/options-2-outline.svg?raw';
  import github from '../assets/icons/eva/github-outline.svg?raw';
  import Container from './Container.svelte';
  import Config from './Config.svelte';
  import Icon from 'svelte-icon/Icon.svelte';

  let showConfig = false;
</script>

<header>
  <Container>
    <div class="wrapper">
      <h1>Atomic Data Model Builder</h1>
      <div class="links">
        <IconButton
          icon={options}
          size="1.5rem"
          title="Configure app"
          on:click={() => (showConfig = true)}
        />
        <a
          href="https://github.com/atomicdata-dev/atomic-data-model-builder"
          rel="noopener noreferrer"
          target="_blank"
          title="View source on GitHub"
        >
          <Icon data={github} size="1.5rem" />
        </a>
      </div>
    </div>
  </Container>
</header>
<Config bind:show={showConfig} />

<style>
  header {
    padding: 0;
    background-color: var(--t-bg-light-2);
  }
  a {
    display: flex;
    padding: 6px;
    border-radius: var(--radius-2);
    align-items: center;
    color: var(--t-text);
    aspect-ratio: 1/1;
    transition: background-color 100ms ease-in-out;
  }

  a:hover,
  a:focus {
    background-color: var(--t-bg-light);
  }

  .wrapper {
    display: flex;
    justify-content: space-between;
  }

  .links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
