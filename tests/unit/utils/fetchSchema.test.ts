import { describe, it, expect, vi } from 'vitest';
import { fetchSchema, findTable } from '$lib/utils/fetchSchema';
import type { SchemaFile } from 'pathofexile-dat-schema';

describe('fetchSchema', () => {
  it('should fetch and return schema successfully', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
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

  it('should return null if response is not ok', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404
    });
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

  const testCases = [
    { tableName: 'TestTable', version: '1', expected: { name: 'TestTable', validFor: 1, columns: [], tags: [] } },
    { tableName: 'AnotherTable', version: '2', expected: { name: 'AnotherTable', validFor: 3, columns: [], tags: [] } },
    { tableName: 'NonExistentTable', version: '1', expected: null },
    { tableName: 'TestTable', version: '2', expected: null }
  ];

  testCases.forEach(({ tableName, version, expected }) => {
    it(`should ${expected ? 'find' : 'not find'} the table with name "${tableName}" and version "${version}"`, () => {
      const result = findTable(schema, tableName, version);
      expect(result).toEqual(expected);
    });
  });
});