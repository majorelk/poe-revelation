/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchDatFiles } from '$lib/utils/fetchDatFiles';
import { describe, it, expect } from 'vitest';

describe('fetchDatFiles', () => {
  it('should fetch and return a list of dat files', async () => {
    const mockFetch = async (input: RequestInfo | URL) => ({
      ok: true,
      json: async () => ({ files: [{ basename: 'file1.dat', url: 'http://example.com/file1.dat' }] })
    } as Response);
    const result = await fetchDatFiles(mockFetch, 'patchUrl');
    expect(result).toEqual([{ name: 'file1.dat', url: 'http://example.com/file1.dat' }]);
  });

  it('should handle empty file list', async () => {
    const mockFetch = async (input: RequestInfo | URL) => ({
      ok: true,
      json: async () => ({ files: [] })
    } as Response);
    const result = await fetchDatFiles(mockFetch, 'patchUrl');
    expect(result).toEqual([]);
  });

  it('should handle multiple files', async () => {
    const mockFetch = async (input: RequestInfo | URL) => ({
      ok: true,
      json: async () => ({
        files: [
          { basename: 'file1.dat', url: 'http://example.com/file1.dat' },
          { basename: 'file2.dat', url: 'http://example.com/file2.dat' }
        ]
      })
    } as Response);
    const result = await fetchDatFiles(mockFetch, 'patchUrl');
    expect(result).toEqual([
      { name: 'file1.dat', url: 'http://example.com/file1.dat' },
      { name: 'file2.dat', url: 'http://example.com/file2.dat' }
    ]);
  });

  it('should handle fetch errors', async () => {
    const mockFetch = async (input: RequestInfo | URL) => {
      throw new Error('Fetch error');
    };
    await expect(fetchDatFiles(mockFetch, 'patchUrl')).rejects.toThrow('Fetch error');
  });

  it('should handle invalid JSON response', async () => {
    const mockFetch = async (input: RequestInfo | URL) => ({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      }
    } as unknown as Response);
    await expect(fetchDatFiles(mockFetch, 'patchUrl')).rejects.toThrow('Invalid JSON');
  });

  it('should handle HTTP errors', async () => {
    const mockFetch = async (input: RequestInfo | URL) => ({
      ok: false,
      status: 404,
      json: async () => ({})
    } as Response);
    await expect(fetchDatFiles(mockFetch, 'patchUrl')).rejects.toThrow('HTTP error! status: 404');
  });
});