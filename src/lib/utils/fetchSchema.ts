import type { SchemaFile, SchemaTable } from 'pathofexile-dat-schema';

export async function fetchSchema(fetch: (input: RequestInfo | URL) => Promise<Response>): Promise<SchemaFile | null> {
  try {
    return await fetch('/schema.min.json').then((r) => r.json());
  } catch (error) {
    console.error('Failed to fetch schema:', error);
    return null;
  }
}

export function findTable(schema: SchemaFile, tableName: string): SchemaTable | null {
  return schema?.tables.find((t) => new RegExp(`^${tableName}$`, 'i').test(t.name)) || null;
}
