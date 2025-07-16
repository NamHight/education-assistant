import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import unusedImports from "eslint-plugin-unused-imports"; // Make sure this import works
import { FlatCompat } from '@eslint/eslintrc'
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default defineConfig([
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    languageOptions: { globals: globals.browser }, 
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "unused-imports/no-unused-imports": "error",
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
       "react/react-in-jsx-scope": "off",
       "@typescript-eslint/no-unused-vars": "off",
    },
    settings: {
      react: {
        version: "detect",
      }
    },
    ignores: [
    'node_modules/',
    '.next/',
    '.idea/',
  ],
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
