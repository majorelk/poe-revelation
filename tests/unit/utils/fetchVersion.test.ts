import { describe, it, expect, vi } from 'vitest';
import { fetchVersion } from '$lib/utils/fetchVersion';

describe('fetchVersion', () => {
  it('should return patchUrl and versionNumber when fetch is successful and URL is valid', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve('https://example.com/3.14.0/'),
    });

    const result = await fetchVersion(mockFetch, '3.14.0');
    expect(result).toEqual({
      patchUrl: 'https://example.com/3.14.0/',
      versionNumber: '3.14.0',
    });
  });

  it('should throw an error when fetch is successful but URL is invalid', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve('https://example.com/invalid-url'),
    });

    await expect(fetchVersion(mockFetch, '3.14.0')).rejects.toThrow(
      'Failed to extract version number from patch URL.'
    );
  });

  it('should throw an error when fetch fails', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Fetch failed'));

    await expect(fetchVersion(mockFetch, '3.14.0')).rejects.toThrow('Fetch failed');
  });

  it('should handle edge cases with empty strings', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(''),
    });

    await expect(fetchVersion(mockFetch, '3.14.0')).rejects.toThrow(
      'Failed to extract version number from patch URL.'
    );
  });

  it('should handle edge cases with no matches', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve('https://example.com/'),
    });

    await expect(fetchVersion(mockFetch, '3.14.0')).rejects.toThrow(
      'Failed to extract version number from patch URL.'
    );
  });
});