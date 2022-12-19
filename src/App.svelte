<script lang="ts">
  import Container from './lib/Container.svelte';
  import { classesStore } from './lib/stores/classes';
  import { generateRandomSubject } from './lib/randomSubject';
  import { localURL } from './lib/stores/localURL';
  import ClassList from './lib/ClassList.svelte';
  import AppBar from './lib/AppBar.svelte';
  import Output from './lib/Output/Output.svelte';

  const newClass = () => {
    const subject = generateRandomSubject($localURL);
    $classesStore = [...$classesStore, subject];
  };
</script>

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
