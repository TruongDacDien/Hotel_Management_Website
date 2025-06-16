import { mockReview } from "../../mock/review"; // Import mock data
import { Card, CardContent } from "../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { useEffect, useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Star } from "lucide-react";
import {
  getAllRatingRoom,
  getAllRatingService,
  getRoomTypeById,
  getServiceById,
  getCustomerAccountById,
} from "../../config/api";
import defaultAvatar from "../../assets/avatar-default.svg"; // Default avatar image

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(null);
  const isLoading = false;
  const error = null;

  // Fetch ratings from API
  const fetchRatings = async () => {
    try {
      const [roomRatingsRes, serviceRatingsRes] = await Promise.all([
        getAllRatingRoom(),
        getAllRatingService(),
      ]);

      const roomRatings = roomRatingsRes.map((item) => ({
        ...item,
        type: "room",
      }));

      const serviceRatings = serviceRatingsRes.map((item) => ({
        ...item,
        type: "service",
      }));

      const top5 = [...roomRatings, ...serviceRatings]
        .sort((a, b) => b.SoSao - a.SoSao)
        .slice(0, 5);

      // Lấy các ID cần fetch
      const userIds = [...new Set(top5.map((r) => r.MaTKKH))];
      const roomTypeIds = [
        ...new Set(
          top5.filter((r) => r.type === "room").map((r) => r.MaLoaiPhong)
        ),
      ];
      const serviceIds = [
        ...new Set(top5.filter((r) => r.type === "service").map((r) => r.MaDV)),
      ];

      // Gọi API theo ID
      const [users, roomTypes, services] = await Promise.all([
        Promise.all(userIds.map((id) => getCustomerAccountById(id))),
        Promise.all(roomTypeIds.map((id) => getRoomTypeById(id))),
        Promise.all(serviceIds.map((id) => getServiceById(id))),
      ]);

      const userMap = new Map(
        users.map((res) => [
          res.MaTKKH,
          {
            name: res.TenKH,
            avatarUrl: res.AvatarURL,
            country: res.QuocTich,
          },
        ])
      );

      const roomMap = new Map(
        roomTypes.map((res) => [res.MaLoaiPhong, res.TenLoaiPhong])
      );

      const serviceMap = new Map(services.map((res) => [res.MaDV, res.TenDV]));

      console.log(roomMap, serviceMap);

      // Chuẩn hóa dữ liệu cho hiển thị
      const testimonials = top5.map((item) => ({
        type: item.type,
        content: item.NoiDung,
        rating: item.SoSao,
        date: item.ThoiGian,
        categoryName:
          item.type === "room"
            ? roomMap.get(item.MaLoaiPhong) || "Không rõ phòng"
            : serviceMap.get(item.MaDV) || "Không rõ dịch vụ",
        user: userMap.get(item.MaTKKH) || {},
      }));

      setTestimonials(testimonials);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  console.log("Testimonials: ", testimonials);

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="w-full mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Trải nghiệm khách hàng
          </h2>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            Khám phá những gì khách hàng nói về kỳ nghỉ của họ tại đây.
          </p>
        </div>

        <div className="relative mb-12">
          <Carousel opts={{ align: "start", loop: true }} className="mx-4">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <CarouselPrevious className="h-12 w-12 rounded-full shadow-lg bg-white/80 hover:bg-white" />
            </div>
            <CarouselContent>
              {testimonials?.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 pl-4"
                >
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <CarouselNext className="h-12 w-12 rounded-full shadow-lg bg-white/80 hover:bg-white" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <Card className="bg-[#F8F8F8]">
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          <div className="text-amber-300 text-xl flex">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="fill-current h-5 w-5" />
            ))}
          </div>
        </div>
        <p className="text-neutral-700 italic mb-6">{testimonial.content}</p>
        <p className="text-sm text-neutral-500 mb-4">
          {testimonial.type === "room" ? "Phòng: " : "Dịch vụ: "}
          <span className="font-medium">{testimonial.categoryName}</span>
        </p>
        <div className="flex items-center">
          <div className="mr-4">
            <Avatar>
              <AvatarFallback>{testimonial.user.name.charAt(0)}</AvatarFallback>
              <AvatarImage src={testimonial.user.avatarUrl || defaultAvatar} />
            </Avatar>
          </div>
          <div>
            <h4 className="font-bold text-primary">{testimonial.user.name}</h4>
            <p className="text-sm text-neutral-600">
              {testimonial.user.country}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TestimonialCardSkeleton() {
  return (
    <Card className="bg-[#F8F8F8]">
      <CardContent className="p-8">
        <div className="flex mb-4">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-5 w-5 bg-neutral-300 animate-pulse rounded-full mr-1"
              />
            ))}
          </div>
        </div>
        <div className="h-4 w-full bg-neutral-300 animate-pulse mb-2" />
        <div className="h-4 w-full bg-neutral-300 animate-pulse mb-2" />
        <div className="h-4 w-3/4 bg-neutral-300 animate-pulse mb-6" />
        <div className="flex items-center">
          <div className="h-12 w-12 bg-neutral-300 animate-pulse rounded-full mr-4" />
          <div>
            <div className="h-4 w-24 bg-neutral-300 animate-pulse mb-2" />
            <div className="h-3 w-32 bg-neutral-300 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
