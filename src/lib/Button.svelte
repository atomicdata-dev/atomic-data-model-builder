<button on:click type="button">
  <slot />
</button>

<style>
  button {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    align-items: center;
    background-color: transparent;
    border: 1px solid var(--t-text);
    border-radius: var(--radius-2);
    color: var(--t-text);
    cursor: pointer;
    transition: background-color 100ms ease-in-out, color 100ms ease-in-out,
      box-shadow 100ms ease-in-out;
  }

  button:hover,
  button:focus {
    background-color: var(--t-text);
    color: var(--t-bg);
    box-shadow: var(--shadow-4);
  }
</style>
