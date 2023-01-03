<script lang="ts">
  import { onMount } from 'svelte';
  import { generateRandomString } from './randomSubject';

  let id: string = '';

  onMount(() => {
    id = generateRandomString();
  });
</script>

<div class="form-field">
  <label for={id}>
    <slot name="label" />
  </label>
  <slot name="input" {id} />
  <p class="helper">
    <slot name="helper" />
  </p>
</div>

<style>
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: bold;
  }

  .helper {
    color: var(--t-text-light);
  }
</style>
