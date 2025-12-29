import { useState, useEffect, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/use-auth";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { format } from "date-fns";
import { Loader2, User } from "lucide-react";
import {
  getCustomerAccountById,
  updateCustomerAccountById,
  getHistoryBookingByCustomerId,
  getServiceById,
  cancelBooking,
  cancelService,
} from "../../config/api";
import defaultAvatar from "../../assets/avatar-default.svg";
import EditProfileModal from "./EditProfile";
import ChangePasswordModal from "./ChangePasswordModal";
import { changeCustomerPassword } from "../../config/api";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Vui lòng đăng nhập</h1>
          <p className="mb-6">Bạn cần đăng nhập để xem trang cá nhân.</p>
          <Link to="/auth">
            <Button className="bg-black text-white">Đăng nhập ở đây!</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { toast } = useToast();
  const [userInfor, setUserInfor] = useState(null);

  const fetchUser = async () => {
    if (!user || !user.id) return;
    try {
      const res = await getCustomerAccountById(user.id);

      console.log(res);

      setUserInfor(res);
    } catch (err) {
      console.error("Failed to fetch user");
    }
  };
  useEffect(() => {
    fetchUser();
  }, [user]);

  const [activeTab, setActiveTab] = useState("profile");
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleRequestCancel = (booking, loai) => {
    setSelectedBooking({ ...booking, loai }); // loai = 'room' | 'service'
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      if (selectedBooking.loai === "room") {
        await cancelBooking({
          bookingDetailId: selectedBooking.MaCTPT,
          fullname: userInfor.TenKH,
          email: userInfor.Email,
          phone: userInfor.SDT,
        });
      } else {
        await cancelService({
          serviceUsageDetailId: selectedBooking.MaCTSDDV,
          fullname: userInfor.TenKH,
          email: userInfor.Email,
          phone: userInfor.SDT,
        });
      }

      toast({ title: "Huỷ thành công." });

      const res = await getHistoryBookingByCustomerId(userInfor.MaKH);

      // Sắp xếp Bookings theo MaCTPT từ lớn đến nhỏ
      const sortedBookings = res.bookings.sort(
        (a, b) => b.MaCTPT - a.MaCTPT
      );

      // Sắp xếp Services theo MaCTSDDV từ lớn đến nhỏ
      const sortedServices = res.services.sort(
        (a, b) => b.MaCTSDDV - a.MaCTSDDV
      );

      setBookings(sortedBookings);
      setServices(sortedServices);
      setShowCancelModal(false);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Huỷ thất bại";
      toast({ title: errorMessage, variant: "destructive" });
    }
  };

  //   const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
  //     queryKey: ["/api/user/bookings"],
  //     enabled: !!user,
  //   });

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userInfor?.MaKH) return;
      try {
        setIsLoadingBookings(true);
        const res = await getHistoryBookingByCustomerId(userInfor.MaKH);
        console.log(res);

        // Sắp xếp Bookings theo MaCTPT từ lớn đến nhỏ
        const sortedBookings = res.bookings.sort(
          (a, b) => b.MaCTPT - a.MaCTPT
        );

        // Sắp xếp Services theo MaCTSDDV từ lớn đến nhỏ
        const sortedServices = res.services.sort(
          (a, b) => b.MaCTSDDV - a.MaCTSDDV
        );

        setBookings(sortedBookings);
        setServices(sortedServices);
      } catch (err) {
        console.error("Failed to fetch booking history:", err);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [userInfor]);

  const handleSave = async (formData) => {
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }

    try {
      await updateCustomerAccountById(user.id, data);

      toast({
        title: "Cập nhật thành công!",
      });
      setShowModal(false);
      fetchUser();
      // Gọi API get lại thông tin nếu cần
    } catch (error) {
      console.error("Update failed:", error);

      toast({
        title: "Cập nhật thất bại. Vui lòng thử lại!",
      });
    }
    // Cập nhật lại giao diện nếu cần
  };

  //phân trang
  const [roomPage, setRoomPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const displayedRooms = bookings.slice(
    (roomPage - 1) * ITEMS_PER_PAGE,
    roomPage * ITEMS_PER_PAGE
  );

  const displayedServices = services.slice(
    (servicePage - 1) * ITEMS_PER_PAGE,
    servicePage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    console.log("Bookings:", bookings);
    console.log("Services:", services);
    console.log(userInfor);
  }, [bookings, services]);

  // thêm state để lưu mapping
  const [serviceNames, setServiceNames] = useState({});

  // Lấy tên dịch vụ từ API
  useEffect(() => {
    const fetchNames = async () => {
      const newNames = {};
      for (const s of services) {
        if (s.MaDV) {
          try {
            const data = await getServiceById(s.MaDV);
            newNames[s.MaDV] = data.TenDV || "Không xác định";
          } catch (e) {
            newNames[s.MaDV] = "Không tìm thấy";
          }
        }
      }
      setServiceNames(newNames);
    };
    fetchNames();
  }, [services]);

  const [showChangePassModal, setShowChangePassModal] = useState(false);

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    try {
      await changeCustomerPassword(user.id, currentPassword, newPassword);
      toast({ title: "Đổi mật khẩu thành công!" });
      setShowChangePassModal(false);
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        err?.response?.message ||
        "Đổi mật khẩu thất bại";
      toast({ title: msg, variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center mb-8">
        {/* <div className="bg-primary/10 p-3 rounded-full mr-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Thông tin của tôi</h1> */}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Thông tin tài khoản</TabsTrigger>
          <TabsTrigger value="bookings">Lịch sử đặt hàng</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Họ và tên
                    </h3>
                    <p className="text-lg">
                      {userInfor?.TenKH ? userInfor.TenKH : "Không có"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Email
                    </h3>
                    <p className="text-lg">{userInfor?.Email || "Không có"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Số điện thọai
                    </h3>
                    <p className="text-lg">{userInfor?.SDT || "Không có"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Loại tài khoản
                    </h3>
                    <p className="text-lg">
                      {userInfor?.isAdmin ? "Quản trị viên" : "Khách hàng"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Số CCCD
                    </h3>
                    <p className="text-lg">
                      {userInfor?.CCCD ? userInfor.CCCD : "Không có"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Giới tính
                    </h3>
                    <p className="text-lg">
                      {userInfor?.GioiTinh || "Chưa xác định"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Địa chỉ
                    </h3>
                    <p className="text-lg">{userInfor?.DiaChi || "Không có"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Quốc tịch
                    </h3>
                    <p className="text-lg">
                      {userInfor?.QuocTich || "Không có"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <img
                    src={userInfor?.AvatarURL || defaultAvatar}
                    alt="Avatar"
                    className="w-40 h-40 rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-2">
                <Button onClick={() => setShowModal(true)} variant="outline">
                  Chỉnh sửa
                </Button>

                <Button onClick={() => setShowChangePassModal(true)} variant="outline">
                  Đổi mật khẩu
                </Button>

                <EditProfileModal
                  open={showModal}
                  userData={userInfor}
                  onClose={() => setShowModal(false)}
                  onSave={handleSave}
                />

                <ChangePasswordModal
                  open={showChangePassModal}
                  onClose={() => setShowChangePassModal(false)}
                  onSubmit={handleChangePassword}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="rooms" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="rooms">Phòng</TabsTrigger>
                  <TabsTrigger value="services">Dịch vụ</TabsTrigger>
                </TabsList>
                <TabsContent value="rooms">
                  {isLoadingBookings ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : bookings && bookings.length > 0 ? (
                    <>
                      <div className="space-y-6">
                        {displayedRooms.map((booking, index) => (
                          <BookingItem
                            key={index}
                            booking={booking}
                            onCancelRequest={handleRequestCancel}
                          />
                        ))}
                      </div>
                      <div className="flex justify-center mt-4 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRoomPage((p) => Math.max(p - 1, 1))}
                          disabled={roomPage === 1}
                        >
                          Trước
                        </Button>

                        <span className="text-sm text-muted-foreground">
                          Trang {roomPage} /{" "}
                          {Math.ceil(bookings.length / ITEMS_PER_PAGE)}
                        </span>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setRoomPage((p) =>
                              p < Math.ceil(bookings.length / ITEMS_PER_PAGE)
                                ? p + 1
                                : p
                            )
                          }
                          disabled={
                            roomPage ===
                            Math.ceil(bookings.length / ITEMS_PER_PAGE)
                          }
                        >
                          Tiếp
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Bạn chưa có đơn đặt chỗ nào.
                      </p>
                      <Link href="/rooms">
                        <Button variant="custom" className="mt-4">
                          Đặt phòng ngay
                        </Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="services">
                  {services && services.length > 0 ? (
                    <>
                      <div className="space-y-6">
                        {displayedServices.map((service, index) => (
                          <ServiceItem
                            key={index}
                            service={service}
                            serviceName={serviceNames[service.MaDV]}
                            onCancelRequest={handleRequestCancel}
                          />
                        ))}
                      </div>
                      <div className="flex justify-center mt-4 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setServicePage((p) => Math.max(p - 1, 1))
                          }
                          disabled={servicePage === 1}
                        >
                          Trước
                        </Button>

                        <span className="text-sm text-muted-foreground pt-2">
                          Trang {servicePage} /{" "}
                          {Math.ceil(services.length / ITEMS_PER_PAGE)}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setServicePage((p) =>
                              p < Math.ceil(services.length / ITEMS_PER_PAGE)
                                ? p + 1
                                : p
                            )
                          }
                          disabled={
                            servicePage ===
                            Math.ceil(services.length / ITEMS_PER_PAGE)
                          }
                        >
                          Tiếp
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Bạn chưa sử dụng dịch vụ nào.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {showCancelModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Xác nhận huỷ</h3>

              <p className="text-muted-foreground mb-6">
                {selectedBooking?.loai === "room"
                  ? `Bạn chắc chắn muốn huỷ đặt phòng số ${selectedBooking?.SoPhong}?`
                  : `Bạn chắc chắn muốn huỷ dịch vụ "${serviceNames[selectedBooking?.MaDV]
                  }" vào ngày ${format(
                    new Date(selectedBooking?.NgayApDung),
                    "dd/MM/yyyy"
                  )}?`}
              </p>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                >
                  Đóng
                </Button>
                <Button variant="destructive" onClick={handleConfirmCancel}>
                  Xác nhận huỷ
                </Button>
              </div>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
}

const formatDateValue = (value) => {
  if (value == null || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return format(date, "dd/MM/yyyy");
};

function BookingItem({ booking, onCancelRequest }) {
  const isRoomBooking = booking.roomId && !booking.serviceId;
  const formattedCheckIn = formatDateValue(booking.ThoiDiemCheckIn);
  const formattedCheckOut = formatDateValue(booking.ThoiDiemCheckOut);
  const formattedTotal = booking.TienPhong
    ? Number(booking.TienPhong).toLocaleString("vi-VN") + " VNĐ"
    : "N/A";

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="mt-2 md:mt-0">
            {booking.TinhTrangThue?.toLowerCase().includes("hủy") && (
              <Badge variant="outline">{booking.TinhTrangThue}</Badge>
            )}
            <Badge
              variant={booking.status === "confirmed" ? "default" : "outline"}
            >
              {booking.DaThanhToan ? "Đã thanh toán" : "Chưa thanh toán"}
            </Badge>
            <Badge
              variant={booking.status === "confirmed" ? "default" : "outline"}
            >
              {booking.HinhThucThanhToan === "Online"
                ? "Online"
                : booking.HinhThucThanhToan === "Direct"
                  ? "Trực tiếp"
                  : booking.HinhThucThanhToan}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Dự kiến nhận phòng
              </h4>
              <p>
                {booking.NgayBD
                  ? format(new Date(booking.NgayBD), "dd/MM/yyyy")
                  : "N/A"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Dự kiến trả phòng
              </h4>
              <p>
                {booking.NgayKT
                  ? format(new Date(booking.NgayKT), "dd/MM/yyyy")
                  : "N/A"}
              </p>
            </div>
          </>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Tiền phòng
            </h4>
            <p>{formattedTotal}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Nhận phòng thực tế
              </h4>
              <p>{formattedCheckIn ?? "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Trả phòng thực tế
              </h4>
              <p>{formattedCheckOut ?? "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Số phòng
              </h4>
              <p className="text-sm">{booking.SoPhong ?? "N/A"}</p>
            </div>
          </div>
        </div>

        {new Date() < new Date(booking.NgayBD) &&
          !booking.TinhTrangThue?.toLowerCase().includes("hủy") && (
            <div className="mt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancelRequest(booking, "room")}
              >
                Huỷ đặt phòng
              </Button>
            </div>
          )}
      </div>
    </Card>
  );
}

function ServiceItem({ service, serviceName, onCancelRequest }) {
  return (
    <Card className="p-4 space-y-2 text-sm">
      {/* Header badges */}
      <div className="flex flex-wrap gap-2 mb-2">
        {service.TrangThai?.toLowerCase().includes("hủy") && (
          <Badge variant="destructive">{service.TrangThai}</Badge>
        )}
        <Badge variant={service.status === "confirmed" ? "default" : "outline"}>
          {service.DaThanhToan ? "Đã thanh toán" : "Chưa thanh toán"}
        </Badge>
        <Badge variant={service.status === "confirmed" ? "default" : "outline"}>
          {service.HinhThucThanhToan === "Online"
            ? "Online"
            : service.HinhThucThanhToan === "Direct"
              ? "Trực tiếp"
              : "Không rõ"}
        </Badge>
      </div>

      {/* Service Info */}
      <div className="space-y-1 leading-snug">
        <p>
          <span className="font-medium">Dịch vụ:</span>{" "}
          <strong>{serviceName || "Đang tải..."}</strong>
        </p>
        <p>
          <span className="font-medium">Ngày sử dụng:</span>{" "}
          <strong>
            {service.NgayApDung
              ? format(new Date(service.NgayApDung), "dd/MM/yyyy")
              : "N/A"}
          </strong>
        </p>
        <p>
          <span className="font-medium">Số lượng:</span> {service.SL || "N/A"}
        </p>
        <p>
          <span className="font-medium">Thành tiền:</span>{" "}
          {service.ThanhTien
            ? Number(service.ThanhTien).toLocaleString("vi-VN") + " VNĐ"
            : "N/A"}
        </p>
      </div>

      {/* Cancel Button */}
      {new Date() < new Date(service.NgayApDung) &&
        !service.TrangThai?.toLowerCase().includes("hủy") && (
          <div className="pt-3">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancelRequest(service, "service")}
            >
              Huỷ dịch vụ
            </Button>
          </div>
        )}
    </Card>
  );
}
