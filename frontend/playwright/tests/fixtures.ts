import { test as base, expect, type Page } from '@playwright/test';
import { defaultMockState, installApiMocks, type MockState } from './mocks/routes';

export type Fixtures = {
  mocks: { state: MockState; set: (patch: Partial<MockState>) => void };
};

export const test = base.extend<Fixtures>({
  mocks: async ({ page }, use) => {
    const state = defaultMockState();
    const set = (patch: Partial<MockState>) => Object.assign(state, patch);

    if (process.env.USE_MOCKS !== '0') {
      await installApiMocks(page, state);
    }

    await use({ state, set });
  },
});

export { expect };
