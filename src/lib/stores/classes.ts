import { writable } from 'svelte/store';

export const classesStore = writable<string[]>([]);
