import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { format } from "date-fns";
import { Stars } from "./Stars";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  getRatingByRoomId,
  getRatingByServiceId,
  getCustomerById,
  getCustomerAccountById,
} from "../../config/api";
import axios from "axios";

export default function ReviewList({ roomId, serviceId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      let response;
      if (roomId) {
        response = await getRatingByRoomId(roomId);
      } else if (serviceId) {
        response = await getRatingByServiceId(serviceId);
      } else {
        // Nếu không có roomId hoặc serviceId, không cần gọi
        setReviews([]);
        setLoading(false);
        return;
      }

      setReviews(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    console.log(reviews);
  }, [roomId, serviceId]);

  if (loading) {
    return (
      <div className="py-8 space-y-4">
        <div className="h-28 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-28 bg-muted rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p>Có lỗi khi tải đánh giá. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p>Chưa có đánh giá nào. Hãy để lại đánh giá đầu tiên!</p>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      <h3 className="text-xl font-semibold mb-4">
        Đánh giá ({reviews.length})
      </h3>
      <div className="relative w-full  mb-12">
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full  border border-red-500"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <CarouselPrevious className="h-10 w-10 rounded-full shadow-md bg-white/80 hover:bg-white" />
          </div>

          <CarouselContent className="w-full flex">
            {reviews.map((review) => (
              <CarouselItem
                key={review.MaDGLP}
                className="w-full sm:!basis-full md:!basis-1/2 lg:!basis-1/2 px-4"
              >
                <ReviewCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <CarouselNext className="h-10 w-10 rounded-full shadow-md bg-white/80 hover:bg-white" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!review.MaTKKH) return;
      try {
        const res = await getCustomerAccountById(review.MaTKKH);

        console.log(res);

        setUser(res);
      } catch (err) {
        console.error("Failed to fetch user");
      }
    };

    fetchUser();
  }, [review.MaTKKH]);

  const getUserInitials = () => {
    if (user?.TenKH) {
      return user.TenKH.split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return "GU";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{user?.TenKH || "Guest User"}</h4>
              <p className="text-sm text-muted-foreground">
                {review.ThoiGian
                  ? format(new Date(review.ThoiGian), "PPP")
                  : "Recently"}
              </p>
            </div>
          </div>
          <Stars rating={review.SoSao} />
        </div>
      </CardHeader>
      <CardContent>
        <h5 className="text-muted-foreground">{review.NoiDung}</h5>
      </CardContent>
    </Card>
  );
}
