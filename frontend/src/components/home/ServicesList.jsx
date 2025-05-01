import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { getAllServices } from "../../config/api";

export default function ServicesList({ featured = true }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchServices = async () => {
      try {
        const response = await getAllServices();
        if (response) {
          console.log(response);
          setServices(response);
        }
      } catch {
        throw new Error("There is an error while getting room");
      }
    };
    fetchServices();
  }, []);

  console.log(services);

  return featured ? (
    // Hiển thị dưới dạng carousel nếu featured = true
    <div className="relative mb-12">
      <Carousel opts={{ align: "start", loop: true }} className="mx-8">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <CarouselPrevious className="h-12 w-12 rounded-full shadow-lg bg-white/80 hover:bg-white" />
        </div>
        <CarouselContent>
          {services.map((service) => (
            <CarouselItem
              key={service.MaDV}
              className="md:basis-1/2 lg:basis-1/3 pl-4"
            >
              <ServiceCard service={service} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <CarouselNext className="h-12 w-12 rounded-full shadow-lg bg-white/80 hover:bg-white" />
        </div>
      </Carousel>
    </div>
  ) : (
    // Hiển thị tất cả nếu featured = false
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-5 my-5">
      {services.map((service) => (
        <ServiceCard key={service.MaDV} service={service} />
      ))}
    </div>
  );
}

function ServiceCard({ service }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <img
        src={service.ImageURL}
        alt={service.TenDV}
        className="w-full h-56 object-cover"
      />
      <CardContent className="p-6">
        <h3 className="font-bold text-xl text-primary mb-2">{service.TenDV}</h3>
        <p className="text-neutral-700 mb-4">{service.MoTa}</p>
        <Link
          to={`/services/${service.MaDV}/book`}
          className="hover:underline inline-flex items-center text-primary hover:text-primary-dark transition-colors duration-300 font-medium"
        >
          Tìm hiểu thêm <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
