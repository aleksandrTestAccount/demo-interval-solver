import { describe, it, expect } from 'vitest'
import { APP_PAGES, PAGE_CONTENT_MAP } from '../src/config/appConfig.js'

describe('Content Integrity', () => {
  it('has content mapped for every registered page', () => {
    for (const page of APP_PAGES) {
      const chunks = PAGE_CONTENT_MAP[page.id]
      expect(Array.isArray(chunks)).toBe(true)
      expect(chunks.length).toBeGreaterThan(0)
    }
  })

  it('loads non-empty HTML for every single section across all tabs', () => {
    for (const [pageId, chunks] of Object.entries(PAGE_CONTENT_MAP)) {
      for (const chunk of chunks) {
        expect(
          chunk.contentHtml.trim().length,
          `Missing or empty HTML file for section "${chunk.id}" in "${pageId}"`
        ).toBeGreaterThan(0)
      }
    }
  })
})