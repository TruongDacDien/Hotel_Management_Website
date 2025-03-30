import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import RoomCard from "../../components/cart/RoomCart";
import { Wifi, Snowflake, Tv, ArrowRight, Ruler } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";

export default function RoomsList({ featured = true }) {
  const mockRooms = [
    {
      id: 1,
      name: "Luxury Suite",
      description: "A spacious suite with an ocean view.",
      imageUrl:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 250,
      amenities: ["Wi-Fi", "Air Conditioning", "TV"],
      size: 45,
    },
    {
      id: 2,
      name: "Deluxe Room",
      description: "A comfortable room with a city skyline view.",
      imageUrl:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 180,
      amenities: ["Wi-Fi", "Air Conditioning"],
      size: 35,
    },
    {
      id: 3,
      name: "Classic Room",
      description: "A cozy room for a relaxing stay.",
      imageUrl:
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      price: 120,
      amenities: ["Wi-Fi", "TV"],
      size: 30,
    },
  ];

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setRooms(mockRooms);
    }, 1000);
  }, []);

  return (
    <section id="rooms" className="py-20 bg-[#F8F8F8]">
      <div className="  max-w-full px-4">
        {featured && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Luxurious Accommodations
            </h2>
            <p className="text-neutral-700 max-w-2xl mx-auto">
              Each room is thoughtfully designed to provide the utmost comfort
              and elegance.
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
                {rooms.map((room) => (
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
              <RoomCard key={room.id} room={room} />
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
