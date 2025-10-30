// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Используем @use вместо @import
          additionalData: `
            
            @use "/src/styles/global" as *;
          `
        }
      }
    }
  }
});