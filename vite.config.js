import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'offline.gif',
        'online.gif',
        'vite.svg'
      ],
      manifest: {
        name: 'Navigator Tasks',
        short_name: 'Navigator',
        description: 'App de tarefas com suporte offline',
        theme_color: '#ffffff',        
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,gif,png}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api-navigator\.vercel\.app\/listar-tarefas/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 3600 },
            },
          },
        ],
      },
    }),
  ],
})
