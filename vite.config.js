// https://vite.dev/config/
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: false, // 꼭 필요!
      svgrOptions: {
        icon: true,
      },
    }),
  ],
 
});
