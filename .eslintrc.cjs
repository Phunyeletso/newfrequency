module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".checks", "scripts", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // Apostrophes are unambiguous in JSX text and the site copy is full of
    // them. Still guard the characters that genuinely confuse the parser.
    "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
    "react/prop-types": "off",
  },
};
