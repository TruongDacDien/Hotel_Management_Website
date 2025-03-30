import { useEffect, useState } from "react";
import RoomsList from "../../components/home/RoomsList"; // Cập nhật đường dẫn tùy vào dự án
import { mockRooms } from "../../mock/room";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setRooms(mockRooms);
    }, 1000);
  }, []);

  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Luxurious Rooms & Suites
          </h1>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            Discover our meticulously designed accommodations offering the
            perfect blend of elegance and comfort for an unforgettable stay.
          </p>
        </div>
      </div>
      <RoomsList featured={false} rooms={rooms} />
    </div>
  );
}
