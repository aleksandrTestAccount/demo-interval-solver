<template>
  <div class="chunk-wrapper" ref="chunkRoot" v-html="htmlContent"></div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { highlightCode } from '../utils/highlight.js'

const props = defineProps({
  htmlContent: { type: String, required: true },
  fileName: { type: String, default: 'example' }
})

const chunkRoot = ref(null)

const decodeHtmlEntities = (text) => {
  return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
}

const transformDOM = () => {
  if (!chunkRoot.value) return

  const preElements = chunkRoot.value.querySelectorAll('pre[data-lang="e0"]')

  preElements.forEach((pre, index) => {
    const rawCode = decodeHtmlEntities(pre.textContent || '')
    const highlightedHtml = highlightCode(rawCode)
    const fileIndex = index + 1

    const cardWrapper = document.createElement('div')
    cardWrapper.className = 'code-block-wrapper'
    cardWrapper.innerHTML = `
      <div class="code-header">
        <span class="code-lang">// ${props.fileName}_src_${fileIndex}.e0</span>
        <button type="button" class="copy-to-editor-btn" data-action="copy">Copy To Editor ↑</button>
      </div>
      <pre><code>${highlightedHtml}</code></pre>
    `

    pre.parentNode.replaceChild(cardWrapper, pre)
  })
}

onMounted(transformDOM)

watch(
  () => props.htmlContent,
  () => {
    nextTick(transformDOM)
  }
)
</script>

<style scoped>
.chunk-wrapper {
  width: 100%;
}

:deep(.chunk-paragraph) {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-main);
  margin-bottom: 24px;
}

:deep(.code-block-wrapper) {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  margin-top: 16px;
  margin-bottom: 28px;
}

:deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: rgba(255, 255, 255, 0.01);
  border-bottom: 1px solid var(--border-color);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

:deep(pre) {
  padding: 20px;
  overflow-x: auto;
  margin: 0;
  background: transparent;
}

:deep(code) {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-main);
  background: transparent;
  padding: 0;
}

:deep(.copy-to-editor-btn) {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--color-variable);
  padding: 4px 10px;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

:deep(.copy-to-editor-btn:hover) {
  background-color: rgba(133, 200, 255, 0.05);
  border-color: var(--color-variable);
  color: #fff;
}

:deep(.copy-to-editor-btn:active) {
  transform: scale(0.96);
}
</style>
