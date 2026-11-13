<template>
  <header id="editor" class="app-header">
    <div class="editor-wrapper">
      <div class="editor-top-bar">
        <div class="editor-label">Equation Solver v0.2 : Interval-Arithmetic-Based Solver</div>

        <div v-if="externalLinks.length > 0" class="external-links">
          <a
            v-for="link in externalLinks"
            :key="link.url"
            :href="link.url"
            rel="noopener noreferrer"
            class="external-link"
          >
            {{ link.title }}
          </a>
        </div>
      </div>

      <div class="editor-container">
        <div class="line-numbers-sidebar" ref="numbersColumn">
          <div v-for="n in totalLines" :key="n" class="line-num">{{ n - 1 }}</div>
        </div>

        <div class="editor-workspace">
          <pre class="highlight-layer" ref="preRef"><code v-html="highlightedCode"></code></pre>

          <textarea
            ref="textareaRef"
            class="input-layer"
            v-model="sourceCode"
            placeholder="// Enter E0 code here..."
            spellcheck="false"
            @input="handleInput"
            @scroll="syncScroll"
            @click="syncScroll"
          ></textarea>
        </div>
      </div>

      <div class="actions-panel">
        <button type="button" v-if="isCalculating" class="stop-btn" @click="handleStop">
          Stop Solver
        </button>
        <button type="button" class="solve-btn" :disabled="isCalculating" @click="handleSolve">
          {{ isCalculating ? 'Calculating...' : 'Solve' }}
        </button>
      </div>

      <div class="worker-progress-panel" :class="{ 'panel-visible': isCalculating && progressMsg }">
        <div class="progress-line-wrapper">
          <div v-if="progressMsg" class="progress-line">// [Status]: {{ progressMsg }}</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch, computed, onBeforeUnmount, nextTick } from 'vue'
import { SolverWrapper } from '../domain/SolverWrapper.js'
import { useCodeHighlighter } from '../composables/useCodeHighlighter.js'

const props = defineProps({
  code: { type: String, required: true },
  externalLinks: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:code', 'solved', 'solving'])

// 1. Text management and DOM refs
const sourceCode = computed({
  get: () => props.code,
  set: (val) => emit('update:code', val)
})

const numbersColumn = ref(null)
const preRef = ref(null)
const textareaRef = ref(null)

const totalLines = computed(() => sourceCode.value.split('\n').length || 1)

// 2. Syntax highlighting
const { highlightedCode } = useCodeHighlighter(sourceCode)

// 3. Scroll synchronization
const syncScroll = () => {
  const textarea = textareaRef.value
  if (!textarea) return

  if (preRef.value) {
    preRef.value.scrollTop = textarea.scrollTop
    preRef.value.scrollLeft = textarea.scrollLeft
  }
  if (numbersColumn.value) {
    numbersColumn.value.scrollTop = textarea.scrollTop
  }
}

const handleInput = () => {
  nextTick(syncScroll)
}

watch(sourceCode, () => {
  nextTick(() => {
    if (textareaRef.value && textareaRef.value.scrollTop === 0) {
      syncScroll()
    }
  })
})

// 4. Solver interaction
const isCalculating = ref(false)
const progressMsg = ref('')
let progressTimeout = null
const solverWrapper = new SolverWrapper()

const cleanUiState = () => {
  if (progressTimeout) {
    clearTimeout(progressTimeout)
    progressTimeout = null
  }
  isCalculating.value = false
  progressMsg.value = ''
}

const handleSolve = () => {
  emit('solving')

  cleanUiState()

  progressTimeout = setTimeout(() => {
    isCalculating.value = true
    progressMsg.value = 'Starting worker thread...'
  }, 180)

  solverWrapper.solve(sourceCode.value, {
    onProgress: (msg) => {
      progressMsg.value = msg
    },
    onSuccess: (result) => {
      cleanUiState()
      emit('solved', result)
    },
    onFailure: (err) => {
      cleanUiState()
      emit('solved', {
        isCrashError: true,
        message: err?.message || 'Solver Error occurred',
        details: err?.stack || ''
      })
    }
  })
}

const handleStop = () => {
  cleanUiState()
  solverWrapper.terminate()
  emit('solved', {
    isCrashError: true,
    message: 'Solver Error: Stopped by user'
  })
}

onBeforeUnmount(() => {
  cleanUiState()
  solverWrapper.terminate()
})
</script>

<style scoped>
.app-header {
  padding: 16px 24px;
  background-color: var(--bg-secondary);
  border-bottom: 2px solid var(--border-color);
}

.editor-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.editor-container {
  display: flex;
  position: relative;
  width: 100%;
  height: 580px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-tertiary);
  overflow: hidden;
}

/* Line numbers column */
.line-numbers-sidebar {
  width: 44px;
  background-color: rgba(0, 0, 0, 0.15);
  border-right: 1px solid var(--border-color);
  padding: 14px 0 50px 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: hidden;
  flex-shrink: 0;
}

.line-num {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  line-height: 22px !important;
  color: var(--text-muted);
  opacity: 0.5;
  text-align: right;
  padding-right: 12px;
}

/* Code workspace layers */
.editor-workspace {
  position: relative;
  flex: 1;
  height: 100%;
}

.highlight-layer,
.input-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  /* Extra bottom padding prevents scroll jitter at the bottom edge */
  padding: 14px 14px 50px 14px;

  font-family: 'JetBrains Mono', 'DejaVu Sans Mono', monospace !important;
  font-size: 0.95rem !important;
  line-height: 22px !important;

  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
  box-sizing: border-box !important;
  overflow: auto !important;
  border: none !important;
  outline: none !important;
}

