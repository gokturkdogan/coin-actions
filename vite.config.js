import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0'
  },
  base: '/',
  css: {
    preprocessorOptions: {
/*       scss: {
        additionalData: `
          @use './src/assets/scss/variables/_colors' as *;
          @use './src/assets/scss/mixins/_mediaQueries' as *;
        `,
      }, */
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});