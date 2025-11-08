import { defineConfig } from 'astro/config';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  build: {
    assets: 'assets',
  },

  
  vite: {
    build: {
      minify: false,
      cssCodeSplit: false, // Отключаем разделение CSS
      rollupOptions: {
        output: {
          // Единый файл для JS
          entryFileNames: 'js/[name].js',
          
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'css/style.css'; // Единый файл для CSS
            }
            return 'images/[name].[ext]';
          }
        }
      }
    },
    css: {
      minify: false,
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "/src/styles/variables" as *;
          `
        }
      }
    }
  }
});