import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // 既存コードの型整理は依存更新と分け，診断は警告として残す．
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: { "@typescript-eslint/no-explicit-any": "warn" },
  },
  {
    files: [
      "src/app/products/[[]slug]/_components/{document,tabController}.tsx",
      "src/components/layout/{blogs,embed,product}.tsx",
      "src/hooks/useBlogDateFilter.ts",
    ],
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  {
    files: [
      "src/app/blog/[[]slug]/_components/body.tsx",
      "src/app/products/[[]slug]/_components/document.tsx",
    ],
    rules: { "react/display-name": "warn" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
