import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/users': 'http://localhost:8080',
      '/income': 'http://localhost:8080',
      '/expenses': 'http://localhost:8080',
      '/categories': 'http://localhost:8080',
      '/budgets': 'http://localhost:8080',
      '/goals': 'http://localhost:8080',
      '/notifications': 'http://localhost:8080',
    }
  }
});
