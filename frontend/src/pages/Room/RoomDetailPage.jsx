import { useState, useEffect } from "react";
import { mockRooms } from "../../mock/room";
import { useParams, Link, useLocation } from "react-router-dom";
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
import {
  Users,
  Ruler,
  Calendar,
  CheckCircle,
  Wifi as WifiIcon,
  Coffee as CoffeeIcon,
  Tv as TvIcon,
  Bed as BedIcon,
  Droplets as ShowerIcon,
} from "lucide-react";
// import ReviewList from "../../components/reviews/ReviewList";
// import ReviewForm from "../../components/reviews/ReviewForm";

export default function RoomDetailPage() {
  const rooms = mockRooms;
  const { id } = useParams();
  const { toast } = useToast();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  //   useEffect(() => {
  //     window.scrollTo(0, 0);
  //   }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Tìm phòng từ rooms dựa trên id
    setIsLoading(true); // Bắt đầu tải
    try {
      console.log(typeof id, typeof rooms[0].id);

      const foundRoom = rooms.find((r) => r.id == id);
      console.log(foundRoom);

      if (foundRoom) {
        setRoom(foundRoom);
        setIsLoading(false); // Kết thúc tải
      } else {
        throw new Error("Không tìm thấy phòng");
      }
    } catch (err) {
      setError(err);
      setIsLoading(false); // Kết thúc tải, có lỗi
    }
  }, [id, rooms]);

  if (isLoading) {
    return <RoomDetailSkeleton />;
  }

  if (error || !room) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Error Loading Room
        </h1>
        <p className="mb-6">We couldn't find the room you're looking for.</p>
        <Button asChild>
          <Link to="/rooms">View All Rooms</Link>
        </Button>
      </div>
    );
  }

  // Get the appropriate icon for an amenity
  const getAmenityIcon = (amenity) => {
    if (amenity.includes("Wi-Fi")) return <WifiIcon className="h-5 w-5" />;
    if (amenity.includes("Mini Bar") || amenity.includes("Bar"))
      return <CoffeeIcon className="h-5 w-5" />;
    if (amenity.includes("TV")) return <TvIcon className="h-5 w-5" />;
    if (amenity.includes("Butler") || amenity.includes("Service"))
      return <CheckCircle className="h-5 w-5" />;
    if (amenity.includes("Jacuzzi") || amenity.includes("Shower"))
      return <ShowerIcon className="h-5 w-5" />;
    return <BedIcon className="h-5 w-5" />;
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-primary mb-3">
              {room.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-amber-300 hover:bg-amber-300 text-neutral-800 text-sm">
                ${room.price} / night
              </Badge>
              <div className="flex items-center text-neutral-600 text-sm">
                <Users className="h-4 w-4 mr-1" />
                <span>Up to {room.capacity} guests</span>
              </div>
              <div className="flex items-center text-neutral-600 text-sm">
                <Ruler className="h-4 w-4 mr-1" />
                <span>{room.size} m²</span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <div className="relative rounded-lg overflow-hidden cursor-pointer mb-8">
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-semibold">
                      Click to view larger image
                    </span>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="p-0 max-w-5xl overflow-hidden">
                <img
                  src={room.imageUrl}
                  alt={room.name}
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Description
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
                {room.description}
              </p>
              <p className="text-neutral-700 leading-relaxed">
                Our {room.name.toLowerCase()} offers a perfect blend of luxury
                and comfort, designed to provide you with an unforgettable stay
                experience. From the premium linens to the carefully selected
                furnishings, every detail has been thoughtfully considered to
                enhance your comfort and relaxation.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="text-neutral-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-neutral-800 mb-2">
                    Check-in & Check-out
                  </h3>
                  <ul className="text-neutral-700 space-y-2">
                    <li>Check-in: 3:00 PM - 12:00 AM</li>
                    <li>Check-out: 11:00 AM</li>
                    <li>Early check-in available upon request</li>
                    <li>Late check-out available upon request</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-neutral-800 mb-2">
                    Cancellation Policy
                  </h3>
                  <ul className="text-neutral-700 space-y-2">
                    <li>Free cancellation up to 48 hours before check-in</li>
                    <li>50% refund for cancellations within 48 hours</li>
                    <li>No refund for no-shows</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Guest Reviews
              </h2>
              <ReviewList roomId={parseInt(id)} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">
                Write a Review
              </h2>
              <ReviewForm
                roomId={parseInt(id)}
                onSuccess={() => {
                  toast({
                    title: "Thank you for your review!",
                    description:
                      "Your feedback helps other guests make informed decisions.",
                  });
                }}
              />
            </div> */}
          </div>

          <div className="lg:col-span-1">
            <BookingForm
              roomId={parseInt(id)}
              roomName={room.name}
              price={room.price}
              setBookingSuccess={setBookingSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingForm({ roomId, roomName, price, setBookingSuccess }) {
  const { toast } = useToast();
  const { addRoom } = useCart();
  const navigate = useLocation();

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
      checkIn: "",
      checkOut: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data) => {
      // Instead of directly booking, we'll add this to the cart
      return data;
    },
    onSuccess: (data) => {
      // Add the room to cart with chosen dates
      addRoom(
        {
          id: roomId,
          name: roomName,
          price: price,
          imageUrl:
            document
              .querySelector('img[alt="' + roomName + '"]')
              ?.getAttribute("src") || "",
        },
        data.checkIn,
        data.checkOut
      );

      // Show success message
      setBookingSuccess(true);
      toast({
        title: "Added to Cart!",
        description:
          "Room has been added to your cart. You can review your booking there.",
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
          error.message || "Failed to add room to cart. Please try again.",
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
        <h2 className="text-xl font-bold text-primary mb-2">Book This Room</h2>
        <p className="text-neutral-700 mb-6">
          Reserve your stay in our {roomName.toLowerCase()} and enjoy a
          luxurious experience.
        </p>

        {bookingMutation.isSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="font-bold">Added to Cart!</h3>
            </div>
            <p className="mb-4">
              This room has been added to your cart. You can continue shopping
              or proceed to checkout.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="w-full"
                onClick={() => setBookingSuccess(false)}
                variant="outline"
              >
                Book Another Room
              </Button>
              <Button className="w-full" onClick={() => navigate("/cart")}>
                View Cart
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-neutral-700">Price per night</span>
                <span className="font-semibold">${price}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-800">Total</span>
                <span className="font-bold text-primary">${price}</span>
              </div>
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="checkIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-in Date</FormLabel>
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
                        <FormLabel>Check-out Date</FormLabel>
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
