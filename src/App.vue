<template>
  <div class="app-container">
    <HeroHeader :links="EXTERNAL_DOCS" />

    <CodeEditor
      v-model:code="sourceCode"
      :external-links="EXTERNAL_DOCS"
      @solved="handleSolverResult"
      @solving="handleSolvingStart"
    />

    <SolverResults v-if="solverData" ref="resultsRef" :data="solverData" />

    <MainNavbar v-model="currentPage" :pages="APP_PAGES" />

    <main class="main-content">
      <Transition name="page-fade" mode="out-in">
        <ContentView :chunks="currentChunks" :key="currentPage" @copy-code="handleCopyCode" />
      </Transition>
    </main>

    <AppFooter :links="EXTERNAL_DOCS" />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import HeroHeader from './components/HeroHeader.vue'
import MainNavbar from './components/MainNavbar.vue'
import CodeEditor from './components/CodeEditor.vue'
import SolverResults from './components/SolverResults.vue'
import ContentView from './views/ContentView.vue'
import AppFooter from './components/AppFooter.vue'

import {
  APP_PAGES,
  PAGE_CONTENT_MAP,
  DEFAULT_PAGE_ID,
  DEFAULT_SOURCE_CODE,
  EXTERNAL_DOCS
} from './config/appConfig.js'

const currentPage = ref(DEFAULT_PAGE_ID)
const sourceCode = ref(DEFAULT_SOURCE_CODE)
const solverData = ref(null)

const currentChunks = computed(() => {
  return PAGE_CONTENT_MAP[currentPage.value] || PAGE_CONTENT_MAP[DEFAULT_PAGE_ID]
})

async function handleSolverResult(result) {
  solverData.value = result 
  
  await nextTick()

  setTimeout(() => {
    const resultsElement = document.getElementById('results')
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, 100)
}

function handleCopyCode(newCode) {
  sourceCode.value = newCode

  const editorElement = document.getElementById('editor')

  if (editorElement) {
    editorElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const resultsRef = ref(null)

function handleSolvingStart() {
  resultsRef.value?.setExpanded(false)
}
</script>

<style scoped>
.app-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.15s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>
