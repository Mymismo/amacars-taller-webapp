import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          'babel-plugin-macros',
          [
            '@emotion/babel-plugin-jsx-pragmatic',
            {
              export: 'jsx',
              import: '__cssprop',
              module: '@emotion/react',
            },
          ],
          [
            '@babel/plugin-transform-react-jsx',
            { pragma: '__cssprop' },
            'twin.macro',
          ],
        ],
        // Asegurarse de que Babel no transforme los módulos ES
        sourceMaps: true,
        babelrc: false,
        configFile: false,
      },
      // Configuración específica de Fast Refresh
      fastRefresh: {
        include: [
          './**/*.{js,jsx,ts,tsx}',
          '!./node_modules/**/*'
        ],
        exclude: ['**/node_modules/**/*']
      },
    }),
  ],
  server: {
    port: 3007,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react')
    },
    dedupe: ['@emotion/react', 'react', 'react-dom']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', '@chakra-ui/react', '@emotion/react', '@emotion/styled']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', '@chakra-ui/react', 'react', 'react-dom'],
    exclude: []
  },
  // Configuración adicional para mejorar el HMR
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
