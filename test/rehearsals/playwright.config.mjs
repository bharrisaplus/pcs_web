import { defineConfig, devices } from '@playwright/test';

import { default as testShared } from '../compass.mjs';

let pwConfig;


pwConfig = defineConfig({
  testDir: "./dress",
  fullyParallel: true,
  workers: 3,
  tsconfig: `${testShared.project_path}/jsconfig.json`,
  testMatch: '*.q2q.mjs',
  outputDir: `./backstage/rehearsal-results`,

  use: {
    baseURL: `http://localhost:${testShared.SERVER_PORT}`,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome']
    }
  ],

  reporter: [
    [ 'html', { open: 'always', outputFolder: './backstage/rehearsal-report' } ]
  ],

  webServer: {
    command: `webdevn -d:${testShared.APP_DIR} -p:${testShared.SERVER_PORT}`,
    url: `http://localhost:${testShared.SERVER_PORT}`,
    cwd: testShared.project_path
  }
});


export default pwConfig