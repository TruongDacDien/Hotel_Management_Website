import { Link } from "wouter";
import { mockServices } from "../../mock/service";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";

export default function ServicesList({ featured = true }) {
  const services = mockServices;

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
              key={service.id}
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
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}

function ServiceCard({ service }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <img
        src={service.imageUrl}
        alt={service.name}
        className="w-full h-56 object-cover"
      />
      <CardContent className="p-6">
        <h3 className="font-bold text-xl text-primary mb-2">{service.name}</h3>
        <p className="text-neutral-700 mb-4">{service.description}</p>
        <Link
          href={`/services/${service.id}/book`}
          className="hover:underline inline-flex items-center text-primary hover:text-primary-dark transition-colors duration-300 font-medium"
        >
          Learn More <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
