<script lang="ts">
  import { urls } from '@tomic/lib';
  import { getResource, getValue } from '../atomic/ADStore';

  let resource = getResource('http://localhost:9883/Folder/8lkg0r8wcpv');
  let name = getValue<string>(resource, urls.properties.name, true);
  let inputValue = '';

  // $: {
  //   $name = inputValue;
  // }
</script>

<h2>Component 2:</h2>
<input type="text" bind:value={$name} />
