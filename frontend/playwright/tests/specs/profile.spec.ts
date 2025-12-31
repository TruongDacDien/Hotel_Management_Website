import { test, expect } from '../fixtures';
import { seedLocalStorage, clearLocalStorage } from '../helpers/localStorage';
import {
  mockLoggedInUser,
  mockHistoryEmpty,
  mockHistoryWithRoomAndService,
} from '../mocks/data';
import { historyAfterCancelRoom, historyAfterCancelService } from '../mocks/routes';

const USER_KEY = 'user';

test.describe('WEB - Booking Management (UC52-UC54)', () => {
  test('Profile requires login', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/userprofile');
    await expect(page.getByText('Vui lòng đăng nhập')).toBeVisible();
  });

  test('View booking history - no matching records', async ({ page, mocks }) => {
    mocks.set({ historySequence: [mockHistoryEmpty] });
    await seedLocalStorage(page, { [USER_KEY]: mockLoggedInUser });

    await page.goto('/userprofile');
    await page.getByRole('tab', { name: /Lịch sử đặt hàng/i }).click();

    await expect(page.getByText('Bạn chưa có đơn đặt chỗ nào.')).toBeVisible();
  });

  test('View booking history - has room & service records', async ({ page, mocks }) => {
    mocks.set({ historySequence: [mockHistoryWithRoomAndService] });
    await seedLocalStorage(page, { [USER_KEY]: mockLoggedInUser });

    await page.goto('/userprofile');
    await page.getByRole('tab', { name: /Lịch sử đặt hàng/i }).click();

    await expect(page.getByText('Số phòng')).toBeVisible();
    await expect(page.getByText('Huỷ đặt phòng')).toBeVisible();

    await page.getByRole('tab', { name: /Dịch vụ/i }).click();
    await expect(page.getByText('Huỷ dịch vụ')).toBeVisible();
  });

  test('Cancel room booking - successful flow', async ({ page, mocks }) => {
    mocks.set({ historySequence: [mockHistoryWithRoomAndService, historyAfterCancelRoom()] });
    await seedLocalStorage(page, { [USER_KEY]: mockLoggedInUser });

    await page.goto('/userprofile');
    await page.getByRole('tab', { name: /Lịch sử đặt hàng/i }).click();

    await page.getByRole('button', { name: /Huỷ đặt phòng/i }).click();
    await expect(page.getByText('Xác nhận huỷ')).toBeVisible();
    await page.getByRole('button', { name: /Xác nhận huỷ/i }).click();

    await expect(page.getByText('Huỷ thành công.')).toBeVisible();
  });

  test('Cancel service - successful flow', async ({ page, mocks }) => {
    mocks.set({ historySequence: [mockHistoryWithRoomAndService, historyAfterCancelService()] });
    await seedLocalStorage(page, { [USER_KEY]: mockLoggedInUser });

    await page.goto('/userprofile');
    await page.getByRole('tab', { name: /Lịch sử đặt hàng/i }).click();
    await page.getByRole('tab', { name: /Dịch vụ/i }).click();

    await page.getByRole('button', { name: /Huỷ dịch vụ/i }).click();
    await expect(page.getByText('Xác nhận huỷ')).toBeVisible();
    await page.getByRole('button', { name: /Xác nhận huỷ/i }).click();

    await expect(page.getByText('Huỷ thành công.')).toBeVisible();
  });
});
