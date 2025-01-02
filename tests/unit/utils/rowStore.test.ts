import { describe, it, expect } from 'vitest';
import { rowStore } from '$lib/stores/rowStore';

describe('rowStore', () => {
  it('should initialize with null', () => {
    let value;
    rowStore.subscribe((v) => (value = v))();
    expect(value).toBeNull();
  });

  it('should update the store value', () => {
    const newValue = { key: 'value' };
    rowStore.set(newValue);

    let value;
    rowStore.subscribe((v) => (value = v))();
    expect(value).toEqual(newValue);
  });

  it('should reset the store value to null', () => {
    rowStore.set({ key: 'value' });
    rowStore.set(null);

    let value;
    rowStore.subscribe((v) => (value = v))();
    expect(value).toBeNull();
  });
});