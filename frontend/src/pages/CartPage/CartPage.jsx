import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { useCart } from "../../hooks/use-cart";
import { useToast } from "../../hooks/use-toast";

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

// Mock Data

export default function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, isLoaded, removeItem, updateQuantity, clearCart, totalPrice } =
    useCart();

  console.log(items);
  useEffect(() => {
    const rawCart = localStorage.getItem("hotel-cart");
    console.log("Cart in localStorage (raw):", rawCart);
  }, []);

  const handleQuantityChange = (id, quantity) => {
    updateQuantity(id, quantity); // dùng hàm từ context
  };

  const handleRemove = (id) => {
    removeItem(id); // dùng hàm từ context
  };

  const handleClearCart = () => {
    clearCart();
  };

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data) => {
    toast({
      title: "Mock submit",
      description: JSON.stringify(data),
    });
  };

  if (!isLoaded) {
    return <div>Loading cart...</div>; // hoặc spinner
  }

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

  // const { toast } = useToast();
  // const [bookingComplete, setBookingComplete] = useState(false);

  // const form = useForm({
  //   defaultValues: {
  //     name: "",
  //     email: "",
  //     phone: "",
  //   },
  // });

  //   const prepareBookingData = (formData) => {
  //     const bookings = items.map((item) => {
  //       if (item.type === "room") {
  //         return {
  //           name: formData.name,
  //           email: formData.email,
  //           phone: formData.phone || null,
  //           roomId: item.roomId,
  //           checkIn: item.checkIn,
  //           checkOut: item.checkOut,
  //           quantity: item.quantity,
  //         };
  //       } else {
  //         return {
  //           name: formData.name,
  //           email: formData.email,
  //           phone: formData.phone || null,
  //           serviceId: item.serviceId,
  //           quantity: item.quantity,
  //         };
  //       }
  //     });
  //     return { bookings };
  //   };

  //   const bookingMutation = useMutation({
  //     mutationFn: async (data) => {
  //       const bookingData = prepareBookingData(data);
  //       const res = await apiRequest("POST", "/api/bookings/batch", bookingData);
  //       return res.json();
  //     },
  //     onSuccess: () => {
  //       setBookingComplete(true);
  //       clearCart();
  //       toast({
  //         title: "Booking Confirmed!",
  //         description: "Your booking has been successfully processed.",
  //       });
  //     },
  //     onError: (error) => {
  //       toast({
  //         title: "Booking Failed",
  //         description:
  //           error.message || "Failed to process booking. Please try again.",
  //         variant: "destructive",
  //       });
  //     },
  //   });

  //   const onSubmit = (data) => {
  //     if (!data.name || data.name.length < 2) {
  //       form.setError("name", {
  //         type: "manual",
  //         message: "Name must be at least 2 characters",
  //       });
  //       return;
  //     }
  //     if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
  //       form.setError("email", {
  //         type: "manual",
  //         message: "Please enter a valid email address",
  //       });
  //       return;
  //     }
  //     bookingMutation.mutate(data);
  //   };

  //   if (items.length === 0 && !bookingComplete) {
  //     return (
  //       <div className="container mx-auto px-4 py-32 text-center">
  //         <ShoppingCart className="w-16 h-16 mx-auto text-neutral-300 mb-6" />
  //         <h1 className="text-3xl font-bold text-primary mb-4">
  //           Your Cart is Empty
  //         </h1>
  //         <p className="text-neutral-600 mb-8">
  //           You haven't added any rooms or services to your cart yet.
  //         </p>
  //         <div className="flex flex-col sm:flex-row justify-center gap-4">
  //           <Button asChild className="px-8">
  //             <Link to="/rooms">Browse Rooms</Link>
  //           </Button>
  //           <Button asChild variant="outline" className="px-8">
  //             <Link to="/services">Explore Services</Link>
  //           </Button>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (bookingComplete) {
  //     return (
  //       <div className="container mx-auto px-4 py-32 max-w-2xl">
  //         <Card>
  //           <CardHeader className="pb-4 text-center">
  //             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
  //               <Check className="w-10 h-10 text-green-600" />
  //             </div>
  //             <CardTitle className="text-2xl text-primary">
  //               Booking Confirmed!
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent className="text-center pb-6">
  //             <p className="text-neutral-700 mb-6">
  //               Thank you for your booking with Elysian Retreat. A confirmation
  //               email has been sent with all your booking details.
  //             </p>
  //             <div className="flex justify-center space-x-4">
  //               <Button asChild>
  //                 <Link to="/">Return to Home</Link>
  //               </Button>
  //               <Button asChild variant="outline">
  //                 <Link to="/rooms">Browse More Rooms</Link>
  //               </Button>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     );
  //   }

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
              <Button variant="destructive" onClick={() => handleClearCart()}>
                Xóa giỏ hàng
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
                  {/* <Button
                    type="submit"
                    className="w-full mt-6"
                    disabled={bookingMutation.isPending}
                  >
                    {bookingMutation.isPending
                      ? "Processing..."
                      : "Complete Booking"}
                  </Button> */}
                  <Button
                    type="submit"
                    className="w-full mt-6 bg-black text-white"
                    // sửa dòng này:
                    disabled={false} // hoặc tạo biến giả để thay thế bookingMutation
                  >
                    {"Hoàn tất đặt chỗ"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
