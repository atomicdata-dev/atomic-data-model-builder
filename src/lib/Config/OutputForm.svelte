<script lang="ts" context="module">
  export type OutputType = 'json' | 'remote';

  export interface OutputConfig {
    type: 'json' | 'remote';
    remoteUrl?: string;
    agentSubject?: string;
    agentKey?: string;
  }
</script>

<script lang="ts">
  import FormField from '../FormField.svelte';
  import TextInput from '../TextInput.svelte';
  export let valid = true;

  let outputType: OutputType = 'json';
  let remoteUrl = '';
  let agentSubject = '';
  let agentKey = '';

  export let outputConfig: OutputConfig;

  $: outputConfig = {
    type: outputType,
    remoteUrl,
    agentSubject,
    agentKey,
  };

  $: if (outputType === 'remote') {
    // Remote url must be set and the agent fields must either both be set or both be empty
    valid = remoteUrl.length > 0 && !!agentSubject.length === !!agentKey.length;
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
  <label for="output-type-json">JSON-AD</label>
  <input
    bind:group={outputType}
    type="radio"
    name="output-type"
    id="output-type-json"
    value="json"
    checked={outputType === 'json'}
  />
  <label for="output-type-remote">Export to Server</label>
  <input
    bind:group={outputType}
    type="radio"
    name="output-type"
    id="output-type-remote"
    value="remote"
    checked={outputType === 'remote'}
  />
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
      <TextInput {id} bind:value={agentSubject} placeholder="Subject" />
      <TextInput {id} bind:value={agentKey} placeholder="Private Key" />
    </svelte:fragment>
    <svelte:fragment slot="helper">
      Agent used to commit changes to the server, leave empty to use the Public
      agent.
    </svelte:fragment>
  </FormField>
{/if}
