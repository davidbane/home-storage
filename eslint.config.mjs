import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import vue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  { ignores: ['**/dist/**', '**/node_modules/**', 'backend/**', '.yarn/**'] },

  js.configs.recommended,
  ...vue.configs['flat/strongly-recommended'],
  stylistic.configs.customize({ indent: 2, quotes: 'single', semi: true, braceStyle: '1tbs', commaDangle: 'always-multiline', arrowParens: true, jsx: false }),

  {
    languageOptions: { globals: globals.browser },
    rules: {
      // Every if/for/while gets braces, and a braced block never sits on one line.
      'curly': ['error', 'all'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
      // No single-letter names; say what the thing is.
      'id-length': ['error', { min: 2 }],

      // Templates first, then the script, then styles.
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      // An element with more than one attribute puts each on its own line.
      'vue/max-attributes-per-line': ['error', { singleline: { max: 1 }, multiline: { max: 1 } }],
      // Sibling elements in a template are separated by a blank line.
      'vue/padding-line-between-tags': ['error', [{ blankLine: 'always', prev: '*', next: '*' }]],
      'vue/multi-word-component-names': ['error', { ignores: ['App'] }],
      'vue/require-default-prop': 'off',
    },
  },

  {
    files: ['**/*.vue'],
    rules: {
      // Script code is indented one level inside <script>.
      '@stylistic/indent': 'off',
      'vue/script-indent': ['error', 2, { baseIndent: 1, switchCase: 1 }],
    },
  },

  {
    files: ['packages/tokens/scripts/**', '**/vite.config.js', 'eslint.config.mjs'],
    languageOptions: { globals: globals.node },
  },
];
