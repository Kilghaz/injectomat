module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        allowImportExportEverywhere: true
    },
    rules: {
        "no-console": "warn",
        "no-debugger": "warn",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        curly: ["error", "all"],
    },
    overrides: [
        {
            files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],
            env: {
                jest: true,
            },
        },
    ],
};
