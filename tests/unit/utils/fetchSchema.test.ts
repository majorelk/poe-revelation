import { describe, it, expect, vi } from 'vitest';
import { fetchSchema, findTable } from '$lib/utils/fetchSchema';
import type { SchemaFile } from 'pathofexile-dat-schema';

describe('fetchSchema', () => {
  it('should fetch and return schema successfully', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ tables: [] })
    });
    const result = await fetchSchema(mockFetch);
    expect(result).toEqual({ tables: [] });
  });

  it('should return null if fetch fails', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Fetch error'));
    const result = await fetchSchema(mockFetch);
    expect(result).toBeNull();
  });
});

describe('findTable', () => {
  const schema: SchemaFile = {
      tables: [
          {
              name: 'TestTable', validFor: 1,
              columns: [],
              tags: []
          },
          {
              name: 'AnotherTable', validFor: 3,
              columns: [],
              tags: []
          }
      ],
      enumerations: [],
      version: 0,
      createdAt: 0
  };

  it('should find the table with the exact name and version', () => {
    const result = findTable(schema, 'TestTable', '1');
    expect(result).toEqual({
      name: 'TestTable',
      validFor: 1,
      columns: [],
      tags: []
    });
  });

  it('should find the table with the exact name and validFor 3', () => {
    const result = findTable(schema, 'AnotherTable', '2');
    expect(result).toEqual({
      name: 'AnotherTable',
      validFor: 3,
      columns: [],
      tags: []
    });
  });

  it('should return null if the table is not found', () => {
    const result = findTable(schema, 'NonExistentTable', '1');
    expect(result).toBeNull();
  });

  it('should return null if the version does not match', () => {
    const result = findTable(schema, 'TestTable', '2');
    expect(result).toBeNull();
  });
});