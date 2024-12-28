import type { SchemaTable } from 'pathofexile-dat-schema';
import type { DatFile, Header } from 'pathofexile-dat/dat.js';

type ViewerSerializedHeader = Omit<Header, 'length'> & { length?: number, name: string };

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

// Map schema columns to ViewerSerializedHeaders
async function fromPublicSchema(
  sch: SchemaTable,
  getHeaderLength: (header: Pick<Header, 'type'>, datFile: DatFile) => number
): Promise<ViewerSerializedHeader[]> {
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
        } as { foreign: boolean; table: string | null; viewColumn: null } : undefined
      },
      textLength: 4 * 3 - 1,
      length: 0,
      offset: currentOffset
    };

    try {
      header.length = getHeaderLength(header, { fieldSize: FIELD_SIZE } as any);
      console.log(`Header "${header.name}" length calculated:`, header.length);
    } catch (headerError) {
      console.error(`Failed to calculate header length for column: ${header.name}`, headerError);
      header.length = 0; // Fallback to prevent crashes
    }

    currentOffset += header.length ?? 0;
    return header;
  });

  console.log('Generated Headers from Schema:', headers);
  return headers;
}

// Process table data with schema mapping
const processedForeignTables = new Set<string>();

export async function processTableData(
  tableName: string,
  datFiles: { name: string; url: string }[],
  fetch: (input: RequestInfo | URL) => Promise<Response>,
  readDatFile: (filenameOrExt: string, content: ArrayBuffer) => DatFile,
  getHeaderLength: (header: Pick<Header, 'type'>, datFile: DatFile) => number,
  readColumn: (header: ViewerSerializedHeader, datFile: DatFile) => any[],
  table: SchemaTable
): Promise<{ datFile: DatFile; headers: ViewerSerializedHeader[]; rows: any[] }> {
  if (processedForeignTables.has(tableName)) {
    console.warn(`Skipping already processed foreign table: ${tableName}`);
    return { datFile: {} as DatFile, headers: [], rows: [] };
  }

  processedForeignTables.add(tableName);

  const fileName = `${tableName.toLowerCase()}.datc64`;
  const targetFile = datFiles.find((file) => file.name === fileName);

  if (!targetFile) {
    throw new Error(`File ${fileName} not found.`);
  }

  const fileBuffer = await fetch(targetFile.url).then((r) => r.arrayBuffer());
  const datFile = readDatFile('.datc64', fileBuffer);

  let headers: ViewerSerializedHeader[] = [];
  let rows: any[] = [];
  let foreignTables: ViewerSerializedHeader[] = [];
  let foreignRows: any[] = [];

  try {
    console.log('Processing headers from schema:', table.columns);

    headers = await fromPublicSchema(table, getHeaderLength);
    console.log('Headers successfully generated:', headers);

    for (const header of headers) {
      if (!header.length || header.length === 0) {
        console.warn(`Skipping header with invalid length: ${header.name}`);
        continue;
      }

      if (header.type?.key?.foreign) {
        console.log('ForeignRow column detected:', header.name, '->', header.type.key);
        foreignTables.push(header);
      }

      const column = await readColumn(header, datFile);
      column.forEach((value, i) => {
        rows[i] = rows[i] || {};
        rows[i][header.name || `Column_${i}`] = value;
      });

      if (header.type?.key?.foreign) {
        // console.log('ForeignRow values:', column);
        foreignRows = column.filter((value) => value != null); // Ensure valid rows only
      }
    }

    // Process Foreign Tables
    for (const foreignHeader of foreignTables) {
      const foreignTableName = foreignHeader.type?.key?.table;

      if (!foreignTableName || processedForeignTables.has(foreignTableName)) {
        console.warn(`Skipping invalid or already processed foreign table: ${foreignTableName}`);
        continue;
      }

      console.log(`Processing foreign table: ${foreignTableName}`);

      const { rows: foreignTableRows, headers: foreignTableHeaders } = await processTableData(
        foreignTableName,
        datFiles,
        fetch,
        readDatFile,
        getHeaderLength,
        readColumn,
        table
      );

      console.log(`Foreign table "${foreignTableName}" loaded with ${foreignTableRows.length} rows.`);

      // Ensure there is at least one header (first column exists)
      const firstColumnHeader = foreignTableHeaders[0]?.name;
      if (!firstColumnHeader) {
        console.warn(`Foreign table "${foreignTableName}" has no valid first column.`);
        continue;
      }

      // Map ForeignRows using Index and log the first column's value
      foreignRows = foreignRows.map((foreignIndex) => {
        if (foreignIndex < 0 || foreignIndex >= foreignTableRows.length) {
          console.warn(`Invalid foreign row index "${foreignIndex}" in table "${foreignTableName}".`);
          return null;
        }

        const foreignRow = foreignTableRows[foreignIndex];
        const firstColumnValue = foreignRow[firstColumnHeader];

        console.log(
          `Foreign table "${foreignTableName}" row ${foreignIndex} - First column "${firstColumnHeader}":`,
          firstColumnValue
        );

        return foreignRow;
      });
    }
  } catch (error) {
    console.error('Error during table data processing:', error);
    throw error;
  } finally {
    processedForeignTables.delete(tableName);
  }

  return { datFile, headers, rows };
}
