import type { Page, Route } from '@playwright/test';
import {
  mockAmenityDetails,
  mockCustomerAccount,
  mockHistoryEmpty,
  mockHistoryWithRoomAndService,
  mockLoggedInUser,
  mockRoomTypes,
  mockServices,
} from './data';

export type MockState = {
  roomTypes: any[];
  roomTypeById: Record<string, any>;
  services: any[];
  serviceById: Record<string, any>;
  amenityDetails: any[];
  authSignUp: { success: boolean; data?: any; message?: string; status?: number };
  authSignIn: { success: boolean; data?: any; message?: string; status?: number };
  authSignOut: { success: boolean; data?: any };
  customerAccountById: Record<string, any>;
  historySequence: any[]; // each call pops 0,1,2...
  cancelBooking: { ok: boolean; message?: string; status?: number };
  cancelService: { ok: boolean; message?: string; status?: number };
  changePassword: { ok: boolean; message?: string; status?: number };
};

export function defaultMockState(): MockState {
  return {
    roomTypes: mockRoomTypes,
    roomTypeById: {
      '1': mockRoomTypes[0],
      '2': mockRoomTypes[1],
    },
    services: mockServices,
    serviceById: {
      '10': mockServices[0],
      '11': mockServices[1],
    },
    amenityDetails: mockAmenityDetails,
    authSignUp: { success: true, data: mockLoggedInUser },
    authSignIn: { success: true, data: mockLoggedInUser },
    authSignOut: { success: true, data: {} },
    customerAccountById: {
      '1': mockCustomerAccount,
    },
    historySequence: [mockHistoryEmpty],
    cancelBooking: { ok: true },
    cancelService: { ok: true },
    changePassword: { ok: true },
  };
}

function json(route: Route, body: any, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

export async function installApiMocks(page: Page, state: MockState) {
  // Rooms
  await page.route('**/api/roomTypes', (route) => json(route, state.roomTypes));
  await page.route('**/api/roomTypes/*', (route) => {
    const id = route.request().url().split('/').pop() ?? '';
    const data = state.roomTypeById[id];
    if (!data) return json(route, { message: 'Not found' }, 404);
    return json(route, data);
  });

  await page.route('**/api/amenityDetails', (route) => json(route, state.amenityDetails));

  // Services
  await page.route('**/api/services', (route) => json(route, state.services));
  await page.route('**/api/services/*', (route) => {
    const id = route.request().url().split('/').pop() ?? '';
    const data = state.serviceById[id];
    if (!data) return json(route, { message: 'Not found' }, 404);
    return json(route, data);
  });

  // Auth
  await page.route('**/api/auth/customer/sign-up', async (route) => {
    const s = state.authSignUp;
    return json(route, { success: s.success, data: s.data, message: s.message }, s.status ?? (s.success ? 200 : 400));
  });
  await page.route('**/api/auth/customer/sign-in', async (route) => {
    const s = state.authSignIn;
    return json(route, { success: s.success, data: s.data, message: s.message }, s.status ?? (s.success ? 200 : 401));
  });
  await page.route('**/api/auth/customer/sign-out**', async (route) => {
    const s = state.authSignOut;
    return json(route, { success: s.success, data: s.data }, 200);
  });

  // Customer account
  await page.route('**/api/customerAccounts/*', (route) => {
    const id = route.request().url().split('/').pop() ?? '';
    const data = state.customerAccountById[id];
    if (!data) return json(route, { message: 'Not found' }, 404);
    return json(route, data);
  });
  await page.route('**/api/customerAccounts/*/password', (route) => {
    const r = state.changePassword;
    if (!r.ok) return json(route, { message: r.message ?? 'Failed' }, r.status ?? 400);
    return json(route, { success: true });
  });

  // Booking history
  let historyCall = 0;
  await page.route('**/api/bookings/history**', (route) => {
    const data = state.historySequence[Math.min(historyCall, state.historySequence.length - 1)];
    historyCall += 1;
    return json(route, data);
  });

  // Cancel endpoints
  await page.route('**/api/bookingDetails/cancel', (route) => {
    const r = state.cancelBooking;
    if (!r.ok) return json(route, { message: r.message ?? 'Huỷ thất bại' }, r.status ?? 400);
    return json(route, { success: true });
  });
  await page.route('**/api/serviceUsageDetails/cancel', (route) => {
    const r = state.cancelService;
    if (!r.ok) return json(route, { message: r.message ?? 'Huỷ thất bại' }, r.status ?? 400);
    return json(route, { success: true });
  });

  // Other rating endpoints used by review components (avoid real network)
  await page.route('**/api/ratingRoomTypes**', (route) => json(route, []));
  await page.route('**/api/ratingServices**', (route) => json(route, []));
}

export function historyAfterCancelRoom() {
  const cancelled = JSON.parse(JSON.stringify(mockHistoryWithRoomAndService));
  cancelled.bookings[0].TinhTrangThue = 'Đã hủy';
  return cancelled;
}

export function historyAfterCancelService() {
  const cancelled = JSON.parse(JSON.stringify(mockHistoryWithRoomAndService));
  cancelled.services[0].TrangThai = 'Đã hủy';
  return cancelled;
}
