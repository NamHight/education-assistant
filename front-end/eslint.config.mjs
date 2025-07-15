import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import pluginUnusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    languageOptions: { globals: globals.browser }, 
    plugins: {
      unusedImports: {
        name: "unused-imports",
        plugin: pluginUnusedImports,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/react-in-jsx-scope": "off",
      "unused-imports/no-unused-imports": "error", 
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
