<script lang="ts">
  import { Agent } from '@tomic/lib';
  import { store } from '@tomic/svelte';
  import { get } from 'svelte/store';
  import Button from '../Button.svelte';
  import Dialog from '../Dialog/Dialog.svelte';
  import FormField from '../FormField.svelte';
  import { externalSources } from '../stores/collections';
  import { exportType, localURL } from '../stores/config';
  import TextArea from '../TextArea.svelte';
  import TextInput from '../TextInput.svelte';
  import OutputForm, { type OutputConfig } from './OutputForm.svelte';

  export let show: boolean = false;
  let outputFormValid: boolean;
  let outputConfig: OutputConfig;

  let sourcesValue: string = get(externalSources).join('\n');
  let error = '';

  const handleDone = () => {
    try {
      const sources = sourcesValue.split('\n');

      const filtered = sources.filter(source => {
        try {
          new URL(source);
          return true;
        } catch (e) {
          return false;
        }
      });

      $externalSources = filtered;
      $exportType = outputConfig.type;

      if (outputConfig.type === 'remote') {
        $store.setServerUrl(outputConfig.remoteUrl);

        const remote = new URL(outputConfig.remoteUrl);
        const local = new URL($localURL);

        if (remote.origin !== local.origin) {
          throw new Error(
            'Base subject and Server URL must have the same origin (protocol, host and port)',
          );
        }

        if (outputConfig.agentSecret) {
          const agent = Agent.fromSecret(outputConfig.agentSecret);

          $store.setAgent(agent);
        } else {
          $store.setAgent(undefined);
        }
      }

      show = false;
      error = '';
    } catch (e) {
      console.error(e);
      error = e.message;
    }
  };

  const handleLocalURLBlur = () => {
    if ($localURL.endsWith('/')) {
      $localURL = $localURL.slice(0, -1);
    }
  };
</script>

<Dialog bind:show>
  <svelte:fragment slot="title">
    <h1>Config</h1>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <form>
      <FormField>
        <svelte:fragment slot="label">Base Subject:</svelte:fragment>
        <svelte:fragment slot="input" let:id>
          <TextInput {id} bind:value={$localURL} on:blur={handleLocalURLBlur} />
        </svelte:fragment>
        <svelte:fragment slot="helper">
          The url used to generate subjects for new classes and properties when
          exporting to a server this should be an exsiting resource on the
          server like a drive that will be the parent to all generated
          resources.
        </svelte:fragment>
      </FormField>
      <FormField>
        <svelte:fragment slot="label">Data Sources:</svelte:fragment>
        <svelte:fragment slot="input" let:id>
          <TextArea {id} bind:value={sourcesValue} />
        </svelte:fragment>
        <svelte:fragment slot="helper">
          Atomic data servers to pull property and class data from. (seperated
          by newline)
        </svelte:fragment>
      </FormField>
      <OutputForm bind:valid={outputFormValid} bind:outputConfig />
    </form>
  </svelte:fragment>
  <svelte:fragment slot="error">
    {#if error}
      {error}
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="controls">
    <Button on:click={handleDone} disabled={!outputFormValid}>Save</Button>
  </svelte:fragment>
</Dialog>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
