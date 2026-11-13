<script setup>
defineProps({
  links: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-title">Architecture & Engine</div>
          <p class="footer-text">
            Equations are decomposed into primitive relations over typed domains. The engine
            combines <strong>interval constraint propagation</strong> along a dependency graph with
            <strong>trail-based backtracking</strong> search.
          </p>
        </div>

        <div class="footer-col">
          <div class="footer-title">Search Strategy</div>
          <p class="footer-text">
            Variables are branched using a <code>dom/wdeg</code> heuristic—prioritizing boolean
            flags first, followed by bisection of the tightest numeric intervals with full state
            rollback on conflict.
          </p>
        </div>

        <div class="footer-col">
          <div class="footer-title">Resources</div>
          <div v-if="links.length > 0" class="footer-links">
            <a
              v-for="link in links"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
            >
              {{ link.title }}
            </a>
          </div>
          <p class="footer-meta">Educational & Interview Demo</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  position: relative;
  margin-top: auto;
  background-color: rgba(14, 14, 17, 0.85);
  border-top: 1px solid var(--border-color);
  padding: 40px 24px 36px;
}

.app-footer::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(59, 130, 246, 0.25) 30%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(59, 130, 246, 0.25) 70%,
    transparent 100%
  );
}

.footer-inner {
  max-width: 1350px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.footer-title {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-main);
  margin-bottom: 10px;
}

.footer-text {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.footer-text strong {
  color: #cbd5e1;
  font-weight: 600;
}

.footer-text code {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-variable);
  background-color: rgba(255, 255, 255, 0.05);
  padding: 1px 5px;
  border: 1px solid var(--border-color);
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.footer-link {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--text-main);
  text-decoration: none;
  padding: 5px 12px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.footer-link:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background-color: #1e1e24;
}

.footer-meta {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: #64748b;
}

@media (max-width: 860px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
