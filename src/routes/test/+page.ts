import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { SCHEMA_URL, type SchemaFile, type SchemaTable } from 'pathofexile-dat-schema';

interface Header {
  name: string | null;
  offset: number;
  readonly length: number;
  type: {
    byteView?: { array: boolean };
    array?: boolean;
    boolean?: Record<any, never>;
    integer?: { unsigned: boolean; size: number };
    decimal?: { size: number };
    string?: Record<any, never>;
    key?: { foreign: boolean; table: string | null; viewColumn: string | null };
  };
  textLength?: number;
}

interface DatSchema {
  name: string;
  headers: ViewerSerializedHeader[];
}

type ViewerSerializedHeader = Omit<Header, 'length'> & { length?: number };

const FIELD_SIZE = {
  BOOL: 1,
  BYTE: 1,
  SHORT: 2,
  LONG: 4,
  LONGLONG: 8,
  STRING: 8,
  KEY: 8,
  KEY_FOREIGN: 8 + 8,
  ARRAY: 8 + 8
};

export const load: PageLoad = async ({ fetch }) => {
  const tableName = 'ExpandingPulse';
  let datFile: any = null;
  let schemaFile: SchemaFile | null = null;
  let headers: ViewerSerializedHeader[] = [];
  let rows: { [key: string]: any }[] = [];

  try {
    // Fetch schema file on server
    schemaFile = await fetch('/schema.min.json').then((r) => r.json());
    const table = schemaFile?.tables.find((t) => t.name === tableName);

    if (!table) {
      throw new Error(`Table ${tableName} not found in schema.`);
    }

    if (browser) {
      // Run only on the client-side
      const { readDatFile, readColumn, getHeaderLength } = await import('pathofexile-dat/dat.js');

      const index = await fetch(
        'https://ggpk.exposed/files?q=index&adapter=https%3A%2F%2Fpatch-poe2.poecdn.com%2F4.1.0.11%2F&path=data'
      ).then((r) => r.json());

      const fileName = tableName.toLowerCase() + '.datc64';
      const datFileUrl = index.files.find((f: any) => f.basename === fileName)?.url;

      if (!datFileUrl) {
        throw new Error(`File ${fileName} not found in index.`);
      }

      const fileBuffer = await fetch(datFileUrl).then((r) => r.arrayBuffer());
      datFile = await readDatFile('.datc64', fileBuffer);

      headers = await fromPublicSchema(table, getHeaderLength);

      // Extract rows using headers
      for (const header of headers) {
        const column = await readColumn(header, datFile);
        for (let i = 0; i < datFile.rowCount; i++) {
          rows[i] = rows[i] || {};
          rows[i][header.name || `Column_${i}`] = column[i];
        }
      }
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }

  return {
    headers,
    rows,
    tableName
  };
};

// Helper Function
async function fromPublicSchema(sch: SchemaTable, getHeaderLength: any): Promise<ViewerSerializedHeader[]> {
  let currentOffset = 0;

  const headers: ViewerSerializedHeader[] = sch.columns.map((column, index) => {
    const header: ViewerSerializedHeader = {
      name: column.name || `Column_${index}`,
      type: {
        array: column.array,
        byteView: column.type === 'array' ? { array: true } : undefined,
        integer: column.type === 'u16' ? { unsigned: true, size: 2 }
          : column.type === 'u32' ? { unsigned: true, size: 4 }
            : column.type === 'i16' ? { unsigned: false, size: 2 }
              : column.type === 'i32' ? { unsigned: false, size: 4 }
                : column.type === 'enumrow' ? { unsigned: false, size: 4 }
                  : undefined,
        decimal: column.type === 'f32' ? { size: 4 } : undefined,
        string: column.type === 'string' ? {} : undefined,
        boolean: column.type === 'bool' ? {} : undefined,
        key: (column.type === 'row' || column.type === 'foreignrow') ? {
          foreign: (column.type === 'foreignrow'),
          table: column.references?.table ?? null,
          viewColumn: null
        } : undefined
      },
      textLength: 4 * 3 - 1,
      length: 0,
      offset: 0
    };

    header.length = getHeaderLength(header, { fieldSize: FIELD_SIZE } as any);
    header.offset = currentOffset;
    currentOffset += header.length ?? 0;

    return header;
  });

  return headers;
}
