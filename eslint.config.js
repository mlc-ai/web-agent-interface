// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["**/dist", "**/lib", "**/node_modules"],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
