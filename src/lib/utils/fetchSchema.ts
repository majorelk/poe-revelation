import type { SchemaFile, SchemaTable } from 'pathofexile-dat-schema';

export async function fetchSchema(fetch: (input: RequestInfo | URL) => Promise<Response>): Promise<SchemaFile | null> {
  try {
    return await fetch('/schema.min.json').then((r) => r.json());
  } catch (error) {
    console.error('Failed to fetch schema:', error);
    return null;
  }
}

export function findTable(schema: SchemaFile, tableName: string, version: string): SchemaTable | null {
  let table = schema?.tables.find((t) => {
    let tableNameRegex = new RegExp(`^${tableName}$`, 'i').test(t.name);

    if (tableNameRegex && t.validFor === parseInt(version, 10)) {
      return true;
    }
  });

  if (!table) {
    console.warn(`Table not found: ${tableName}`);
  }

  return table || null;
}
