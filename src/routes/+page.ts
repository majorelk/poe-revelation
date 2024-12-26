import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { SCHEMA_URL, type SchemaFile, type SchemaTable } from 'pathofexile-dat-schema';
import type { DatFile, Header } from 'pathofexile-dat/dat.js';

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

interface DatFileEntry {
  name: string;
  url: string;
}

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

export const load: PageLoad = async ({ fetch, url }) => {
  const tableName = undefined;
  let datFile: any = null;
  let schemaFile: SchemaFile | null = null;
  let headers: ViewerSerializedHeader[] = [];
  let rows: { [key: string]: any }[] = [];
  let patchUrl = '';
  let versionNumber = '';
  let datFiles: DatFileEntry[] = [];

  const gameVersion = url.searchParams.get('version') || '1'; // Default to poe=1

  try {
    if (tableName === undefined) {
      // throw new Error('Table name is required.');
      // do nothing
    } else {
      // Fetch schema file on server
      schemaFile = await fetch('/schema.min.json').then((r) => r.json());
      const table = schemaFile?.tables.find((t) => t.name === tableName);

      if (!table) {
        throw new Error(`Table ${tableName} not found in schema.`);
      }
    }


    if (browser) {
      const { readDatFile, readColumn, getHeaderLength } = await import('pathofexile-dat/dat.js');

      // Fetch latest patch version dynamically
      const versionUrl = `https://ggpk.exposed/version?poe=${gameVersion}`;
      patchUrl = await fetch(versionUrl).then((r) => r.text());
      console.log(`POE${gameVersion} Version:`, patchUrl);

      // Extract version number from URL
      const match = patchUrl.match(/\/([\d.]+)\/?$/);
      versionNumber = match ? match[1] : '';
      console.log(`Extracted Version Number:`, versionNumber);

      if (!versionNumber) {
        throw new Error('Failed to extract version number from patch URL.');
      }

      // Fetch the JSON index of files
      const indexUrl = `https://ggpk.exposed/files?q=index&adapter=${encodeURIComponent(patchUrl)}&path=data&extension=datc64`;
      const fileList = await fetch(indexUrl).then((r) => r.json());


      // Filter `.datc64` files and map necessary information
      datFiles = fileList.files
        .filter((file: any) => file.extension === 'datc64' && file.type === 'file')
        .map((file: any) => ({
          name: file.basename,
          url: file.url
        }));

      console.log(`Filtered .datc64 Files:`, datFiles);

      if (tableName === undefined) {
        // do nothing
      } else {

        // Process table data
        ({ datFile, headers } = await processTableData(tableName, datFiles, fetch, datFile, readDatFile, headers, table, getHeaderLength, readColumn, rows));
      }
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }

  return {
    headers,
    rows,
    tableName,
    patchUrl,
    selectedVersion: gameVersion,
    versionNumber,
    datFiles
  };
};

async function processTableData(tableName: string, datFiles: DatFileEntry[], fetch: { (input: RequestInfo | URL, init?: RequestInit): Promise<Response>; (input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>; }, datFile: any, readDatFile: { (filenameOrExt: string, content: ArrayBuffer): DatFile; (arg0: string, arg1: ArrayBuffer): any; }, headers: ViewerSerializedHeader[], table: SchemaTable, getHeaderLength: (header: Pick<Header, "type">, datFile: DatFile) => number, readColumn: (header: ViewerSerializedHeader, datFile: DatFile) => any[], rows: { [key: string]: any; }[]) {
  const fileName = tableName.toLowerCase() + '.datc64';
  const targetFile = datFiles.find((file) => file.name === fileName);

  if (!targetFile) {
    throw new Error(`File ${fileName} not found in .datc64 file list.`);
  }

  const fileBuffer = await fetch(targetFile.url).then((r) => r.arrayBuffer());
  datFile = readDatFile('.datc64', fileBuffer);

  headers = await fromPublicSchema(table, getHeaderLength);

  // Extract rows using headers
  for (const header of headers) {
    const column = await readColumn(header, datFile);
    for (let i = 0; i < datFile.rowCount; i++) {
      rows[i] = rows[i] || {};
      rows[i][header.name || `Column_${i}`] = column[i];
    }
  }
  return { datFile, headers };
}

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
