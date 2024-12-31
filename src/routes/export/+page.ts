import type { PageLoad } from './$types';
import { browser } from '$app/environment';

import { fetchSchema, findTable } from '$lib/utils/fetchSchema';
import { fetchVersion } from '$lib/utils/fetchVersion';
import { fetchDatFiles } from '$lib/utils/fetchDatFiles';
import { processTableData } from '$lib/utils/processTableData';
import type { Header } from 'pathofexile-dat/dat.js';

// 🚀 Page Load Function
export const load: PageLoad = async ({ fetch, url }) => {
  // Define an array of table names to process
  const tableNames = ['GemTags', 'GrantedEffects', 'GrantedEffectsPerLevel'];
  const gameVersion = url.searchParams.get('version') || '1';

  let schemaFile = await fetchSchema(fetch);
  let { patchUrl, versionNumber } = await fetchVersion(fetch, gameVersion);
  let datFiles = await fetchDatFiles(fetch, patchUrl);

  type ViewerSerializedHeader = Omit<Header, 'length'> & { length?: number; name: string } & { type: { key?: { table?: string; foreign?: boolean } } };

  let allData: Record<
    string,
    { headers: ViewerSerializedHeader[]; rows: any[] }
  > = {};

  if (browser && schemaFile) {
    const { readDatFile, getHeaderLength, readColumn } = await import('pathofexile-dat/dat.js');

    // Iterate over each table name and process them
    for (const tableName of tableNames) {
      let schemaTable = tableName ? findTable(schemaFile!, tableName, gameVersion) : null;

      if (schemaTable) {
        const result = await processTableData(
          tableName,
          datFiles,
          fetch,
          readDatFile,
          getHeaderLength,
          readColumn,
          schemaTable
        );

        console.log(`Processing table: ${tableName}`);
        console.log('Schema Table:', schemaTable);
        console.log('Processed Result:', result);

        allData[tableName] = {
          headers: result.headers,
          rows: result.rows,
        };
      }
    }
  }

  return {
    allData,
  };
};
