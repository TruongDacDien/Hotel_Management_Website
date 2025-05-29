import { useState, useEffect } from "react";
import { mockRooms } from "../../mock/room";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../hooks/use-toast";
import { useCart } from "../../hooks/use-cart";
import { amenityIcons } from "../../constants/amenityIcons";
import { Users, Calendar, CheckCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Separator } from "../../components/ui/separator";

import { getRoomTypeById, getAmentitesRoomDetails } from "../../config/api";
import ReviewList from "../../components/reviews/ReviewList";
import ReviewForm from "../../components/reviews/ReviewForm";

export default function RoomDetailPage() {
  const [amentites, setAmentites] = useState([]);
  const { id } = useParams();
  const { toast } = useToast();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [reloadReviewKey, setReloadReviewKey] = useState(0);

  //   useEffect(() => {
  //     window.scrollTo(0, 0);
  //   }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);

    const fetchRoomTypeById = async () => {
      try {
        const response = await getRoomTypeById(id);
        if (response) {
          setRoom(response);
        } else {
          throw new Error("Không tìm thấy phòng");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching room type by id", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchRoomTypeById();
  }, [id]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getAmentitesRoomDetails();
        if (response) {
          setAmentites(response);
        }
      } catch {
        throw new Error("There is an error while getting amentities");
      }
    };
    fetchRooms();
  }, []);

  if (isLoading) {
    return <RoomDetailSkeleton />;
  }

  if (error || !room) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Lỗi tìm phòng</h1>
        <p className="mb-6">
          Chúng tôi không thể tìm thấy phòng mà bạn yêu cầu.
        </p>
        <Button asChild>
          <Link to="/rooms">Xem tất cả phòng</Link>
        </Button>
      </div>
    );
  }

  // Get the appropriate icon for an amenity
  const roomAmenities = amentites
    .filter((item) => item.MaLoaiPhong === room.MaLoaiPhong)
    .map((item) => item.TenTN);

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-primary mb-3">
              {room.TenLoaiPhong}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-amber-300 hover:bg-amber-300 text-neutral-800 text-sm">
                {room.GiaNgay}VNĐ / ngày
              </Badge>
              <Badge className="bg-amber-300 hover:bg-amber-300 text-neutral-800 text-sm">
                {room.GiaGio}VNĐ / giờ
              </Badge>
              <div className="flex items-center text-neutral-600 text-sm">
                <Users className="h-4 w-4 mr-1" />
                <span>Tối đa {room.SoNguoiToiDa} khách</span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <div className="relative rounded-lg overflow-hidden cursor-pointer mb-8">
                  <img
                    src={room.ImageURL}
                    alt={room.TenLoaiPhong}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-semibold">
                      Nhấp để xem ảnh phóng to
                    </span>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="p-0 max-w-5xl overflow-hidden">
                <img
                  src={room.ImageURL}
                  alt={room.TenLoaiPhong}
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Mô tả</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                {room.MoTa}
              </p>
              {/* <p className="text-neutral-700 leading-relaxed">
                Our {room.name.toLowerCase()} offers a perfect blend of luxury
                and comfort, designed to provide you with an unforgettable stay
                experience. From the premium linens to the carefully selected
                furnishings, every detail has been thoughtfully considered to
                enhance your comfort and relaxation.
              </p> */}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Tiện nghi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {amenityIcons[amenity] || null}
                    </div>
                    <span className="text-neutral-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Chính sách
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-neutral-800 mb-2">
                    Nhận phòng & Trả phòng
                  </h3>
                  <ul className="text-neutral-700 space-y-2">
                    <li>Nhận phòng : 3:00 PM - 12:00 AM</li>
                    <li>Trả phòng: 11:00 AM</li>
                    <li>Có thể nhận phòng sớm theo yêu cầu</li>
                    <li>Có thể trả phòng trễ theo yêu cầu</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-800 mb-2">
                    Chính sách hủy
                  </h3>
                  <ul className="text-neutral-700 space-y-2">
                    <li>
                      Miễn phí hủy phòng trước 48 giờ so với giờ nhận phòng
                    </li>
                    <li>Hoàn 50% cho các đơn hủy trong vòng 48 giờ</li>
                    <li>Không hoàn tiền đối với trường hợp không đến</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Đánh giá của khách hàng
              </h2>
              <div className="grid-cols-1 w-full ">
                <ReviewList roomId={parseInt(id)} key={reloadReviewKey} />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">
                Viết đánh giá
              </h2>
              <ReviewForm
                roomId={parseInt(id)}
                onSuccess={() => {
                  toast({
                    title: "Cảm ơn đánh giá của bạn!",
                    description:
                      "Đánh giá của bạn sẽ giúp cho các khách hàng khác biết thêm thông tin.",
                  });
                  setReloadReviewKey((prev) => prev + 1);
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingForm
              roomId={parseInt(id)}
              roomName={room?.TenLoaiPhong}
              price={room?.GiaNgay}
              setBookingSuccess={setBookingSuccess}
              imageUrl={room.ImageURL}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingForm({ roomId, roomName, price, setBookingSuccess, imageUrl }) {
  const { toast } = useToast();
  const { addRoom } = useCart();
  const navigate = useNavigate();

  const form = useForm({
    // resolver: zodResolver(
    //   z.object({
    //     name: z
    //       .string()
    //       .min(2, { message: "Name must be at least 2 characters" }),
    //     email: z
    //       .string()
    //       .email({ message: "Please enter a valid email address" }),
    //     phone: z.string().optional(),
    //     checkIn: z
    //       .string()
    //       .min(1, { message: "Please select a check-in date" }),
    //     checkOut: z
    //       .string()
    //       .min(1, { message: "Please select a check-out date" }),
    //   })
    // ),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      checkIn: new Date().toISOString().split("T")[0],
      checkOut: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data) => {
      // Instead of directly booking, we'll add this to the cart
      console.log(data);

      return data;
    },
    onSuccess: (data) => {
      // Add the room to cart with chosen dates
      addRoom(
        {
          id: roomId,
          name: roomName,
          price: price,
          imageUrl: imageUrl,
        },
        data.checkIn,
        data.checkOut,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
        }
      );

      // Show success message
      setBookingSuccess(true);
      toast({
        title: "Added to Cart!",
        description:
          "Room has been added to your cart. You can review your booking there.",
      });

      // Option to navigate to cart
      // setTimeout(() => {
      //   navigate("/cart");
      // }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Failed to Add to Cart",
        description:
          error.message || "Failed to add room to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data) {
    if (!data.name || !data.email || !data.checkIn || !data.checkOut) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin!",
        variant: "destructive",
      });
      return;
    }
    bookingMutation.mutate(data);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-primary mb-2">Đặt phòng này</h2>
        <p className="text-neutral-700 mb-6">
          Hãy đặt phòng tại {(roomName || "").toLowerCase()} của chúng tôi và
          tận hưởng trải nghiệm sang trọng.
        </p>

        {bookingMutation.isSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="font-bold">Đã thêm vào giỏ hàng!</h3>
            </div>
            <p className="mb-4">
              Phòng này đã được thêm vào giỏ hàng của bạn. Bạn có thể tiếp tục
              mua sắm hoặc tiến hành thanh toán.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="w-full"
                onClick={() => navigate("/rooms")}
                variant="outline"
              >
                Đặt phòng khác
              </Button>
              <Button className="w-full" onClick={() => navigate("/cart")}>
                Xem giỏ hàng
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-neutral-700">Giá qua đêm</span>
                <span className="font-semibold">{price} VNĐ</span>
              </div>
              <Separator className="my-2" />
              {/* <div className="flex justify-between">
                <span className="font-semibold text-neutral-800">Tổng</span>
                <span className="font-bold text-primary">{price} VNĐ</span>
              </div> */}
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="checkIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày nhận phòng</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
                            <Input type="date" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkOut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày trả phòng</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
                            <Input type="date" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={bookingMutation.isPending}
                  variant="custom"
                >
                  {bookingMutation.isPending ? "Đang xử lí..." : "Đặt ngay"}
                </Button>
              </form>
            </Form>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function RoomDetailSkeleton() {
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-10 w-3/4 bg-neutral-200 animate-pulse mb-3" />
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="h-6 w-24 bg-neutral-200 animate-pulse rounded" />
              <div className="h-6 w-32 bg-neutral-200 animate-pulse rounded" />
              <div className="h-6 w-20 bg-neutral-200 animate-pulse rounded" />
            </div>

            <div className="h-80 bg-neutral-200 animate-pulse rounded-lg mb-8" />

            <div className="mb-8">
              <div className="h-8 w-1/3 bg-neutral-200 animate-pulse mb-4" />
              <div className="h-4 w-full bg-neutral-200 animate-pulse mb-2" />
              <div className="h-4 w-full bg-neutral-200 animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-neutral-200 animate-pulse" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border border-neutral-200 p-6">
              <div className="h-6 w-1/2 bg-neutral-200 animate-pulse mb-6" />
              <div className="space-y-4">
                <div className="h-10 bg-neutral-200 animate-pulse rounded" />
                <div className="h-10 bg-neutral-200 animate-pulse rounded" />
                <div className="h-10 bg-neutral-200 animate-pulse rounded" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-neutral-200 animate-pulse rounded" />
                  <div className="h-10 bg-neutral-200 animate-pulse rounded" />
                </div>
                <div className="h-10 bg-neutral-200 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
