import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'accessibleFlatpickr',
      fileName: 'accessible-flatpickr',
      formats: ['umd']
    },
    rollupOptions: {
      external: ['flatpickr'],
      output: {
        globals: {
          'flatpickr': 'flatpickr'
        }
      }
    },
    sourcemap: true,
    target: 'es2015'
  },
  server: {
    port: 3000,
    open: '/demo/index.html'
  },
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setup.ts']
  }
});
