export async function fetchVersion(fetch: (input: RequestInfo | URL) => Promise<Response>, gameVersion: string): Promise<{ patchUrl: string; versionNumber: string }> {
  const versionUrl = `https://ggpk.exposed/version?poe=${gameVersion}`;
  
  let patchUrl: string;
  try {
    const response = await fetch(versionUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch version URL: ${response.statusText}`);
    }
    patchUrl = await response.text();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch operation failed: ${error.message}`);
    } else {
      throw new Error('Fetch operation failed: Unknown error');
    }  }

  const match = patchUrl.match(/\/([\d.]+)\/?$/);
  const versionNumber = match ? match[1] : '';

  if (!versionNumber) {
    throw new Error('Failed to extract version number from patch URL.');
  }

  return { patchUrl, versionNumber };
}