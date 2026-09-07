import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],

  server: {
    watch: {
      /* Build output, not source. dist-ssr in particular is created and then
         deleted by the prerender step, and watching it crashes the dev server
         with EBUSY if anyone runs a build while `npm run dev` is up. */
      ignored: ['**/dist/**', '**/dist-ssr/**'],
    },
  },

  build: {
    /* Split the vendor chunk so a copy change doesn't invalidate the whole
       bundle in returning visitors' caches. Client build only — the SSR
       bundle externalises react, and manualChunks conflicts with that. */
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              react:  ['react', 'react-dom', 'react-router-dom'],
              motion: ['framer-motion'],
            },
          },
        },
  },

  ssr: {
    /* These ship ESM that must be bundled into the SSR build rather than
       externalised, or the prerender step fails to resolve them. */
    noExternal: ['framer-motion', 'lenis', 'react-helmet-async', 'react-icons'],
  },
}))
