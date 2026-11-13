import { ref, watch, onMounted } from 'vue'
import { createHighlighterCore } from '@shikijs/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

import e0Grammar from '../config/e0.tmLanguage.json'
import e0Theme from '../config/e0-dracula.theme.json'

export function useCodeHighlighter(sourceCode) {
  const highlightedCode = ref('')
  let highlighter = null

  const updateHighlight = (text) => {
    const safeText = text ?? ''
    if (!highlighter) {
      highlightedCode.value = safeText
      return
    }
    try {
      highlightedCode.value = highlighter.codeToHtml(safeText, {
        lang: e0Grammar.name,
        theme: e0Theme.name
      })
    } catch {
      highlightedCode.value = safeText
    }
  }

  onMounted(async () => {
    try {
      highlighter = await createHighlighterCore({
        themes: [],
        langs: [],
        engine: createJavaScriptRegexEngine()
      })

      await highlighter.loadTheme(e0Theme)
      await highlighter.loadLanguage({
        id: e0Grammar.name,
        ...e0Grammar
      })

      updateHighlight(sourceCode.value)
    } catch (err) {
      console.error('Failed to initialize syntax highlighter:', err)
    }
  })

  watch(
    sourceCode,
    (newVal) => {
      updateHighlight(newVal)
    },
    { immediate: true }
  )

  return {
    highlightedCode
  }
}
