import { writable } from 'svelte/store';

export const localURL = writable<string>('https://localhost');

export const exportType = writable<'json' | 'remote'>('json');