.input-layer {
  background: transparent;
  color: transparent !important;
  -webkit-text-fill-color: transparent;
  caret-color: var(--color-variable);
  resize: none;
  z-index: 2;
}

.highlight-layer {
  color: var(--text-main);
  z-index: 1;
  pointer-events: none;
}

/* Control buttons panel */
.actions-panel {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 14px;
}

.solve-btn {
  padding: 12px 48px;
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 600;
  color: #f8fafc;
  background-color: #1a306e;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.solve-btn:hover:not(:disabled) {
  background-color: #172554;
}

.solve-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.stop-btn {
  padding: 12px 24px;
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #b91c1c;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.stop-btn:hover {
  background-color: #991b1b;
}

/* Shiki theme overrides */
:deep(.shiki) {
  background-color: transparent !important;
  padding: 0 0 40px 0 !important;
  margin: 0 !important;
}

/* Worker progress drawer */
.worker-progress-panel {
  background-color: var(--bg-tertiary);
  border: 1px dashed transparent;
  border-radius: 4px;
  overflow: hidden;
  max-height: 0;
  margin-top: 0;
  opacity: 0;
  visibility: hidden;
  transition:
    max-height 0.25s ease-in-out,
    margin-top 0.25s ease-in-out,
    opacity 0.15s ease-in-out,
    border-color 0.15s ease-in-out;
}

.worker-progress-panel.panel-visible {
  max-height: 2000px;
  margin-top: 12px;
  opacity: 1;
  visibility: visible;
  border-color: var(--border-color);
}

.progress-line-wrapper {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-line {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-comment);
  font-style: italic;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.editor-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
}

.editor-label {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.external-links {
  display: flex;
  align-items: center;
  gap: 16px;
}

.external-link {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-variable);
  text-decoration: none;
  padding: 2px 8px;
  border: 1px solid rgba(133, 200, 255, 0.25);
  border-radius: 4px;
  transition: all 0.15s ease;
}

.external-link:hover {
  color: #fff;
  border-color: var(--color-variable);
  background-color: rgba(133, 200, 255, 0.08);
}
</style>
