<script lang="ts" context="module">
  export type OutputType = 'json' | 'remote';

  export interface OutputConfig {
    type: 'json' | 'remote';
    remoteUrl?: string;
    agentSecret?: string;
  }
</script>

<script lang="ts">
  import FormField from '../FormField.svelte';
  import TextInput from '../TextInput.svelte';
  export let valid = true;

  let outputType: OutputType = 'json';
  let remoteUrl = '';
  let agentSecret = '';

  export let outputConfig: OutputConfig;

  $: outputConfig = {
    type: outputType,
    remoteUrl,
    agentSecret,
  };

  $: if (outputType === 'remote') {
    valid = remoteUrl.length > 0 && agentSecret.length > 0;
  } else {
    valid = true;
  }

  const onBlur = () => {
    try {
      new URL(remoteUrl);
    } catch (e) {
      valid = false;
    }
  };
</script>

<div>
  <h3>Export type:</h3>
  <div class="radio-group-wrapper">
    <span>
      <label for="output-type-json">JSON-AD</label>
      <input
        bind:group={outputType}
        type="radio"
        name="output-type"
        id="output-type-json"
        value="json"
        checked={outputType === 'json'}
      />
    </span>
    <span>
      <label for="output-type-remote">Export to Server</label>
      <input
        bind:group={outputType}
        type="radio"
        name="output-type"
        id="output-type-remote"
        value="remote"
        checked={outputType === 'remote'}
      />
    </span>
  </div>
</div>

{#if outputType === 'remote'}
  <FormField>
    <svelte:fragment slot="label">Server URL</svelte:fragment>
    <svelte:fragment slot="input" let:id>
      <TextInput
        {id}
        bind:value={remoteUrl}
        placeholder="https://example.com"
        on:blur={onBlur}
        required
      />
    </svelte:fragment>
    <svelte:fragment slot="helper">
      The url of the server to export to.
    </svelte:fragment>
  </FormField>
  <FormField>
    <svelte:fragment slot="label">Agent</svelte:fragment>
    <svelte:fragment slot="input" let:id>
      <TextInput {id} bind:value={agentSecret} placeholder="Agent Secret" />
    </svelte:fragment>
    <svelte:fragment slot="helper">
      Agent used to commit changes to the server, leave empty to use the Public
      agent.
    </svelte:fragment>
  </FormField>
{/if}

<style>
  .radio-group-wrapper {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
</style>
