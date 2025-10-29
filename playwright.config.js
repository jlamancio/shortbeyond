// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  globalSetup: './global.setup.js',
  testDir: './playwright/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never'}],['dot']] ,
  use: {
    baseURL: process.env.BASE_API,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'api-tests',
    },
  ],

});

