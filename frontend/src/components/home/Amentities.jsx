import { mockAmenities } from "../../mock/amentities";
import {
  Waves,
  Dumbbell,
  Utensils,
  Wifi,
  Wine,
  Car,
  Bell,
  Flower,
} from "lucide-react";

export default function Amenities() {
  const amenities = mockAmenities;

  const getAmenityIcon = (icon) => {
    switch (icon) {
      case "swimming-pool":
        return <Waves className="h-8 w-8 text-amber-300" />;
      case "dumbbell":
        return <Dumbbell className="h-8 w-8 text-amber-300" />;
      case "utensils":
        return <Utensils className="h-8 w-8 text-amber-300" />;
      case "wifi":
        return <Wifi className="h-8 w-8 text-amber-300" />;
      case "glass-cheers":
        return <Wine className="h-8 w-8 text-amber-300" />;
      case "parking":
        return <Car className="h-8 w-8 text-amber-300" />;
      case "concierge-bell":
        return <Bell className="h-8 w-8 text-amber-300" />;
      case "spa":
        return <Flower className="h-8 w-8 text-amber-300" />;
      default:
        return <Flower className="h-8 w-8 text-amber-300" />;
    }
  };

  return (
    <section
      id="amenities"
      className="py-20 bg-primary bg-[#0f1729] text-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tiện nghi cao cấp
          </h2>
          <p className="max-w-2xl mx-auto">
            Mọi khía cạnh của khách sạn chúng tôi đều được thiết kế để mang lại
            sự thoải mái và tiện lợi, đảm bảo một kỳ nghỉ tuyệt vời.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((amenity) => (
            <div
              key={amenity.id}
              className="bg-primary-light p-6 rounded-lg text-center transition-transform hover:-translate-y-1"
            >
              <div className="mb-4 flex justify-center">
                {getAmenityIcon(amenity.icon)}
              </div>
              <h3 className="font-bold text-xl mb-2">{amenity.name}</h3>
              <p className="text-sm text-white/90">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
