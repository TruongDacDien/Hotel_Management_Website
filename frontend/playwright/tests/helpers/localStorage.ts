import type { Page } from '@playwright/test';

export async function seedLocalStorage(page: Page, kv: Record<string, any>) {
  await page.addInitScript(({ kv }) => {
    for (const [key, value] of Object.entries(kv)) {
      window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  }, { kv });
}

export async function clearLocalStorage(page: Page) {
  await page.addInitScript(() => window.localStorage.clear());
}
