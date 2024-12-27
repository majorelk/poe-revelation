export async function fetchVersion(fetch: (input: RequestInfo | URL) => Promise<Response>, gameVersion: string): Promise<{ patchUrl: string; versionNumber: string }> {
  const versionUrl = `https://ggpk.exposed/version?poe=${gameVersion}`;
  const patchUrl = await fetch(versionUrl).then((r) => r.text());

  const match = patchUrl.match(/\/([\d.]+)\/?$/);
  const versionNumber = match ? match[1] : '';

  if (!versionNumber) {
    throw new Error('Failed to extract version number from patch URL.');
  }

  return { patchUrl, versionNumber };
}
