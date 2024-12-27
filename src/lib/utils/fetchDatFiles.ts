export async function fetchDatFiles(fetch: (input: RequestInfo | URL) => Promise<Response>, patchUrl: string): Promise<{ name: string; url: string }[]> {
  const indexUrl = `https://ggpk.exposed/files?q=index&adapter=${encodeURIComponent(patchUrl)}&path=data&extension=datc64`;
  const fileList = await fetch(indexUrl).then((r) => r.json());
  return fileList.files.map((file: any) => ({
    name: file.basename,
    url: file.url
  }));
}
