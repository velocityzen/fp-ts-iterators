// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["build/*", "coverage/*"] },
  {
    files: ["rollup.config.ts", "lib/**/*.ts", "tests/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        // projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      {
        rules: {
          "@typescript-eslint/array-type": "off",
          "@typescript-eslint/prefer-function-type": "off",
          "@typescript-eslint/require-await": "off",
          "@typescript-eslint/no-empty-object-type": "off",
          "@typescript-eslint/no-unused-vars": [
            "error",
            {
              argsIgnorePattern: "^_",
              caughtErrorsIgnorePattern: "^_",
              destructuredArrayIgnorePattern: "^_",
              varsIgnorePattern: "^_",
            },
          ],
          "@typescript-eslint/restrict-template-expressions": [
            "error",
            { allowNumber: true },
          ],
        },
      },
    ],
  }
);
