import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import RoomCard from "../../components/cart/RoomCart";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { getAllRoomTypes } from "../../config/api";

export default function RoomsList({ featured = true }) {
  const [rooms, setRooms] = useState([]);

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

  return (
    <section id="rooms" className="py-20 bg-[#F8F8F8]">
      <div className="  max-w-full px-4">
        {featured && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Nơi ở sang trọng
            </h2>
            <p className="text-neutral-700 max-w-2xl mx-auto">
              Mỗi phòng đều được thiết kế chu đáo để mang đến sự thoải mái và
              sang trọng tối đa.
            </p>
          </div>
        )}
        {featured ? (
          <div className="relative mb-12">
            <Carousel opts={{ align: "start", loop: true }} className="mx-4">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <CarouselPrevious className="h-12 w-12 rounded-full shadow-lg bg-white/80 hover:bg-white" />
              </div>
              <CarouselContent>
                {rooms.slice(0, 5).map((room) => (
                  <CarouselItem
                    key={room.id}
                    className="md:basis-1/2 lg:basis-1/3 pl-4"
                  >
                    <RoomCard room={room} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                <CarouselNext className="h-12 w-12 rounded-full shadow-lg bg-white/80 hover:bg-white" />
              </div>
            </Carousel>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-5 my-5">
            {rooms.map((room) => (
              <RoomCard key={room.MaLoaiPhong} room={room} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function RoomCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="w-full h-64 bg-neutral-200 animate-pulse" />
      <CardContent className="p-6">
        <div className="h-6 w-2/3 bg-neutral-200 animate-pulse mb-2" />
        <div className="h-4 w-full bg-neutral-200 animate-pulse mb-4" />
      </CardContent>
    </Card>
  );
}
