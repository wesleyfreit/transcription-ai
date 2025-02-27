import js from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '*.json'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: eslintPluginPrettier,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': [
        'warn',
        {
          configFike: '.prettierrc',
        },
      ],
    },
  },
);
