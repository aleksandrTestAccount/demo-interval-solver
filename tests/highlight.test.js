import { describe, it, expect } from 'vitest'
import { createHighlighter } from '../src/utils/highlight.js'

const TOKEN_TYPES = {
  KEYWORD: 'keyword',
  NUMBER: 'number',
  COMMENT: 'comment'
}

const TEST_GRAMMAR = {
  patterns: [
    { name: TOKEN_TYPES.COMMENT, match: '//.*$' },
    { name: TOKEN_TYPES.KEYWORD, match: '\\b(size|if)\\b' },
    { name: TOKEN_TYPES.NUMBER, match: '\\b\\d+\\b' }
  ]
}

describe('createHighlighter', () => {
  const highlight = createHighlighter(TEST_GRAMMAR, { classPrefix: 'test-' })

  it('applies configured token classes to matching patterns', () => {
    const html = highlight('size 42 // note')

    expect(html).toContain(`<span class="test-${TOKEN_TYPES.KEYWORD}">size</span>`)
    expect(html).toContain(`<span class="test-${TOKEN_TYPES.NUMBER}">42</span>`)
    expect(html).toContain(`<span class="test-${TOKEN_TYPES.COMMENT}">// note</span>`)
  })

  it('escapes HTML special characters to prevent XSS', () => {
    const html = highlight('<script>alert(1)</script>')
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;')
    expect(html).toContain('&gt;')
  })

  it('handles empty or nullish inputs safely', () => {
    expect(highlight('')).toBe('')
    expect(highlight(null)).toBe('')
    expect(highlight(undefined)).toBe('')
  })
})