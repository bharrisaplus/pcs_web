import { test, expect } from '@playwright/test';

import { default as testShared } from '../../compass.mjs';

test.describe('Example', () => {
  test('has title', async ({ page: pwPage }) => {
    await pwPage.goto(`http://localhost:${testShared.SERVER_PORT}/`);

    await expect(pwPage).toHaveTitle("pcs:web");
  });
});
