import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
import { mockServices } from "../../mock/service";
import { mockRooms } from "../../mock/room";

export default function ServiceBookingPage() {
  const rooms = mockRooms;
  const services = mockServices;
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roomsLoading, setRoomLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Tìm phòng từ rooms dựa trên id
    setIsLoading(true); // Bắt đầu tải
    try {
      const foundService = services.find((r) => r.id == id);
      console.log(foundService);

      if (foundService) {
        setService(foundService);
        setIsLoading(false); // Kết thúc tải
      } else {
        throw new Error("Không tìm thấy dịch vụ");
      }
    } catch (err) {
      setError(err);
      setIsLoading(false); // Kết thúc tải, có lỗi
    }
  }, [id, services]);

  if (isLoading) {
    return <ServiceBookingSkeleton />;
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Error Loading Service
        </h1>
        <p className="mb-6">We couldn't find the service you're looking for.</p>
        <Button asChild>
          <Link to="/services">
            <a>View All Services</a>
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
              {service.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {service.price > 0 && (
                <Badge className="bg-amber-300 hover:bg-amber-300 text-neutral-800 text-sm">
                  ${service.price}
                </Badge>
              )}
            </div>

            <div className="rounded-lg overflow-hidden mb-8">
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Service Description
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                {service.description}
              </p>
              <p className="text-neutral-700 leading-relaxed">
                Our expert staff at Elysian Retreat is dedicated to providing
                you with an exceptional experience. Book this service to enhance
                your stay and create unforgettable memories during your time
                with us.
              </p>
            </div>

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
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">
                Additional Information
              </h2>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <ul className="text-neutral-700 space-y-2">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 mt-0.5 text-amber-400" />
                    <span>
                      Please book at least 24 hours in advance for this service.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 mt-0.5 text-amber-400" />
                    <span>
                      Cancellations made less than 12 hours in advance are
                      subject to a cancellation fee.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 mt-0.5 text-amber-400" />
                    <span>
                      Special requests can be accommodated with prior notice.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <ServiceBookingForm
              serviceId={parseInt(id)}
              serviceName={service.name}
              price={service.price}
              rooms={rooms || []}
              setBookingSuccess={setBookingSuccess}
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
  rooms,
  setBookingSuccess,
}) {
  const { toast } = useToast();

  const form = useForm({
    // resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      roomId: "",
      date: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data) => {
      // Instead of directly booking, we'll add this to the cart
      return data;
    },
    onSuccess: (data) => {
      // Add the service to cart
      addService({
        id: serviceId,
        name: serviceName,
        price: price,
        imageUrl:
          document
            .querySelector('img[alt="' + serviceName + '"]')
            ?.getAttribute("src") || "",
      });

      // Show success message
      setBookingSuccess(true);
      toast({
        title: "Added to Cart!",
        description:
          "Service has been added to your cart. You can review your booking there.",
      });

      // Option to navigate to cart
      setTimeout(() => {
        navigate("/cart");
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Failed to Add to Cart",
        description:
          error.message || "Failed to add service to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data) {
    bookingMutation.mutate(data);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-primary mb-2">
          Book This Service
        </h2>
        <p className="text-neutral-700 mb-6">
          Reserve your {serviceName.toLowerCase()} experience and enhance your
          stay at Elysian Retreat.
        </p>

        {bookingMutation.isSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="font-bold">Added to Cart!</h3>
            </div>
            <p className="mb-4">
              This service has been added to your cart. You can continue
              shopping or proceed to checkout.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="w-full"
                onClick={() => setBookingSuccess(false)}
                variant="outline"
              >
                Book Another Service
              </Button>
              <Button className="w-full" onClick={() => navigate("/cart")}>
                View Cart
              </Button>
            </div>
          </div>
        ) : (
          <>
            {price > 0 && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700">Service price</span>
                  <span className="font-semibold">${price}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold text-neutral-800">Total</span>
                  <span className="font-bold text-primary">${price}</span>
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
                      <FormLabel>Full Name</FormLabel>
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
                      <FormLabel>Email Address</FormLabel>
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Your Room</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rooms.map((room) => (
                            <SelectItem
                              key={room.id}
                              value={room.id.toString()}
                            >
                              {room.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Date</FormLabel>
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? "Processing..." : "Book Now"}
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
