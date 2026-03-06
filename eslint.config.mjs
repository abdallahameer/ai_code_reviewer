export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    ignores: [".next/**", "node_modules/**"], // 🔹 استثناء ملفات build و node_modules
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-bind": "warn",
      "react/prop-types": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
