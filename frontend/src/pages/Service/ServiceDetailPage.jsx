import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { mockRooms } from "../../mock/room";
import { mockServices } from "../../mock/service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { formatServiceData } from "../../lib/data";
import BookingForm from "../../components/BookingForm";
// import ReviewList from "../../components/reviews/ReviewList";
// import ReviewForm from "../../components/reviews/ReviewForm";
import { useToast } from "../../hooks/use-toast";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  Users,
  MessageSquare,
} from "lucide-react";

const ServiceDetailPage = () => {
  const rooms = mockRooms;
  const services = mockServices;
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="space-y-6">
          <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
          <div className="h-12 w-3/4 bg-muted rounded animate-pulse"></div>
          <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
              <div className="h-40 bg-muted rounded-lg animate-pulse"></div>
            </div>
            <div>
              <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Error Loading Service
        </h1>
        <p className="mb-6">We couldn't find the room you're looking for.</p>
        <Button asChild>
          <Link to="/services">Back to All Services</Link>
        </Button>
      </div>
    );
  }

  const formattedService = formatServiceData(service);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white pt-8 pb-12 shadow-sm">
        <div className="container mx-auto px-6 space-y-4">
          <Button
            variant="outline"
            className="mb-4"
            onClick={() => setLocation("/services")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Services
          </Button>
          <h1 className="font-serif text-3xl md:text-4xl text-primary font-semibold">
            {service.name}
          </h1>
          <p className="text-neutral-600 mt-2">
            {service.description.split(" ").slice(0, 10).join(" ")}...
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="overflow-hidden rounded-lg h-[400px]">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details & Policies</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {service.price && (
                        <Card>
                          <CardContent className="p-4 flex flex-col items-center">
                            <DollarSign className="h-6 w-6 text-[#C89F7B] mb-2" />
                            <p className="text-sm text-neutral-600">Price</p>
                            <p className="font-medium">
                              {formattedService.formattedPrice}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      <Card>
                        <CardContent className="p-4 flex flex-col items-center">
                          <Clock className="h-6 w-6 text-[#C89F7B] mb-2" />
                          <p className="text-sm text-neutral-600">Duration</p>
                          <p className="font-medium">60 minutes</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl text-primary font-medium mb-3">
                        Description
                      </h3>
                      <p className="text-neutral-600 whitespace-pre-line">
                        {service.description}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-serif text-xl text-primary font-medium mb-3">
                        Why Choose This Experience
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5 shrink-0" />
                          <span className="text-neutral-600">
                            Professional staff with years of experience
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5 shrink-0" />
                          <span className="text-neutral-600">
                            Premium products and equipment
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5 shrink-0" />
                          <span className="text-neutral-600">
                            Customizable to your preferences
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5 shrink-0" />
                          <span className="text-neutral-600">
                            Complimentary amenities included
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="details" className="pt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium">
                          Booking Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium">Availability</p>
                            <p className="text-sm text-neutral-600">
                              Daily from 9:00 AM to 6:00 PM
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Users className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium">Group Size</p>
                            <p className="text-sm text-neutral-600">
                              Individual and group bookings available
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium">Cancellation Policy</p>
                            <p className="text-sm text-neutral-600">
                              Free cancellation up to 24 hours before scheduled
                              time. After that, a 50% charge applies.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium">
                          What's Included
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5" />
                            <span className="text-neutral-600">
                              Professional service by our expert staff
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5" />
                            <span className="text-neutral-600">
                              Use of premium facilities and equipment
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5" />
                            <span className="text-neutral-600">
                              Complimentary refreshments during your experience
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium">
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-neutral-600 mb-4">
                          To enhance your experience, we recommend:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5" />
                            <span className="text-neutral-600">
                              Arrive 15 minutes before your scheduled time
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5" />
                            <span className="text-neutral-600">
                              Wear comfortable clothing appropriate for the
                              activity
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-[#C89F7B] mr-3 mt-0.5" />
                            <span className="text-neutral-600">
                              Inform us of any special needs or preferences in
                              advance
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Card className="bg-white rounded-lg shadow-sm">
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-primary">
                    Book This Service
                  </CardTitle>
                  <CardDescription>
                    Secure your booking now for this exclusive experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BookingForm
                    serviceId={service.id}
                    isRoomBooking={false}
                    rooms={rooms || []}
                    service={service}
                  />
                </CardContent>
              </Card>

              <Card className="bg-white rounded-lg shadow-sm mt-6">
                <CardHeader>
                  <CardTitle className="font-serif text-lg text-primary">
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 mb-4">
                    Have questions about this service or want to customize your
                    experience? Our concierge team is here to help.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-[#C89F7B] text-[#C89F7B] hover:bg-[#C89F7B]/10"
                  >
                    Contact Concierge
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* <div className="container mx-auto px-6 mt-10">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-6 w-6 text-[#C89F7B]" />
              <h2 className="font-serif text-2xl md:text-3xl text-primary font-semibold">
                Guest Reviews
              </h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {id ? (
                <ReviewList serviceId={parseInt(id)} />
              ) : (
                <p>Loading reviews...</p>
              )}
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-6 w-6 text-[#C89F7B]" />
              <h2 className="font-serif text-2xl md:text-3xl text-primary font-semibold">
                Write a Review
              </h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {id ? (
                <ReviewForm
                  serviceId={parseInt(id)}
                  onSuccess={() => {
                    toast({
                      title: "Review submitted successfully!",
                      description:
                        "Thank you for sharing your experience with us.",
                    });
                  }}
                />
              ) : (
                <p>Loading review form...</p>
              )}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ServiceDetailPage;
