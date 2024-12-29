import type { PageLoad } from './$types';
import { browser } from '$app/environment';

import { fetchSchema, findTable } from '$lib/utils/fetchSchema';
import { fetchVersion } from '$lib/utils/fetchVersion';
import { fetchDatFiles } from '$lib/utils/fetchDatFiles';
import { processTableData } from '$lib/utils/processTableData';
import type { Header } from 'pathofexile-dat/dat.js';

export const load: PageLoad = async ({ fetch, url }) => {
  const tableName = url.searchParams.get('table') || '';
  const gameVersion = url.searchParams.get('version') || '1';

  let schemaFile = await fetchSchema(fetch);
  let schemaTable = tableName ? findTable(schemaFile!, tableName) : null;

  let { patchUrl, versionNumber } = await fetchVersion(fetch, gameVersion);
  let datFiles = await fetchDatFiles(fetch, patchUrl);

  type ViewerSerializedHeader = Omit<Header, 'length'> & { length?: number; name: string };
  let headers: ViewerSerializedHeader[] = [];
  let rows = [];
  let foreignKeys: ViewerSerializedHeader[] = [];
  let referencedTables: { tableName: string; rows: any; column: string }[] = [];

  if (browser && schemaTable) {
    const { readDatFile, getHeaderLength, readColumn } = await import('pathofexile-dat/dat.js');

    // Process main table data
    const result = await processTableData(
      tableName,
      datFiles,
      fetch,
      readDatFile,
      getHeaderLength,
      readColumn,
      schemaTable
    );
    headers = result.headers;
    rows = result.rows;

    // Identify foreign keys from headers
    foreignKeys = headers.filter(
      (header) => header.type.key && 'table' in header.type.key && header.type.key.foreign
    );

    // Fetch referenced tables
    const referencedTablesResults = await Promise.all(
      foreignKeys.map(async (fk) => {
        if (fk.type.key?.table) {
          const refTable = findTable(schemaFile!, fk.type.key.table);
          if (refTable) {
            const refResult = await processTableData(
              fk.type.key.table,
              datFiles,
              fetch,
              readDatFile,
              getHeaderLength,
              readColumn,
              refTable
            );
            return { tableName: fk.type.key.table, rows: refResult.rows, column: 'Id' };
          }
        }
        return null;
      })
    );
    referencedTables = referencedTablesResults.filter((table): table is { tableName: string; rows: any; column: string } => table !== null);

    // Process foreign key relationships directly in rows
    for (const foreignKey of foreignKeys) {
      const columnName = foreignKey.name;
      const referencedTableName = foreignKey.type.key?.table;

      const referencedTable = referencedTables.find((table) => table?.tableName === referencedTableName);
      if (!referencedTable) continue;

      for (const row of rows) {
        const foreignKeyValue = row[columnName];
        if (foreignKeyValue === null || foreignKeyValue === undefined) continue;

        const referencedRow = referencedTable.rows[foreignKeyValue];
        if (referencedRow) {
          row[columnName] = referencedRow.name || JSON.stringify(referencedRow);
        }
      }
    }
  }

  return {
    headers,
    rows,
    tableName,
    patchUrl,
    selectedVersion: gameVersion,
    versionNumber,
    datFiles,
    foreignKeys,
    referencedTables,
  };
};
