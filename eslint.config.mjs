import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // R3F's useFrame callback legitimately mutates Three.js objects
      // (camera.position, mesh.rotation, material.uniforms) every frame.
      // The React Compiler immutability rule is a false positive here.
      "react-hooks/immutability": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build/generator scripts (CommonJS, not part of the app),
    "scripts/**",
  ]),
]);

export default eslintConfig;
