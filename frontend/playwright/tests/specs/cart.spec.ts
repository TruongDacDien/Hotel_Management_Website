import { test, expect } from '../fixtures';
import { seedLocalStorage, clearLocalStorage } from '../helpers/localStorage';

const CART_KEY = 'hotel-cart';

const seededCart = [
  {
    id: 'room-1-2025-01-01-2025-01-03',
    roomId: 1,
    name: 'Deluxe Double',
    price: 1200000,
    imageUrl: 'https://example.com/room1.jpg',
    quantity: 1,
    checkIn: '2025-01-01',
    checkOut: '2025-01-03',
    type: 'room',
    guestInfo: { name: 'Student Tester', email: 'student@example.com', phone: '0901234567' },
  },
  {
    id: 'service-10',
    serviceId: 10,
    name: 'Airport Pickup',
    price: 350000,
    imageUrl: 'https://example.com/svc1.jpg',
    offeredDate: '2025-01-01',
    guestInfo: { name: 'Student Tester', email: 'student@example.com', phone: '0901234567' },
    quantity: 1,
    type: 'service',
  },
];

test.describe('WEB - Cart & Booking Checkout', () => {
  test('Cart empty state', async ({ page }) => {
    await clearLocalStorage(page);
    await page.goto('/cart');
    await expect(page.getByText('Giỏ hàng trống!')).toBeVisible();
  });

  test('Cart renders items and totals', async ({ page }) => {
    await seedLocalStorage(page, { [CART_KEY]: seededCart });
    await page.goto('/cart');

    await expect(page.getByText('Deluxe Double')).toBeVisible();
    await expect(page.getByText('Airport Pickup')).toBeVisible();

    await expect(page.getByText(/Tổng cộng/i)).toBeVisible();
  });

  test('Cart update quantity (+) increases total items', async ({ page }) => {
    await seedLocalStorage(page, { [CART_KEY]: seededCart });
    await page.goto('/cart');

    // Click the first plus button
    await page.locator('button').filter({ has: page.locator('svg.lucide-plus') }).first().click();

    // Quantity should become 2 for first item (room)
    // The quantity is shown in the same row; easiest is to assert cart badge changes to 3 (2+1)
    const badge = page.locator('a[href="/cart"] span');
    await expect(badge).toHaveText('3');
  });

  test('Cart remove item removes row', async ({ page }) => {
    await seedLocalStorage(page, { [CART_KEY]: seededCart });
    await page.goto('/cart');

    // Click first trash button
    await page.locator('button').filter({ has: page.locator('svg.lucide-trash-2') }).first().click();
    await expect(page.getByText('Deluxe Double')).not.toBeVisible();
  });

  test('Checkout form validation - invalid email shows error', async ({ page }) => {
    await seedLocalStorage(page, { [CART_KEY]: seededCart });
    await page.goto('/cart');

    await page.getByPlaceholder('john@example.com').fill('not-an-email');
    await page.getByRole('button', { name: /Hoàn tất đặt chỗ/i }).click();

    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  });

  test('Checkout direct payment - success shows confirmation', async ({ page }) => {
    await seedLocalStorage(page, { [CART_KEY]: seededCart });
    await page.goto('/cart');

    await page.getByPlaceholder('John Doe').fill('Student Tester');
    await page.getByPlaceholder('john@example.com').fill('student@example.com');
    await page.getByPlaceholder('+1 (123) 456-7890').fill('0901234567');

    // Submit triggers payment method modal; choose direct
    await page.getByRole('button', { name: /Hoàn tất đặt chỗ/i }).click();
    await expect(page.getByText('Chọn phương thức thanh toán')).toBeVisible();
    await page.getByRole('button', { name: /Thanh toán trực tiếp tại khách sạn/i }).click();

    await expect(page.getByText(/Đặt chỗ thành công/i)).toBeVisible();
  });
});
