<script lang="ts" context="module">
  import { writable } from 'svelte/store';
  import { fly } from 'svelte/transition';
  export type ToastStyle = 'success' | 'error';

  const TOAST_TIMEOUT = 3000;

  export const showToast = (
    message: string,
    style: ToastStyle = 'success',
  ): void => {
    toastStyle.set(style);
    toastMessage.set(message);

    setTimeout(() => {
      toastMessage.set('');
    }, TOAST_TIMEOUT);
  };

  const toastMessage = writable('');
  const toastStyle = writable<ToastStyle>('success');
</script>

<script lang="ts">
</script>

{#if $toastMessage.length > 0}
  <div class="toast-wrapper" transition:fly={{ y: 30 }}>
    <section
      class="toast"
      class:success={$toastStyle === 'success'}
      class:error={$toastStyle === 'error'}
    >
      {$toastMessage}
    </section>
  </div>
{/if}

<style>
  .toast-wrapper {
    position: fixed;
    bottom: 2rem;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }

  .toast {
    background-color: #333;
    color: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    pointer-events: all;
    border: 2px solid;
    box-shadow: var(--shadow-4);
    animation: blip 1s ease-in-out 400ms;
  }

  .success {
    border-color: var(--green-6);
  }

  .error {
    border-color: var(--red-8);
  }

  @keyframes blip {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
