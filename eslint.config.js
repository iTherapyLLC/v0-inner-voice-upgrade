import js from "@eslint/js";
import nextPlugin from "eslint-config-next";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["node_modules/**", ".next/**", "out/**"],
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];
