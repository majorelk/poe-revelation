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

  // Fetch schema and related data
  let schemaFile = await fetchSchema(fetch);
  let schemaTable = tableName ? findTable(schemaFile!, tableName) : null;

  let { patchUrl, versionNumber } = await fetchVersion(fetch, gameVersion);
  let datFiles = await fetchDatFiles(fetch, patchUrl);

  type ViewerSerializedHeader = Omit<Header, 'length'> & { length?: number; name: string };
  let headers: ViewerSerializedHeader[] = [];
  let rows = [];

  let foreignTableKeys = [];
  let foreignTableName: string[] = [];
  // let foreignRows = {
  //   tableName: '',
  //   rows: []
  // }

  // foreignrows should be a set for each foreign table
  let foreignRows = new Map<string, any[]>(); // Map<foreignTableName, rows>

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

    // console.log('Processed headers:', headers);
    // console.log('Processed rows:', rows);

    headers.forEach((header) => {
      if (header.type.key) {
        // console.log('Key:', header.type.key);
        // console.log(header.name);
        foreignTableName.push(header.name);
        foreignTableKeys.push(header.type.key);
      }
    });


    // Identify foreign keys from headers
    const foreignKeys = headers.filter(
      (header) => header.type.key && 'table' in header.type.key && header.type.key.foreign
    );
    console.log('Foreign keys:', foreignKeys);

    // Fetch referenced tables
    const referencedTables = await Promise.all(
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

    console.log('Referenced tables:', referencedTables);

    // In the referencedtables.rows array

    // for each foreign key, get the processed rows that have a non-null value for the column that matches the foreign key
    // then use it in referencedTables.rows to get the row that matches the foreign key
    // and log it to the console to see if it works

    // if there are referenced tables
    if (referencedTables.length > 0) {
      rows.forEach((row) => {
        // console.log('Row:', row);
        // console.log("Row Key", headers[1].name);
        // console.log('Row:', row[foreignTableName]);

        foreignTableName.forEach((name) => {
          if (row[name] === null) {
            return;
          }

          

          // console.log('Row:', row[name]);
          referencedTables.forEach((refTable) => {
            if (refTable && row[name] in refTable.rows) {
              // console.log('Row:', row[name]);
              // console.log('Ref Table:', refTable.rows[row[name]]);

              // push the row to the foreignRows array in the foreign table
              if (foreignRows.has(refTable.tableName)) {
                foreignRows.set(refTable.tableName, [...(foreignRows.get(refTable.tableName) || []), refTable.rows[row[name]]]);
              } else {
                foreignRows.set(refTable.tableName, [refTable.rows[row[name]]]);
              }
            }

          });
        });
      });
    } else {
      console.log('No referenced tables found, skipping foreign key processing.');
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
    foreignTableName,
    foreignRows
  };
};
