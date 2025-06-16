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
} from "../../config/api";
import defaultAvatar from "../../assets/avatar-default.svg";
import EditProfileModal from "./EditProfile";

const mockBookings = [
  // Booking confirmed - room
  {
    id: 1,
    name: "Nguyen Van A",
    email: "a@example.com",
    phone: "0123456789",
    status: "confirmed",
    checkIn: "2025-05-01",
    checkOut: "2025-05-05",
    totalPrice: 250,
    notes: "Need extra pillows",
    roomId: 101,
  },
  // Booking pending - service
  {
    id: 2,
    name: "Nguyen Van A",
    email: "a@example.com",
    phone: "0123456789",
    status: "pending",
    serviceDate: "2025-05-10",
    serviceTime: "14:00",
    totalPrice: 50,
    notes: "",
    serviceId: 201,
  },
  // Booking cancelled - room
  {
    id: 3,
    name: "Nguyen Van A",
    email: "a@example.com",
    phone: "0123456789",
    status: "cancelled",
    checkIn: "2025-04-01",
    checkOut: "2025-04-03",
    totalPrice: 180,
    notes: "Late check-in",
    roomId: 102,
  },
  // Booking confirmed - service
  {
    id: 4,
    name: "Nguyen Van A",
    email: "a@example.com",
    phone: "0123456789",
    status: "confirmed",
    serviceDate: "2025-05-15",
    serviceTime: "09:00",
    totalPrice: 100,
    notes: "Massage and spa",
    serviceId: 202,
  },
];

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

        setBookings(res.bookings);
        setServices(res.services);
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
              <div className="pt-4">
                <Button onClick={() => setShowModal(true)} variant="outline">
                  Chỉnh sửa
                </Button>
                <EditProfileModal
                  open={showModal}
                  userData={userInfor}
                  onClose={() => setShowModal(false)}
                  onSave={handleSave}
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
                        {displayedRooms.map((booking) => (
                          <BookingItem key={booking.id} booking={booking} />
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
      </Tabs>
    </div>
  );
}

function BookingItem({ booking }) {
  const isRoomBooking = booking.roomId && !booking.serviceId;
  const formattedTotal = booking.TienPhong
    ? Number(booking.TienPhong).toLocaleString("vi-VN") + " VNĐ"
    : "N/A";

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="mt-2 md:mt-0">
            <Badge
              variant={booking.status === "confirmed" ? "default" : "outline"}
            >
              {booking.TinhTrangThue}
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
              <p>
                {booking.ThoiDiemCheckIn
                  ? format(new Date(booking.ThoiDiemCheckIn), "dd/MM/yyyy")
                  : "N/A"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Trả phòng thực tế
              </h4>
              <p>
                {booking.ThoiDiemCheckOut
                  ? format(new Date(booking.ThoiDiemCheckOut), "dd/MM/yyyy")
                  : "N/A"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Số phòng
              </h4>
              <p className="text-sm">{booking.SoPhong || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ServiceItem({ service, serviceName }) {
  return (
    <Card className="p-4">
      <p className="text-sm">
        Dịch vụ: <strong>{serviceName || "Đang tải..."}</strong>
      </p>
      <p className="text-sm">
        Ngày sử dụng:{" "}
        <strong>
          {service.NgayApDung
            ? format(new Date(service.NgayApDung), "dd/MM/yyyy")
            : "N/A"}
        </strong>
      </p>
      <p className="text-sm">Số lượng: {service.SL || "N/A"}</p>
      <p className="text-sm">
        Thành tiền:{" "}
        {service.ThanhTien
          ? Number(service.ThanhTien).toLocaleString("vi-VN") + " VNĐ"
          : "N/A"}
      </p>
    </Card>
  );
}
