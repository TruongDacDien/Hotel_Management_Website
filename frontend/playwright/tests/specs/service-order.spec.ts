import { test, expect } from '../fixtures';
import { clearLocalStorage } from '../helpers/localStorage';

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

test.describe('WEB - Service Order (UC50)', () => {
  test('Services page lists services', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/services');
    await expect(page.getByText(/Dịch vụ/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Xem chi tiết/i }).first()).toBeVisible();
  });

  test('Service detail - not found shows error UI (mocked 404)', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/services/999');
    await expect(page.getByText('Lỗi dịch vụ')).toBeVisible();
  });

  test('Service order - successful flow adds service to cart', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/services/10/book');

    await page.getByPlaceholder('John Doe').fill('Student Tester');
    await page.getByPlaceholder('john@example.com').fill('student@example.com');
    await page.getByPlaceholder('+1 (123) 456-7890').fill('0901234567');

    // date is prefilled; re-fill to be explicit
    await page.locator('input[type="date"]').fill(todayISO());

    await page.getByRole('button', { name: 'Đặt ngay' }).click();
    await expect(page.getByText('Thêm giỏ hàng thành công!')).toBeVisible();

    await page.getByRole('button', { name: /Xem giỏ hàng/i }).click();
    await expect(page).toHaveURL('/cart');
  });

  test('Cart shows service item after adding', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/services/10/book');

    await page.getByPlaceholder('John Doe').fill('Student Tester');
    await page.getByPlaceholder('john@example.com').fill('student@example.com');
    await page.getByPlaceholder('+1 (123) 456-7890').fill('0901234567');

    await page.getByRole('button', { name: 'Đặt ngay' }).click();
    await page.getByRole('button', { name: /Xem giỏ hàng/i }).click();

    await expect(page.getByText('Airport Pickup')).toBeVisible();
  });
});
