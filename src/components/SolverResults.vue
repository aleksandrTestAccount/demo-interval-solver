<template>
  <div v-if="data" id="results" class="solver-card animate-fade">
    <div class="card-top-bar" :class="{ 'is-collapsed': !isExpanded }">
      <span class="bar-label"></span>

      <button type="button" class="toggle-btn" @click="toggleExpand">
        {{ isExpanded ? 'Hide ▲' : 'Show ▼' }}
      </button>
    </div>

    <div class="collapsible-wrapper" :class="{ 'is-open': isExpanded }">
      <div class="collapsible-inner">
        <!-- Compiler or Syntax Error -->
        <div v-if="data.isCrashError" class="error-msg-section">
          <div class="status-row">
            <div class="badge badge-error">Compiler Error</div>
          </div>
          <div class="error-title">Parsing or Syntax Exception:</div>
          <pre class="error-box"><code>{{ data.message }}</code></pre>
        </div>

        <!-- Standard Output (Success or False) -->
        <div v-else class="results-body">
          <!-- Generator Mode Output -->
          <div v-if="data.generatorCode" class="generator-container">
            <div class="generator-title">Result:</div>
            <pre class="format-result-box"><code>{{ data.generatorFormat }}</code></pre>

            <div class="generator-title">Code:</div>
            <pre class="el-code-box"><code v-html="highlight(data.generatorCode)"></code></pre>

            <div class="solver-result-title">Equation solver result:</div>
          </div>

          <!-- Solver Execution Status -->
          <div class="status-row">
            <div v-if="data.results === false" class="badge badge-false">Result: False</div>
            <div v-else class="badge badge-true">Result: True</div>
          </div>

          <!-- Binary Search Steps -->
          <div v-if="data.binarySearchSteps?.length > 0" class="output-section">
            <div class="section-header">binarySearchSteps</div>
            <div class="binary-steps-block">
              <div v-for="(step, idx) in data.binarySearchSteps" :key="idx" class="step-item">
                <code v-html="highlight(step)"></code>
              </div>
            </div>
          </div>

          <!-- Computed Variables -->
          <div v-if="data.inputVarsResults" class="output-section">
            <div class="section-header">Results</div>
            <div class="vars-list">
              <div v-for="(val, varName) in data.inputVarsResults" :key="varName" class="var-item">
                <span class="var-key">{{ varName }}:</span>
                <span class="var-val" v-html="highlight(val)"></span>
              </div>
            </div>
          </div>

          <!-- Substituted Equations -->
          <div
            v-if="data.results !== false && formattedEquations.length > 0"
            class="output-section"
          >
            <div class="section-header">Equations</div>
            <div class="equations-block">
              <div v-for="(eq, idx) in formattedEquations" :key="idx" class="eq-item">
                <code class="eq-comment">// {{ eq.original }}</code>
                <code class="eq-result" v-html="eq.substitutedHtml"></code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, toRaw } from 'vue'
import { highlightCode } from '../utils/highlight.js'

const props = defineProps({
  data: { type: Object, default: null }
})

const highlight = (text) => highlightCode(String(text ?? ''))

const formatEquationLine = (lineTokens, results) => {
  let substitutedHtml = ''
  let rightSideText = ''

  for (const rawToken of lineTokens) {
    const token = String(rawToken)
    const computedValue = results[token]

    const leftTokenText = computedValue === undefined ? `${token} ` : ` ${computedValue} `

    rightSideText += `${token} `
    substitutedHtml += highlightCode(leftTokenText)
  }

  return {
    substitutedHtml,
    original: rightSideText.replace(/\s+/g, ' ').trim()
  }
}

const formattedEquations = computed(() => {
  const tokensLines = props.data?.tokensLines
  if (!Array.isArray(tokensLines) || tokensLines.length === 0) return []

  const rawLines = toRaw(tokensLines)
  const rawResults = toRaw(props.data.inputVarsResults) || {}

  return rawLines.map((line) => formatEquationLine(toRaw(line) || [], rawResults))
})

const isExpanded = ref(true)

watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      isExpanded.value = true
    }
  }
)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function setExpanded(value) {
  isExpanded.value = Boolean(value)
}

defineExpose({ setExpanded })
</script>

<style scoped>
.solver-card {
  margin: 16px 24px;
  font-family: var(--font-sans);
  color: var(--text-main);
}

.status-block {
  padding: 14px 16px;
  background-color: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid var(--border-color);
}

.status-block-inner {
  padding: 4px 0 12px 0;
}

.badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-weight: 700;
}

.badge-true {
  color: var(--color-keyword);
}

.badge-false {
  color: #ff5555;
}

.badge-error {
  color: var(--color-numeric);
}

/* Generator mode output styles */
.generator-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 16px;
}

.generator-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
  margin-top: 4px;
}

.format-result-box {
  margin: 0;
  padding: 10px 14px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.format-result-box code {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--color-variable);
  font-weight: bold;
}

.el-code-box {
  margin: 0;
  padding: 14px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow-x: auto;
}

.el-code-box code {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-main);
}

.solver-result-title {
  font-family: var(--font-sans);
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 16px;
}

/* Error block styles */
.error-msg-section {
  padding: 16px;
  background-color: rgba(255, 85, 85, 0.03);
}

.error-title {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: #ff5555;
  margin-bottom: 6px;
  font-weight: bold;
}

.error-box {
  margin: 0;
  padding: 12px;
  background-color: var(--bg-tertiary);
  border: 1px solid rgba(255, 85, 85, 0.15);
  border-radius: 4px;
  overflow-x: auto;
}

.error-box code {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: #ff5555;
  white-space: pre-wrap;
}

/* Standard results body */
.results-body {
  padding: 10px 0 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.output-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-header {
  font-size: 0.95rem;
  font-weight: 600;
  font-family: var(--font-sans);
}

.vars-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 12px;
}

.var-item {
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.var-key {
  color: var(--color-variable);
  margin-right: 8px;
}

.var-val {
  font-weight: bold;
}

.binary-steps-block,
.equations-block {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.step-item code {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.equations-block {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-x: auto;
}

.eq-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.5;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.eq-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.eq-comment {
  color: var(--color-comment);
  font-style: italic;
  white-space: pre-wrap;
}

.eq-result {
  color: var(--text-main);
  white-space: pre-wrap;
}

.animate-fade {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.25s ease;
}

.card-top-bar.is-collapsed {
  border-bottom-color: transparent;
}

.bar-label {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--text-muted);
}

.toggle-btn {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border-color);
  padding: 4px 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.toggle-btn:hover {
  color: var(--text-main);
  border-color: rgba(255, 255, 255, 0.28);
  background-color: rgba(255, 255, 255, 0.04);
}

.collapsible-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.25s ease;
}

.collapsible-wrapper.is-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.collapsible-inner {
  overflow: hidden;
  min-height: 0;
}

.status-row {
  margin-bottom: 16px;
}
</style>
