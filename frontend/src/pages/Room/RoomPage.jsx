import { useEffect, useState } from "react";
import RoomsList from "../../components/home/RoomsList"; // Cập nhật đường dẫn tùy vào dự án
import { getAllRoomTypes } from "../../config/api";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchRooms = async () => {
      try {
        const response = await getAllRoomTypes();
        if (response) {
          console.log(response);
          setRooms(response);
        }
      } catch {
        throw new Error("There is an error while getting room");
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Dãy phòng sang trọng của chúng tôi
          </h1>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            Khám phá chỗ nghỉ được thiết kế tỉ mỉ của chúng tôi, mang đến sự kết
            hợp hoàn hảo giữa sự thanh lịch và thoải mái cho một kỳ nghỉ khó
            quên.
          </p>
        </div>
      </div>
      <RoomsList featured={false} rooms={rooms} />
    </div>
  );
}
