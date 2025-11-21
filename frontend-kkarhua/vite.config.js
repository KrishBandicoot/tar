import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Entorno de testing (jsdom simula el navegador)
    environment: 'jsdom',
    
    // Archivo de setup que se ejecuta antes de los tests
    setupFiles: ['./src/test/setupTests.ts'],
    
    // Variables globales disponibles en los tests
    globals: true,
    
    // Configuración de coverage (cobertura de código)
    coverage: {
      // Proveedores de coverage: v8 (más rápido) o istanbul
      provider: 'v8',
      
      // Formatos de reporte
      reporter: ['text', 'html', 'json', 'lcov'],
      
      // Directorio donde se guardan los reportes
      reportsDirectory: './coverage',
      
      // Archivos a incluir en el análisis de cobertura
      include: [
        'src/**/*.{js,jsx}',
      ],
      
      // Archivos a excluir del análisis
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}',
        '**/main.jsx',
        '**/vite.config.js',
        '**/eslint.config.js'
      ],
      
      // Umbrales mínimos de cobertura
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60
      },
      
      // Incluir todos los archivos, incluso los no testeados
      all: true
    },
    
    // Configuración de timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Mostrar información detallada de los tests
    reporters: ['default', 'html'],
    
    // Configuración de mock
    mockReset: true,
    restoreMocks: true,
    clearMocks: true
  }
})