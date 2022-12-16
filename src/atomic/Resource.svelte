<script lang="ts">
  import { unknownSubject } from '@tomic/lib';
  import { getResource } from './ADStore';

  export let subject: string = unknownSubject;
  let resource = getResource(subject);
</script>

<slot resource={$resource} />
