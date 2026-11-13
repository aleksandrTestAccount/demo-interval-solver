<template>
  <aside class="sidebar">
    <ul class="sidebar-menu">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          :class="['sidebar-item', { active: activeId === item.id }]"
          @click="emit('select', item.id)"
        >
          <span class="active-indicator"></span>
          <span class="item-text">{{ item.title || item.name }}</span>
        </button>
      </li>
    </ul>
  </aside>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  activeId: { type: String, required: true }
})

const emit = defineEmits(['select'])
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-menu {
  list-style: none;
  padding: 12px 0;
  overflow-y: auto;
}

.sidebar-item {
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition:
    background-color 0.15s,
    color 0.15s;
  padding: 10px 24px;
}

.item-text {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--text-main);
  white-space: nowrap;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.sidebar-item.active {
  background-color: var(--bg-main);
}

.sidebar-item.active .item-text {
  color: var(--color-keyword);
  font-weight: bold;
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: transparent;
}

.sidebar-item.active .active-indicator {
  background-color: var(--color-keyword);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-height: 240px;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .sidebar-menu {
    padding: 8px 0;
    overflow-y: auto;
  }

  .sidebar-item {
    padding: 12px 24px;
  }

  .item-text {
    white-space: normal;
  }

  .active-indicator {
    width: 4px;
    height: 100%;
  }
}
</style>
