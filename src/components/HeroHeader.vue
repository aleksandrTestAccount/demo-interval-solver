<script setup>
defineProps({
  links: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-badge">
        <span class="dot"></span>
        Technical Interview Demo · Educational Project
      </div>

      <h1 class="hero-title">E0 Equation Solver</h1>

      <p class="hero-subtitle">
        An interactive web playground and interval-arithmetic constraint solver built from scratch
        to demonstrate frontend architecture, Web Workers multithreading, and custom DSL tooling.
      </p>

      <div v-if="links.length > 0" class="hero-links">
        <a
          v-for="link in links"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="hero-link"
        >
          {{ link.title }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 120px 24px 96px;
  text-align: center;
  background-color: transparent;
  background-image:
    radial-gradient(ellipse 70% 55% at 50% -5%, rgba(59, 130, 246, 0.2), transparent 70%),
    radial-gradient(ellipse 40% 35% at 50% 25%, rgba(16, 185, 129, 0.08), transparent 70%);
}

/* Bottom light beam separator */
.hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(59, 130, 246, 0.25) 25%,
    rgba(255, 255, 255, 0.45) 50%,
    rgba(59, 130, 246, 0.25) 75%,
    transparent 100%
  );
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 1060px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 24px rgba(59, 130, 246, 0.12);
  margin-bottom: 36px;
  opacity: 0;
  animation: cinematicReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  box-shadow: 0 0 12px #10b981;
  animation: pulseDot 2.5s infinite ease-in-out;
}

/* Static metallic gradient title after smooth entrance */
.hero-title {
  font-size: clamp(3.4rem, 7.5vw, 6rem);
  font-weight: 900;
  letter-spacing: -0.045em;
  line-height: 1.02;
  margin-bottom: 28px;
  background: linear-gradient(180deg, #ffffff 15%, #94a3b8 65%, #64748b 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.55));
  opacity: 0;
  animation: cinematicReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.12s forwards;
}

.hero-subtitle {
  font-size: clamp(1.15rem, 2vw, 1.38rem);
  line-height: 1.65;
  color: var(--text-muted);
  max-width: 800px;
  margin-bottom: 44px;
  opacity: 0;
  animation: cinematicReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.24s forwards;
}

.hero-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  opacity: 0;
  animation: cinematicReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.36s forwards;
}

.hero-link {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text-main);
  text-decoration: none;
  padding: 14px 30px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
}

.hero-link:hover {
  border-color: rgba(255, 255, 255, 0.45);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%);
  box-shadow:
    0 0 28px rgba(59, 130, 246, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

@keyframes cinematicReveal {
  from {
    opacity: 0;
    transform: translateY(26px) scale(0.97);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes pulseDot {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.45;
    transform: scale(0.85);
  }
}
</style>
