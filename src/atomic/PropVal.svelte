<script lang="ts">
  import { unknownSubject } from '@tomic/lib';
  import { getResource, getValue } from './ADStore';

  export let subject: string;
  export let property: string;

  const resource = getResource(subject);
  const value = getValue(resource, property);
</script>

<slot value={$value} />
