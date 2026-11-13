import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  // Ignore build artifacts and minified external bundles
  {
    ignores: ['dist/**', 'public/**', 'docs/**']
  },

  // Base JS and Vue 3 recommended rules
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  // Environment globals (Browser + Web Worker)
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.worker
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }]
    }
  },

  // Disable ESLint formatting rules that conflict with Prettier
  eslintConfigPrettier
]