interface File {
  basename: string;
  url: string;
}

export async function fetchDatFiles(fetch: (input: RequestInfo | URL) => Promise<Response>, patchUrl: string): Promise<{ name: string; url: string }[]> {
  const indexUrl = `https://ggpk.exposed/files?q=index&adapter=${encodeURIComponent(patchUrl)}&path=data&extension=datc64`;
  try {
    const response = await fetch(indexUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fileList = await response.json();
    return fileList.files.map((file: File) => ({
      name: file.basename,
      url: file.url
    }));
  } catch (error) {
    console.error('Failed to fetch dat files:', error);
    throw error;
  }
}