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
  let table = tableName ? findTable(schemaFile!, tableName) : null;

  let { patchUrl, versionNumber } = await fetchVersion(fetch, gameVersion);
  let datFiles = await fetchDatFiles(fetch, patchUrl);

  // let headers: (Omit<Header, "length"> & { length?: number; })[] = [];
  type ViewerSerializedHeader = Omit<Header, 'length'> & { length?: number, name: string };
  let headers: ViewerSerializedHeader[] = [];
  let rows = [];

  if (browser && table) {
    const { readDatFile, getHeaderLength, readColumn } = await import('pathofexile-dat/dat.js');
    const result = await processTableData(
      tableName,
      datFiles,
      fetch,
      readDatFile,
      getHeaderLength,
      readColumn,
      table
    );
    headers = result.headers;
    rows = result.rows;
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
