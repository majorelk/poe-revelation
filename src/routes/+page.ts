import type { PageLoad } from './$types';
import { browser } from '$app/environment';

import { fetchSchema, findTable } from '$lib/utils/fetchSchema';
import { fetchVersion } from '$lib/utils/fetchVersion';
import { fetchDatFiles } from '$lib/utils/fetchDatFiles';
import { processTableData } from '$lib/utils/processTableData';
import type { Header } from 'pathofexile-dat/dat.js';

// 🛠️ Utility function for resolving foreign key values
function resolveForeignKeyValue(value: string | number, referencedTable: any): string {
  if (Array.isArray(value)) {
    return value.map((v) => resolveForeignKeyValue(v, referencedTable)).join(', ');
  }

  const referencedRow = referencedTable.rows[String(value)] || referencedTable.rows[Number(value)];
  return referencedRow ? referencedRow.name || JSON.stringify(referencedRow) : `Missing(${value})`;
}

// 🚀 Page Load Function
export const load: PageLoad = async ({ fetch, url }) => {
  const tableName = url.searchParams.get('table') || '';
  const gameVersion = url.searchParams.get('version') || '1';

  let schemaFile = await fetchSchema(fetch);
  let schemaTable = tableName ? findTable(schemaFile!, tableName) : null;

  let { patchUrl, versionNumber } = await fetchVersion(fetch, gameVersion);
  let datFiles = await fetchDatFiles(fetch, patchUrl);

  type ViewerSerializedHeader = Omit<Header, 'length'> & { length?: number; name: string } & { type: { key?: { table?: string; foreign?: boolean } } };
  let headers: ViewerSerializedHeader[] = [];
  let rows = [];
  let foreignKeys: ViewerSerializedHeader[] = [];
  let referencedTables: { tableName: string; rows: any; column: { foreign: boolean } }[] = [];

  if (browser && schemaTable) {
    const { readDatFile, getHeaderLength, readColumn } = await import('pathofexile-dat/dat.js');

    // ✅ Process Main Table Data
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

    // ✅ Identify Foreign Keys from Headers
    foreignKeys = headers.filter(
      (header) => header.type.key && 'table' in header.type.key && header.type.key.foreign
    );

    // ✅ Fetch Referenced Tables
    const referencedTablesResults = await Promise.all(
      foreignKeys.map(async (fk) => {
      try {
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
          return { tableName: fk.type.key.table, rows: refResult.rows, column: fk.type.key };
        }
        }
      } catch (error) {
        console.error(`Error processing foreign key table ${fk.type.key?.table}:`, error);
      }
      return null;
      })
    );

    referencedTables = referencedTablesResults.filter((table): table is { tableName: string; rows: any; column: { foreign: boolean } } => table !== null);

    // ✅ Process Foreign Key Relationships
    for (const foreignKey of foreignKeys) {
      const columnName = foreignKey.name;
      const referencedTableName = foreignKey.type.key?.table;

      const referencedTable = referencedTables.find((table) => table?.tableName === referencedTableName);
      if (!referencedTable) {
        console.warn(`[WARNING] Referenced table "${referencedTableName}" not found in referencedTables.`);
        continue;
      }

      for (const row of rows) {
        const foreignKeyValue = row[columnName];
        if (foreignKeyValue === null || foreignKeyValue === undefined) continue;

        row[columnName] = resolveForeignKeyValue(foreignKeyValue, referencedTable);
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
