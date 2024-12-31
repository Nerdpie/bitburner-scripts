// @ts-check

// Derived from the Google Typescript Style
// Augmented with pieces from the config used for Bitburner
// Converted to ESLint flat config format

// eslint-disable-next-line n/no-unpublished-import
import eslint from '@eslint/js';
// eslint-disable-next-line n/no-unpublished-import
import eslintPluginImportX from 'eslint-plugin-import-x';
import n from 'eslint-plugin-n';
import prettier from 'eslint-plugin-prettier';
// noinspection SpellCheckingInspection
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/build/**', '**/dist/**', '**/node_modules/**', 'game_internal_types/**'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.strict,
  n.configs['flat/recommended'],
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      n: n,
      prettier: prettier,
      'import-x': eslintPluginImportX,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-warning-comments': 'off',
      'block-scoped-var': 'error',
      'eol-last': 'error',
      eqeqeq: 'error',
      'import-x/consistent-type-specifier-style': 'error',
      'import-x/first': 'error',
      'import-x/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
          },
        },
      ],
      'n/no-empty-function': 'off',
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/shebang': 'off',
      'no-dupe-class-members': 'off',
      'no-restricted-properties': [
        'error',
        {
          object: 'describe',
          property: 'only',
        },
        {
          object: 'it',
          property: 'only',
        },
      ],
      'no-trailing-spaces': 'error',
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prettier/prettier': 'error',
      quotes: [
        'warn',
        'single',
        {
          avoidEscape: true,
        },
      ],
      'require-atomic-updates': 'off',
    },
  },
  {
    // disable type-aware linting on JS files
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  }
);