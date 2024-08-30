import eslint from "eslint";

const { ESLint } = eslint;

export default new ESLint({
  baseConfig: {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: ["eslint:recommended"],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      indent: ["error", 2],
      quotes: ["error", "single"],
      semi: ["error", "always"],
    },
  },
});
