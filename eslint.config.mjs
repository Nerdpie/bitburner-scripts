// @ts-check

// Derived from the Google Typescript Style
// Augmented with pieces from the config used for Bitburner
// Converted to ESLint flat config format

// eslint-disable-next-line n/no-unpublished-import
import eslint              from "@eslint/js";
// eslint-disable-next-line n/no-unpublished-import
import eslintPluginImportX from "eslint-plugin-import-x";
import n                   from "eslint-plugin-n";
// noinspection SpellCheckingInspection
import tseslint            from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/build/**", "**/dist/**", "**/node_modules/**", "game_internal_types/**"],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  n.configs["flat/recommended"],
  {
    // While these may be included implicitly from their configs,
    // prefer depending upon them explicitly
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      n: n,
      "import-x": eslintPluginImportX,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        // I would prefer that it not exempt all arrow shorthand,
        // only that in a context that doesn't expect a return,
        // such as a forEach call...
        {"ignoreArrowShorthand": true},
      ],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {"allowConstantLoopConditions": true},
      ],
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-warning-comments": "off",
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          // If we don't do this, our checks for `exposeGameInternalObjects` will all be flagged
          "allowAny": true,
        },
      ],
      "block-scoped-var": "error",
      eqeqeq: "error",
      "import-x/consistent-type-specifier-style": "error",
      "import-x/first": "error",
      "n/no-empty-function": "off",
      "n/no-extraneous-import": [
        "error",
        {
          "allowModules": ["NetscriptDefinitions"],
        },
      ],
      "n/no-missing-import": "off",
      "n/no-missing-require": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "n/shebang": "off",
      "no-dupe-class-members": "off",
      "no-restricted-properties": [
        "error",
        {
          object: "describe",
          property: "only",
        },
        {
          object: "it",
          property: "only",
        },
      ],
      "no-restricted-syntax": [
        "error",
        // From https://typescript-eslint.io/troubleshooting/faqs/general/#how-can-i-ban-specific-language-feature
        // Use `#private` fields over the `private` modifier
        // `#private` fields remain private at runtime
        {
          "selector": ":matches(PropertyDefinition, MethodDefinition)[accessibility=\"private\"]",
          "message": "Use `#private` members instead.",
        },
      ],
      "no-trailing-spaces": "error",
      "no-var": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "require-atomic-updates": "off",
    },
  },
  {
    // disable type-aware linting on JS files
    files: ["**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
