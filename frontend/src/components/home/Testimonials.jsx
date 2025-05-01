import { mockReview } from "../../mock/review"; // Import mock data
import { Card, CardContent } from "../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Star } from "lucide-react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(mockReview);
  const isLoading = false;
  const error = null;

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
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
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
        <p className="text-neutral-700 italic mb-6">{testimonial.text}</p>
        <div className="flex items-center">
          <div className="mr-4">
            <Avatar>
              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  testimonial.name
                )}&background=random`}
              />
            </Avatar>
          </div>
          <div>
            <h4 className="font-bold text-primary">{testimonial.name}</h4>
            <p className="text-sm text-neutral-600">{testimonial.location}</p>
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
