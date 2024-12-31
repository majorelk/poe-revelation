import type { PageLoad } from './$types';
import { browser } from '$app/environment';

import { fetchSchema, findTable } from '$lib/utils/fetchSchema';
import { fetchVersion } from '$lib/utils/fetchVersion';
import { fetchDatFiles } from '$lib/utils/fetchDatFiles';
import { processTableData } from '$lib/utils/processTableData';
import type { Header } from 'pathofexile-dat/dat.js';

// 🚀 Page Load Function
export const load: PageLoad = async ({ fetch, url }) => {
  const tableName = 'GemTags';
  const gameVersion = '2';

  let schemaFile = await fetchSchema(fetch);
  let schemaTable = tableName ? findTable(schemaFile!, tableName) : null;

  let { patchUrl, versionNumber } = await fetchVersion(fetch, gameVersion);
  let datFiles = await fetchDatFiles(fetch, patchUrl);

  type ViewerSerializedHeader = Omit<Header, 'length'> & { length?: number; name: string } & { type: { key?: { table?: string; foreign?: boolean } } };
  let headers: ViewerSerializedHeader[] = [];
  let gemTags: any[] = [];

  if (browser && schemaTable) {
    const { readDatFile, getHeaderLength, readColumn } = await import('pathofexile-dat/dat.js');

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
    gemTags = result.rows;
  }

  return {
    headers,
    gemTags
  };
};
