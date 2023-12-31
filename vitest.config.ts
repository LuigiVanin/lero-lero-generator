import { defineConfig } from "vitest/config";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
    test: {
        include: ["tests/**/*.spec.ts"],
        includeSource: ["src/**/*.ts"],
    },
    plugins: [
        AutoImport({
            imports: ["vitest"],
            dts: true,
        }),
    ],
});
