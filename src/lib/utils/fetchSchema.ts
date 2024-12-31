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
  const versionNumber = parseInt(version, 10);
  return schema?.tables.find((t) => {
    const tableNameMatches = new RegExp(`^${tableName}$`, 'i').test(t.name);
    return tableNameMatches && (t.validFor === versionNumber || t.validFor === 3);
  }) || null;
}
