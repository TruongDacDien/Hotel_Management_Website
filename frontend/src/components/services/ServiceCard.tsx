import { Link } from "wouter";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Spa, Utensils, Car, Bell, GlassFull, Compass, 
  Ship, ChefHat
} from "lucide-react";
import { Service } from "@shared/schema";

const iconMapping: Record<string, React.ReactNode> = {
  'Wellness': <Spa className="h-6 w-6" />,
  'Dining': <Utensils className="h-6 w-6" />,
  'Transportation': <Car className="h-6 w-6" />,
  'Guest Services': <Bell className="h-6 w-6" />,
  'Events': <GlassFull className="h-6 w-6" />,
  'Activities': <Compass className="h-6 w-6" />
};

interface ServiceCardProps {
  service: Service & {
    formattedPrice: string;
    formattedDuration: string;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card className="bg-[#F8F7F4] rounded-lg p-6 hover:shadow-md transition-shadow">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center mb-2">
          <div className="text-[#C89F7B] text-2xl mr-4">
            {iconMapping[service.category] || <Spa className="h-6 w-6" />}
          </div>
          <CardTitle className="font-serif text-xl text-primary font-semibold">
            {service.name}
          </CardTitle>
        </div>
        <CardDescription className="text-neutral-600">
          {service.description.length > 100 
            ? `${service.description.substring(0, 100)}...` 
            : service.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 py-4">
        <div className="overflow-hidden rounded-lg h-48 mb-4 group">
          <img 
            src={service.images[0]} 
            alt={service.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex justify-between text-sm text-neutral-600">
          {service.price && (
            <span>Price: {service.formattedPrice}</span>
          )}
          {service.duration && (
            <span>Duration: {service.formattedDuration}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-0 pt-4">
        <Link href={`/services/${service.id}`}>
          <span className="inline-block text-[#C89F7B] hover:text-[#B88F6B] font-medium transition-colors">
            Learn more →
          </span>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
