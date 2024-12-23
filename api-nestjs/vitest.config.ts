import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Define o ambiente como Node.js
    deps: {
      interopDefault: true, // Resolve corretamente importações default e nomeadas
    },
  },
});
