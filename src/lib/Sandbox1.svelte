<script lang="ts">
  import { urls } from '@tomic/lib';
  import { getResource, getValue } from '../atomic/ADStore';
  import PropVal from '../atomic/PropVal.svelte';
  import Resource from '../atomic/Resource.svelte';

  let resource = getResource('http://localhost:9883/Folder/8lkg0r8wcpv');
  let name = getValue<string>(resource, urls.properties.name);
</script>

<div>
  <h2>Component 1:</h2>
  <PropVal
    subject="http://localhost:9883/Folder/8lkg0r8wcpv"
    property={urls.properties.name}
    let:value
  >
    {value}
  </PropVal> | {$name}
</div>
