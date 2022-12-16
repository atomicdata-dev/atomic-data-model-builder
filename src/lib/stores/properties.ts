import { writable } from 'svelte/store';

export const propertiesStore = writable<string[]>([]);
