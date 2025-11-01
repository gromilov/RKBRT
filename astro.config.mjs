// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    scopedStyleStrategy: 'none',
    css: {
      preprocessorOptions: {
        scss: {
          // Используем @use вместо @import
          additionalData: `
            
            @use "/src/styles/variables" as *;
          `
        }
      }
    }
  }
});