<template>
  <div class="page-with-sidebar">
    <!-- Left navigation sidebar -->
    <Sidebar :items="chunks" :active-id="activeSectionId" @select="activeSectionId = $event" />

    <!-- Right content area with delegated copy click handler -->
    <section class="content-area" @click="handleContentClick">
      <Transition name="content-slide" mode="out-in">
        <div v-if="activeSection" :key="activeSection.id">
          <BaseChunk :html-content="activeSection.contentHtml" :file-name="activeSection.id" />
          <div class="content-spacer"></div>
        </div>
      </Transition>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import BaseChunk from '../components/BaseChunk.vue'

const props = defineProps({
  chunks: { type: Array, required: true }
})

const emit = defineEmits(['copy-code'])

const activeSectionId = ref(props.chunks[0]?.id || '')

// Reset to the first section when top navigation tab changes
watch(
  () => props.chunks,
  (newChunks) => {
    if (newChunks?.length > 0) {
      activeSectionId.value = newChunks[0].id
    }
  }
)

// Smoothly scroll to the navigation bar when switching sections in the sidebar
watch(activeSectionId, () => {
  const navbarElement = document.querySelector('.main-nav')

  if (navbarElement) {
    const topOffset = navbarElement.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: topOffset,
      behavior: 'smooth'
    })
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
})

const activeSection = computed(() => {
  return props.chunks.find((item) => item.id === activeSectionId.value) || props.chunks[0] || null
})

// Extract code from clicked copy button and emit it up to App.vue
const handleContentClick = (event) => {
  const copyBtn = event.target.closest('[data-action="copy"]')
  if (!copyBtn) return

  const wrapper = copyBtn.closest('.code-block-wrapper')
  const codeElement = wrapper?.querySelector('pre code')

  if (codeElement) {
    emit('copy-code', codeElement.innerText)
  }
}
</script>

<style scoped>
.page-with-sidebar {
  display: flex;
  flex: 1;
}

.content-area {
  flex: 1;
  padding: 40px;
  background-color: var(--bg-main);
  /* Prevents layout collapse during content transition */
  min-height: 100vh;
}

.content-spacer {
  height: 200px;
  width: 100%;
}

.content-slide-enter-active,
.content-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.content-slide-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.content-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

@media (max-width: 768px) {
  .page-with-sidebar {
    flex-direction: column;
  }

  .content-area {
    padding: 24px 16px;
    min-height: auto;
  }
}
</style>
