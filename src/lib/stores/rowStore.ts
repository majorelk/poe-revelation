import { writable } from 'svelte/store';

interface RowData {
  [key: string]: any;
}

// Create a writable store for row data
export const rowStore = writable<RowData | null>(null);
