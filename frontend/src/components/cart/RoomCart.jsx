import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { amenityIcons } from "../../constants/amenityIcons";
import { getAmentitesRoomDetails } from "../../config/api";

export default function RoomCard({ room }) {
  const [amentites, setAmentites] = useState([]);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getAmentitesRoomDetails();
        if (response) {
          setAmentites(response);
        }
      } catch {
        throw new Error("There is an error while getting amentities");
      }
    };
    fetchRooms();
  }, []);

  const roomAmenities = amentites
    .filter((item) => item.MaLoaiPhong === room.MaLoaiPhong)
    .map((item) => item.TenTN);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img
          src={room.ImageURL}
          alt={room.TenLoaiPhong}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-amber-300 hover:bg-amber-300 text-neutral-800">
            {room.GiaNgay} VNĐ/ngày
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold text-xl text-primary mb-2">
          {room.TenLoaiPhong}
        </h3>
        <p className="text-neutral-700 mb-4 line-clamp-2">{room.MoTa}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {roomAmenities.slice(0, 3).map((amenity, index) => (
            <Badge
              key={index}
              variant="outline"
              className="flex items-center gap-1 px-3 py-1"
            >
              {amenityIcons[amenity] || null}
              <span>{amenity}</span>
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center">
          {/* <span className="text-sm text-neutral-700 flex items-center">
            <Ruler className="h-4 w-4 mr-1" /> {room.size} m²
          </span> */}
          <Link
            to={`/rooms/${room.MaLoaiPhong}`}
            className="hover:underline flex items-center gap-1"
          >
            <span className="text-left">Xem chi tiết</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
