import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  eslint.configs.recommended,
  {
    files: ["src/**/*.ts", "scripts/**/*.js"],
    languageOptions: {
      parser: tsparser,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      "indent": ["error", 2], 
      "quotes": ["error", "single"], 
      "semi": ["error", "always"], 
      "no-unused-vars": "error",
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "@typescript-eslint/no-explicit-any": "error",
      "no-unreachable": "error",
      "eqeqeq": ["error", "always"],
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "prefer-const": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          "selector": "variable",
          "format": ["camelCase", "UPPER_CASE"],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          "selector": "function",
          "format": ["camelCase"]
        },
        {
          "selector": "typeLike",
          "format": ["PascalCase"]
        }
      ]
    }
  }
];