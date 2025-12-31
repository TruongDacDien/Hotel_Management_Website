import { test, expect } from '../fixtures';
import { clearLocalStorage } from '../helpers/localStorage';

function tomorrowISO(days = 1) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

test.describe('WEB - Room Booking (UC51)', () => {
  test('Home shows featured rooms section', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/');
    await expect(page.getByText('Nơi ở sang trọng')).toBeVisible();
    await expect(page.getByRole('link', { name: /Xem chi tiết/i }).first()).toBeVisible();
  });

  test('Rooms page lists room types', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/rooms');
    await expect(page.getByText('Dãy phòng sang trọng của chúng tôi')).toBeVisible();
    await expect(page.getByRole('link', { name: /Xem chi tiết/i }).first()).toBeVisible();
  });

  test('Room detail - not found shows error UI (mocked 404)', async ({ page, mocks }) => {
    // Remove room id 999 mapping so the mock returns 404
    mocks.set({ roomTypeById: { ...mocks.state.roomTypeById } });

    await clearLocalStorage(page);
    await page.goto('/rooms/999');
    await expect(page.getByText('Lỗi tìm phòng')).toBeVisible();
  });

  test('Room booking - validation when required data missing', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/rooms/1');

    // Only fill name & email; leave checkOut empty to trigger validation
    await page.getByPlaceholder('John Doe').fill('Student Tester');
    await page.getByPlaceholder('john@example.com').fill('student@example.com');

    // check-in is prefilled; check-out empty by default
    await page.getByRole('button', { name: 'Đặt ngay' }).click();

    await expect(page.getByText('Vui lòng điền đầy đủ thông tin!')).toBeVisible();
  });

  test('Room booking - successful flow adds room to cart', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/rooms/1');

    await page.getByPlaceholder('John Doe').fill('Student Tester');
    await page.getByPlaceholder('john@example.com').fill('student@example.com');

    // set check-out to tomorrow
    const dateInputs = page.locator('input[type="date"]');
    await dateInputs.nth(1).fill(tomorrowISO(2));

    await page.getByRole('button', { name: 'Đặt ngay' }).click();

    await expect(page.getByText('Đã thêm vào giỏ hàng!')).toBeVisible();
    await page.getByRole('button', { name: /Xem giỏ hàng/i }).click();
    await expect(page).toHaveURL('/cart');
  });

  test('Cart badge increases after adding room', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/rooms/1');

    await page.getByPlaceholder('John Doe').fill('Student Tester');
    await page.getByPlaceholder('john@example.com').fill('student@example.com');

    const dateInputs = page.locator('input[type="date"]');
    await dateInputs.nth(1).fill(tomorrowISO(2));

    await page.getByRole('button', { name: 'Đặt ngay' }).click();

    // The cart icon is a link to /cart; the badge is the span inside
    const badge = page.locator('a[href="/cart"] span');
    await expect(badge).toHaveText('1');
  });
});
