import { describe, it, expect } from 'vitest';
import { filterEnglishContent } from '$lib/utils/fetchStatDescriptions';

describe('filterEnglishContent', () => {
  it('should return the same string if there are no language blocks', () => {
    const input = 'description "This is a test description."';
    const output = filterEnglishContent(input);
    expect(output).toBe(input);
  });

  it('should remove a single language block', () => {
    const input = 'lang "fr" This is French content. description "This is a test description."';
    const expectedOutput = 'description "This is a test description."';
    const output = filterEnglishContent(input);
    expect(output).toBe(expectedOutput);
  });

  it('should remove multiple language blocks', () => {
    const input = 'lang "fr" This is French content. lang "de" This is German content. description "This is a test description."';
    const expectedOutput = 'description "This is a test description."';
    const output = filterEnglishContent(input);
    expect(output).toBe(expectedOutput);
  });

  it('should handle mixed content with descriptions', () => {
    const input = 'description "This is a test description." lang "fr" This is French content. description "Another description." lang "de" This is German content.';
    const expectedOutput = 'description "This is a test description." description "Another description."';
    const output = filterEnglishContent(input);
    expect(output).toBe(expectedOutput);
  });

  it('should handle edge case with empty string', () => {
    const input = '';
    const output = filterEnglishContent(input);
    expect(output).toBe('');
  });

  it('should handle edge case with no matches', () => {
    const input = 'This is some random text without any language blocks.';
    const output = filterEnglishContent(input);
    expect(output).toBe(input);
  });
});