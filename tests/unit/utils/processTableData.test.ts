/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi } from 'vitest';
import { fromPublicSchema, FIELD_SIZE } from '$lib/utils/processTableData';
import { ValidFor, type SchemaTable } from 'pathofexile-dat-schema';
import type { DatFile, Header } from 'pathofexile-dat/dat.js';

// the following snippet is expected in the outcome based on testing however I'm not sure why as it doesn't exist in the type `TableColumn`
// `since: '', deprecated: false }`,

describe('fromPublicSchema', () => {
  const mockGetHeaderLength = vi.fn((header: Pick<Header, 'type'>, datFile: DatFile) => {
    if (header.type.integer) {
      return header.type.integer.size;
    } else if (header.type.string) {
      return FIELD_SIZE.STRING;
    } else if (header.type.boolean) {
      return FIELD_SIZE.BOOL;
    } else {
      return 0;
    }
  });

  it('should map schema columns to ViewerSerializedHeaders correctly', async () => {
    const mockSchema: SchemaTable = {
      columns: [
        { name: 'Column1', type: 'u16', array: false, description: '', unique: false, localized: false, until: '', since: '', deprecated: false },
        { name: 'Column2', type: 'string', array: false, description: '', unique: false, localized: false, until: '', since: '', deprecated: false },
        { name: 'Column3', type: 'bool', array: false, description: '', unique: false, localized: false, until: '', since: '', deprecated: false },
      ],
      validFor: ValidFor.PoE2,
      name: '',
      tags: []
    };

    const result = await fromPublicSchema(mockSchema, mockGetHeaderLength);

    expect(result).toEqual([
      { name: 'Column1', type: { array: false, byteView: undefined, integer: { unsigned: true, size: 2 }, decimal: undefined, string: undefined, boolean: undefined, key: undefined }, offset: 0, length: 2, textLength: 11 },
      { name: 'Column2', type: { array: false, byteView: undefined, integer: undefined, decimal: undefined, string: {}, boolean: undefined, key: undefined }, offset: 2, length: 8, textLength: 11 },
      { name: 'Column3', type: { array: false, byteView: undefined, integer: undefined, decimal: undefined, string: undefined, boolean: {}, key: undefined }, offset: 10, length: 1, textLength: 11 },
    ]);
  });

  it('should handle columns without names', async () => {
    const mockSchema: SchemaTable = {
      columns: [
        { name: '', type: 'u16', array: false, description: '', unique: false, localized: false, until: '', since: '', deprecated: false },
        { name: '', type: 'string', array: false, description: '', unique: false, localized: false, until: '', since: '', deprecated: false },
      ],
      validFor: ValidFor.PoE2,
      name: '',
      tags: []
    };

    const result = await fromPublicSchema(mockSchema, mockGetHeaderLength);

    expect(result).toEqual([
      { name: 'Column_0', type: { array: false, byteView: undefined, integer: { unsigned: true, size: 2 }, decimal: undefined, string: undefined, boolean: undefined, key: undefined }, offset: 0, length: 2, textLength: 11 },
      { name: 'Column_1', type: { array: false, byteView: undefined, integer: undefined, decimal: undefined, string: {}, boolean: undefined, key: undefined }, offset: 2, length: 8, textLength: 11 },
    ]);
  });

  it('should calculate offsets correctly', async () => {
    const mockSchema: SchemaTable = {
      columns: [
        { name: 'Column1', type: 'u16', array: false, description: '', unique: false, localized: false, until: '', since: '', deprecated: false },
        { name: 'Column2', type: 'u32', array: false, description: '', unique: false, localized: false, until: '', since: '', deprecated: false },
      ],
      validFor: ValidFor.PoE2,
      name: '',
      tags: []
    };

    const result = await fromPublicSchema(mockSchema, mockGetHeaderLength);

    expect(result).toEqual([
      { name: 'Column1', type: { array: false, byteView: undefined, integer: { unsigned: true, size: 2 }, decimal: undefined, string: undefined, boolean: undefined, key: undefined }, offset: 0, length: 2, textLength: 11 },
      { name: 'Column2', type: { array: false, byteView: undefined, integer: { unsigned: true, size: 4 }, decimal: undefined, string: undefined, boolean: undefined, key: undefined }, offset: 2, length: 4, textLength: 11 },
    ]);
  });
});