import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const applicationFiles = ['src/**/*.{ts,tsx}', 'vite.config.ts'];
const typedRules = [
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
].map((config) => ({ ...config, files: applicationFiles }));
const scriptTypeScriptRules = [
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
].map((config) => ({ ...config, files: ['scripts/**/*.ts'] }));

export default tseslint.config(
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'node_modules/**',
      '.image-work/**',
    ],
  },
  js.configs.recommended,
  ...typedRules,
  ...scriptTypeScriptRules,
  {
    files: applicationFiles,
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      ...reactRefresh.configs.vite.rules,
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
  {
    files: ['scripts/**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
);
