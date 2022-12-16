import { writable } from 'svelte/store';

export const localURL = writable<string>('https://localhost/');
