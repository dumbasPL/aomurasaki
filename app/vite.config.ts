import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import {ViteEjsPlugin} from 'vite-plugin-ejs';
import vue from '@vitejs/plugin-vue';
import resolveConfig from 'tailwindcss/resolveConfig';
import fs from 'fs';

const tailwindConfig = resolveConfig(JSON.parse(fs.readFileSync('tsconfig.config.json', 'utf-8')));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteEjsPlugin({
      getColor(name: string, value: number) {
        if (tailwindConfig.theme?.colors) {
          return (tailwindConfig.theme?.colors as Record<string, Record<string, string>>)[name][value];
        }
        return '#000';
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
