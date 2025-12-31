export const mockRoomTypes = [
  {
    MaLoaiPhong: 1,
    TenLoaiPhong: 'Deluxe Double',
    GiaNgay: 1200000,
    ImageURL: 'https://example.com/room1.jpg',
    MoTa: 'Spacious room with city view',
    SoNguoiToiDa: 2,
  },
  {
    MaLoaiPhong: 2,
    TenLoaiPhong: 'Family Suite',
    GiaNgay: 2000000,
    ImageURL: 'https://example.com/room2.jpg',
    MoTa: 'Perfect for families',
    SoNguoiToiDa: 4,
  },
];

export const mockAmenityDetails = [
  { MaLoaiPhong: 1, TenTN: 'Wifi' },
  { MaLoaiPhong: 1, TenTN: 'TV' },
  { MaLoaiPhong: 2, TenTN: 'Wifi' },
  { MaLoaiPhong: 2, TenTN: 'Bathtub' },
];

export const mockServices = [
  {
    MaDV: 10,
    TenDV: 'Airport Pickup',
    Gia: 350000,
    ImageURL: 'https://example.com/svc1.jpg',
    MoTa: 'Comfortable airport transfer',
  },
  {
    MaDV: 11,
    TenDV: 'Spa Package',
    Gia: 800000,
    ImageURL: 'https://example.com/svc2.jpg',
    MoTa: 'Relaxing spa treatment',
  },
];

export const mockLoggedInUser = {
  id: 1,
  name: 'Test User',
  email: 'test.user@example.com',
  phone: '0900000000',
  tokens: {
    accesssToken: 'mock-access',
    refreshToken: 'mock-refresh',
  },
};

export const mockCustomerAccount = {
  MaKH: 100,
  TenKH: 'Test User',
  Email: 'test.user@example.com',
  SDT: '0900000000',
  AvatarURL: '',
};

export const mockHistoryEmpty = { bookings: [], services: [] };

export const mockHistoryWithRoomAndService = {
  bookings: [
    {
      MaCTPT: 500,
      NgayBD: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      ThoiDiemCheckIn: null,
      ThoiDiemCheckOut: null,
      TienPhong: 2400000,
      SoPhong: '101',
      DaThanhToan: false,
      HinhThucThanhToan: 'Direct',
      TinhTrangThue: 'Đã đặt',
    },
  ],
  services: [
    {
      MaCTSDDV: 800,
      MaDV: 10,
      NgayApDung: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      SL: 1,
      ThanhTien: 350000,
      DaThanhToan: false,
      HinhThucThanhToan: 'Direct',
      TrangThai: 'Đã đặt',
    },
  ],
};
