import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../hooks/use-toast";
import { useCart } from "../../hooks/use-cart";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { getServiceById, getAllRooms, getAllRoomTypes } from "../../config/api";
import { useAuth } from "../../hooks/use-auth";
import ReviewList from "../../components/reviews/ReviewList";
import ReviewForm from "../../components/reviews/ReviewForm";

export default function ServiceBookingPage() {
  const [rooms, setRooms] = useState([]);
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roomsLoading, setRoomLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const [reloadReviewKey, setReloadReviewKey] = useState(0);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getAllRoomTypes();
        if (response) {
          setRooms(response);
        }
      } catch {
        throw new Error("There is an error while getting room");
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);

    const fetcServiceById = async () => {
      try {
        const response = await getServiceById(id);
        if (response) {
          setService(response);
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

    fetcServiceById();
  }, [id]);

  if (isLoading) {
    return <ServiceBookingSkeleton />;
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Lỗi dịch vụ</h1>
        <p className="mb-6">Không tìm thấy dịch vụ mà bạn cần.</p>
        <Button asChild>
          <Link to="/services">
            <a>Xem tất cả dịch vụ</a>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-primary mb-3">
              {service.TenDV}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {service.price > 0 && (
                <Badge className="bg-amber-300 hover:bg-amber-300 text-neutral-800 text-sm">
                  {service.Gia} VNĐ
                </Badge>
              )}
            </div>

            <div className="rounded-lg overflow-hidden mb-8">
              <img
                src={service.ImageURL}
                alt={service.TenDV}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Mô tả dịch vụ
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                {service.MoTa}
              </p>
              {/* <p className="text-neutral-700 leading-relaxed">
                Our expert staff at Elysian Retreat is dedicated to providing
                you with an exceptional experience. Book this service to enhance
                your stay and create unforgettable memories during your time
                with us.
              </p> */}
            </div>
            {/* 
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Why Choose This Service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    Personalized Experience
                  </h3>
                  <p className="text-neutral-700">
                    Our services are tailored to your specific preferences and
                    needs to ensure complete satisfaction.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    Exceptional Quality
                  </h3>
                  <p className="text-neutral-700">
                    We use only the finest materials and employ highly trained
                    professionals for all our services.
                  </p>
                </div>
              </div>
            </div> */}

            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">
                Thông tin thêm
              </h2>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <ul className="text-neutral-700 space-y-2">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 mt-0.5 text-amber-400" />
                    <span>Vui lòng đặt dịch vụ này trước ít nhất 24 giờ.</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 mt-0.5 text-amber-400" />
                    <span>
                      Việc hủy chuyến được thực hiện trước ít hơn 12 giờ sẽ phải
                      chịu phí hủy chuyến.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 mt-0.5 text-amber-400" />
                    <span>
                      Những yêu cầu đặc biệt có thể được đáp ứng nếu thông báo
                      trước.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4 mt-4">
                Đánh giá của khách hàng
              </h2>
              <div className="grid-cols-1 w-full ">
                <ReviewList serviceId={parseInt(id)} key={reloadReviewKey} />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">
                Viết đánh giá
              </h2>
              <ReviewForm
                serviceId={parseInt(id)}
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
            <ServiceBookingForm
              serviceId={parseInt(id)}
              serviceName={service.TenDV}
              price={service.Gia}
              setBookingSuccess={setBookingSuccess}
              imageUrl={service.ImageURL}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceBookingForm({
  serviceId,
  serviceName,
  price,

  setBookingSuccess,
  imageUrl,
}) {
  const { toast } = useToast();
  const { addService } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm({
    // resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",

      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
      form.setValue("email", user.email);
      form.setValue("phone", user.phone);
    }
  }, [user, form]);

  const bookingMutation = useMutation({
    mutationFn: async (data) => {
      // Instead of directly booking, we'll add this to the cart
      return data;
    },
    onSuccess: (data) => {
      // Add the service to cart
      addService(
        {
          id: serviceId,
          name: serviceName,
          price: price,
          imageUrl: imageUrl,

          offeredDate: data.date,
        },
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
        }
      );

      // Show success message
      setBookingSuccess(true);
      toast({
        title: "Thêm giỏ hàng thành công!",
        description:
          "Dịch vụ được đặt thành công. Bạn có thể xem giỏ hàng tại đây.",
      });

      // Option to navigate to cart
      // setTimeout(() => {
      //   navigate("/cart");
      // }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Đặt hàng thất bại",
        description:
          error.message || "Đặt dịch vụ không thành công. Hãy thử lại!",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data) {
    console.log(data);

    bookingMutation.mutate(data);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-primary mb-2">Đặt dịch vụ</h2>
        <p className="text-neutral-700 mb-6">
          Đặt trước trải nghiệm {serviceName.toLowerCase()} của bạn và nâng cao
          kỳ nghỉ của bạn tại khách sạn chúng tôi.
        </p>

        {bookingMutation.isSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="font-bold">Thêm giỏ hàng thành công!</h3>
            </div>
            <p className="mb-4">
              Dịch vụ này đã được thêm vào giỏ hàng của bạn. Bạn có thể tiếp tục
              mua sắm hoặc tiến hành thanh toán.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="w-full"
                onClick={() => navigate("/services")}
                variant="outline"
              >
                Đặt dịch vụ khác
              </Button>
              <Button className="w-full" onClick={() => navigate("/cart")}>
                Xem giỏ hàng
              </Button>
            </div>
          </div>
        ) : (
          <>
            {price > 0 && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700">Giá dịch vụ</span>
                  <span className="font-semibold">{price} VNĐ</span>
                </div>
              </div>
            )}

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

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày áp dụng</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
                          <input
                            type="date"
                            {...field}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md text-base"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

function ServiceBookingSkeleton() {
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-10 w-3/4 bg-neutral-200 animate-pulse mb-3" />
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="h-6 w-24 bg-neutral-200 animate-pulse rounded" />
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
                <div className="h-10 bg-neutral-200 animate-pulse rounded" />
                <div className="h-10 bg-neutral-200 animate-pulse rounded" />
                <div className="h-10 bg-neutral-200 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
