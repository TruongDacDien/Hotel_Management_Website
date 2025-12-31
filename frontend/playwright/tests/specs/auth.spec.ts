import { test, expect } from '../fixtures';
import { seedLocalStorage, clearLocalStorage } from '../helpers/localStorage';

function uniqueEmail() {
  const ts = Date.now();
  return `student_${ts}@example.com`;
}

test.describe('WEB - Authentication (UC49)', () => {
  test('Register - successful flow (mocked)', async ({ page, mocks }) => {
    await clearLocalStorage(page);
    await page.goto('/auth');

    await page.getByRole('tab', { name: /Đăng ký/i }).click();

    await page.getByPlaceholder('John Doe').fill('Student Tester');
    await page.getByPlaceholder('irisus123').fill(uniqueEmail());
    await page.getByPlaceholder('+1 (123) 456-7890').fill('0901234567');
    await page.getByPlaceholder('••••••••').first().fill('Password123!');
    await page.getByPlaceholder('••••••••').nth(1).fill('Password123!');

    await page.getByRole('button', { name: /Đăng ký/i }).click();

    await expect(page).toHaveURL(/\/auth/);
    await expect(page.getByText('Đăng ký thành công')).toBeVisible();
  });

  test('Register - confirm password mismatch (client validation)', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/auth');
    await page.getByRole('tab', { name: /Đăng ký/i }).click();

    await page.getByPlaceholder('John Doe').fill('Student Tester');
    await page.getByPlaceholder('irisus123').fill(uniqueEmail());
    await page.getByPlaceholder('+1 (123) 456-7890').fill('0901234567');
    await page.getByPlaceholder('••••••••').first().fill('Password123!');
    await page.getByPlaceholder('••••••••').nth(1).fill('Different123!');

    await page.getByRole('button', { name: /Đăng ký/i }).click();
    await expect(page.getByText('Mật khẩu xác nhận không khớp')).toBeVisible();
  });

  test('Register - backend/DB failure handled (mocked error)', async ({ page, mocks }) => {
    mocks.set({ authSignUp: { success: false, message: 'DB down', status: 500 } });

    await clearLocalStorage(page);
    await page.goto('/auth');
    await page.getByRole('tab', { name: /Đăng ký/i }).click();

    await page.getByPlaceholder('John Doe').fill('Student Tester');
    await page.getByPlaceholder('irisus123').fill(uniqueEmail());
    await page.getByPlaceholder('+1 (123) 456-7890').fill('0901234567');
    await page.getByPlaceholder('••••••••').first().fill('Password123!');
    await page.getByPlaceholder('••••••••').nth(1).fill('Password123!');

    await page.getByRole('button', { name: /Đăng ký/i }).click();
    await expect(page.getByText('Không thể tạo tài khoản')).toBeVisible();
  });

  test('Login - successful flow (mocked)', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/auth');

    await page.getByPlaceholder('email@gmail.com').fill('test.user@example.com');
    await page.getByPlaceholder('Mật khẩu').fill('Password123!');

    await page.getByRole('button', { name: /Đăng nhập/i }).click();

    await expect(page.getByText('Đăng nhập thành công')).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('Login - invalid credentials handled (mocked)', async ({ page, mocks }) => {
    mocks.set({ authSignIn: { success: false, message: 'Invalid', status: 401 } });

    await clearLocalStorage(page);
    await page.goto('/auth');

    await page.getByPlaceholder('email@gmail.com').fill('wrong@example.com');
    await page.getByPlaceholder('Mật khẩu').fill('wrong');

    await page.getByRole('button', { name: /Đăng nhập/i }).click();

    await expect(page.getByText('Không thể đăng nhập')).toBeVisible();
  });
});
