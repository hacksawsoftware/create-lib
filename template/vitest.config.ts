/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
})

