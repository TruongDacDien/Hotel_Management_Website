import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Wifi, Snowflake, Tv, ArrowRight, Ruler } from "lucide-react";
import { Link } from "react-router-dom";

function getAmenityIcon(amenity) {
  if (amenity.includes("Wi-Fi")) return <Wifi className="h-4 w-4 mr-2" />;
  if (amenity.includes("Air Conditioning"))
    return <Snowflake className="h-4 w-4 mr-2" />;
  if (amenity.includes("TV")) return <Tv className="h-4 w-4 mr-2" />;
  return null;
}

export default function RoomCard({ room }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img
          src={room.imageUrl}
          alt={room.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-amber-300 hover:bg-amber-300 text-neutral-800">
            ${room.price}/night
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold text-xl text-primary mb-2">{room.name}</h3>
        <p className="text-neutral-700 mb-4">{room.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <Badge
              key={index}
              variant="outline"
              className="flex items-center gap-1 px-3 py-1"
            >
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-700 flex items-center">
            <Ruler className="h-4 w-4 mr-1" /> {room.size} m²
          </span>
          <Link
            to={`/rooms/${room.id}`}
            className="hover:underline flex items-center gap-1"
          >
            <span className="text-left">View Details</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
