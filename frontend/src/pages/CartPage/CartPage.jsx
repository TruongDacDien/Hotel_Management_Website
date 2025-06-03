import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { useCart } from "../../hooks/use-cart";
import { useToast } from "../../hooks/use-toast";
import PaymentMethodModal from "../../components/PaymentMethodModal";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Trash2,
  Minus,
  Plus,
  Calendar,
  ShoppingCart,
  Check,
} from "lucide-react";
import { Separator } from "../../components/ui/separator";
import {
  createOrder,
  createPayment,
  sendBookingToEmail,
} from "../../config/api";

// Mock Data
export default function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    items,
    isLoaded,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    undo,
    saveSnapshot,
    clearSnapshots,
  } = useCart();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isOnline, SetIsOnline] = useState(false);
  const [undoTimer, setUndoTimer] = useState(null);

  useEffect(() => {
    const rawCart = localStorage.getItem("hotel-cart");
    console.log("Cart in localStorage (raw):", rawCart);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const firstGuest = items[0].guestInfo;
    const allSame = items.every(
      (item) =>
        item.guestInfo.name === firstGuest.name &&
        item.guestInfo.email === firstGuest.email &&
        item.guestInfo.phone === firstGuest.phone
    );

    if (allSame) {
      form.setValue("name", firstGuest.name);
      form.setValue("email", firstGuest.email);
      form.setValue("phone", firstGuest.phone);
    }
  }, [items, form]);

  const handleQuantityChange = (id, quantity) => {
    updateQuantity(id, quantity); // dùng hàm từ context
  };

  const handleRemove = (id) => {
    removeItem(id); // dùng hàm từ context
  };

  const handleClearCart = () => {
    clearCart();
  };

  const prepareBookingData = (formData) => {
    // Tách items thành roomRequests và serviceRequests
    const roomRequests = items
      .filter((item) => item.type === "room")
      .map((item) => ({
        roomTypeId: item.roomId, // hoặc item.roomTypeId nếu đúng
        numberOfRooms: item.quantity,
        startDay: item.checkIn,
        endDay: item.checkOut,
      }));
    const serviceRequests = items
      .filter((item) => item.type === "service")
      .map((item) => ({
        serviceId: item.serviceId,
        quantity: item.quantity,
        offeredDate: item.offeredDate,
      }));
    return {
      isOnline: isOnline,
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      roomRequests,
      serviceRequests,
    };
  };

  const handlePrePayment = () => {
    saveSnapshot(); // lưu trước khi khách vào bước thanh toán

    if (undoTimer) {
      clearTimeout(undoTimer);
    }

    const timeoutId = setTimeout(() => {
      setShowPaymentModal(false);
      const result = undo(); // hoàn tác thay đổi gần nhất
      if (result) {
        toast({
          title: "Đã hủy đặt chỗ do không thanh toán trong thời gian quy định!",
          variant: "destructive",
        });
      }
    }, 5 * 60 * 1000); // 5 phút

    setUndoTimer(timeoutId); // lưu lại để có thể hủy
    setShowPaymentModal(true);
  };

  const bookingMutation = useMutation({
    mutationFn: async (data) => {
      const bookingData = prepareBookingData(data);
      console.log("Booking data prepared:", bookingData);
      const res = await createOrder(bookingData);
      return res.data;
    },
    onSuccess: async (_, variables) => {
      if (undoTimer) {
        clearTimeout(undoTimer);
      }
      clearSnapshots();
      setBookingComplete(true);
      clearCart();
      toast({
        title: "Đặt chỗ thành công!",
        // description: "Your booking has been successfully processed.",
      });
      try {
        // Gửi email xác nhận booking
        const bookingData = prepareBookingData(variables);
        await sendBookingToEmail(bookingData);
      } catch (e) {
        // Có thể log hoặc toast lỗi gửi email nếu muốn
        console.error("Gửi email xác nhận thất bại", e);
      }
    },
    onError: (error) => {
      toast({
        title: "Đặt chỗ thất bại",
        // description:
        //   error.message || "Failed to process booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const payosMutation = useMutation({
    mutationFn: async (data) => {
      SetIsOnline(true);
      // Chuẩn bị dữ liệu gửi lên PayOS
      const bookingData = prepareBookingData(data);
      // Gọi API PayOS
      const res = await createPayment({
        ...bookingData,
        totalPrice: Math.round(totalPrice * 1.1), // Gửi thêm tổng tiền (đã gồm thuế)
      });
      const result = res.data;
      if (result && result.checkoutUrl) {
        window.location.href = result.checkoutUrl; // Redirect sang PayOS
      } else {
        throw new Error(result?.message || "Không lấy được link thanh toán");
      }
      SetIsOnline(false);
    },
    onError: (error) => {
      toast({
        title: "Thanh toán thất bại",
        description: error.message || "Không thể tạo link thanh toán.",
        variant: "destructive",
      });
      SetIsOnline(false);
    },
  });

  const onSubmit = (data) => {
    if (!data.name || data.name.length < 2) {
      form.setError("name", {
        type: "manual",
        message: "Name must be at least 2 characters",
      });
      return;
    }
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      form.setError("email", {
        type: "manual",
        message: "Please enter a valid email address",
      });
      return;
    }
    bookingMutation.mutate(data);
  };

  if (!isLoaded) {
    return <div>Loading cart...</div>; // hoặc spinner
  }

  if (items.length === 0 && !bookingComplete) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-neutral-300 mb-6" />
        <h1 className="text-3xl font-bold text-primary mb-4">
          Giỏ hàng trống!
        </h1>
        <p className="text-neutral-600 mb-8">
          Bạn chưa có mục nào trong giỏ hàng của mình. Hãy thêm phòng hoặc dịch
          vụ để tiếp tục đặt chỗ.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="px-8">
            <Link to="/rooms">Xem phòng</Link>
          </Button>
          <Button asChild variant="outline" className="px-8">
            <Link to="/services">Khám phá dịch vụ</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="container mx-auto px-4 py-32 max-w-2xl">
        <Card>
          <CardHeader className="pb-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-primary">
              Đặt chỗ thành công!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="text-neutral-700 mb-6">
              Cảm ơn bạn đã đặt chỗ tại khách sạn của chúng tôi! Chúng tôi đã
              nhận được thông tin đặt chỗ của bạn và gửi thông tin qua email của
              bạn.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link to="/">Return to Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/rooms">Browse More Rooms</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <h1 className="text-3xl font-bold text-primary mb-8">
        Thông tin đặt chỗ
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tổng mục đã chọn ({items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Hạng mục</TableHead>
                    <TableHead>Chi tiết</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-center">Số lượng</TableHead>
                    <TableHead className="text-right">Tạm tính</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-neutral-500">
                              {item.type === "room" ? "Phòng" : "Dịch vụ"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.type === "room" &&
                          item.checkIn &&
                          item.checkOut && (
                            <div className="text-sm text-neutral-600">
                              <div className="flex items-center gap-1 mb-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Check-in:{" "}
                                  {new Date(item.checkIn).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Check-out:{" "}
                                  {new Date(item.checkOut).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          )}

                        {item.type === "service" && item.offeredDate && (
                          <div className="text-sm text-neutral-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Ngày áp dụng:{" "}
                                {new Date(
                                  item.offeredDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{item.roomName}</span>
                            </div>
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {Number(item.price).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <div className="w-12 h-8 flex items-center justify-center border-y border-neutral-200">
                            {item.quantity}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {Number(item.price * item.quantity).toLocaleString(
                          "vi-VN",
                          {
                            style: "currency",
                            currency: "VND",
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/")}>
                Tiếp tục đặt
              </Button>
              <Button variant="outline" onClick={() => handleClearCart()}>
                Xóa giỏ hàng
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const restored = undo();
                  if (!restored) {
                    toast({ title: "Không có thay đổi nào để hoàn tác!" });
                  } else {
                    toast({ title: "Đã hoàn tác thay đổi gần nhất!" });
                  }
                }}
              >
                Hoàn tác
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đặt chỗ</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit((data) => {
                      if (!data.name || data.name.length < 2) {
                        form.setError("name", {
                          type: "manual",
                          message: "Name must be at least 2 characters",
                        });
                        return;
                      }
                      if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
                        form.setError("email", {
                          type: "manual",
                          message: "Please enter a valid email address",
                        });
                        return;
                      }
                      handlePrePayment();
                      // setShowPaymentModal(true);
                    })(e);
                  }}
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
                        <FormLabel>Địa chỉ Email</FormLabel>
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
                        <FormLabel>Số điện thoại </FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính</span>
                      <span>
                        {totalPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Thuế</span>
                      <span>
                        {(totalPrice * 0.1).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Tổng cộng</span>
                      <span className="text-primary">
                        {(totalPrice * 1.1).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 mt-6">
                    <Button
                      type="submit"
                      className="w-full"
                      variant="custom"
                      disabled={
                        bookingMutation.isPending || payosMutation.isPending
                      }
                    >
                      Hoàn tất đặt chỗ
                    </Button>
                  </div>
                  <PaymentMethodModal
                    open={showPaymentModal}
                    loading={
                      bookingMutation.isPending || payosMutation.isPending
                    }
                    onClose={() => setShowPaymentModal(false)}
                    onDirect={() => {
                      setShowPaymentModal(false);
                      form.handleSubmit(onSubmit)();
                    }}
                    onPayOS={() => {
                      setShowPaymentModal(false);
                      form.handleSubmit((data) => payosMutation.mutate(data))();
                    }}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
