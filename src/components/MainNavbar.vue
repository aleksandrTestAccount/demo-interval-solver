<template>
  <nav class="main-nav">
    <!-- Left side: Branding and version -->
    <div class="nav-brand">
      <span class="brand-name">E0 Equation Language</span>
      <span class="brand-status">v0.2</span>
    </div>

    <!-- Right side: Horizontal navigation tabs -->
    <div class="nav-links">
      <button
        v-for="page in pages"
        :key="page.id"
        type="button"
        :class="['nav-link', { active: modelValue === page.id }]"
        @click="emit('update:modelValue', page.id)"
      >
        <span class="link-text">{{ page.title }}</span>
        <div class="active-bar"></div>
      </button>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
  pages: { type: Array, required: true }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.main-nav {
  background-color: var(--bg-secondary);
  border-bottom: 2px solid var(--border-color);
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  user-select: none;
}

.brand-name {
  color: #fff;
  font-weight: 800;
  letter-spacing: 1px;
}

.brand-status {
  color: var(--text-muted);
}

.nav-links {
  display: flex;
  gap: 16px;
  height: 100%;
}

.nav-link {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 12px;
  position: relative;
  transition: color 0.15s ease;
}

.nav-link:hover {
  color: #fff;
}

.nav-link.active {
  color: var(--color-variable);
}

.active-bar {
  position: absolute;
  bottom: -2px;
  left: 16px;
  right: 16px;
  height: 3px;
  background-color: transparent;
  transition: background-color 0.15s ease;
}

.nav-link.active .active-bar {
  background-color: var(--color-keyword);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .main-nav {
    padding: 0 16px;
  }

  .nav-brand {
    display: none;
  }

  .nav-links {
    width: 100%;
    justify-content: space-around;
    gap: 0;
  }

  .nav-link {
    font-size: 0.85rem;
    padding: 0 8px;
  }
}
</style>
