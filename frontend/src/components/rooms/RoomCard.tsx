// import { Link } from "wouter";
// import { Card, CardContent, CardFooter } from "../../components/ui/card";
// import { Button } from "../../components/ui/button";
// import { Wifi, Users, Bed } from "lucide-react";

// const RoomCard = ({ room }) => {
//   return (
//     <Card className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
//       {/* Hình ảnh của phòng */}
//       <div className="overflow-hidden h-64">
//         <img
//           src={room.images?.[0] || "/placeholder.jpg"} // Dùng ảnh mặc định nếu không có ảnh
//           alt={room.name}
//           className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//         />
//       </div>

//       {/* Nội dung phòng */}
//       <CardContent className="p-6">
//         <h3 className="font-serif text-xl text-primary font-semibold mb-2">
//           {room.name}
//         </h3>
//         <div className="flex justify-between items-center mb-4">
//           <span className="text-neutral-800 font-medium">
//             {room.formattedPrice}{" "}
//             <span className="text-neutral-500 text-sm">per night</span>
//           </span>
//           <span className="text-sm text-neutral-500">{room.formattedSize}</span>
//         </div>

//         {/* Thông tin khách và giường */}
//         <div className="flex gap-4 mb-4">
//           <div className="flex items-center text-neutral-600">
//             <Users className="h-4 w-4 mr-2" />
//             <span>{room.maxGuests} Guests</span>
//           </div>
//           <div className="flex items-center text-neutral-600">
//             <Bed className="h-4 w-4 mr-2" />
//             <span>{room.bedType}</span>
//           </div>
//         </div>

//         {/* Tiện nghi */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           {room.amenities?.slice(0, 4).map((amenity, index) => (
//             <span
//               key={index}
//               className="bg-[#F8F7F4] text-neutral-700 text-xs px-2 py-1 rounded"
//             >
//               {amenity}
//             </span>
//           ))}
//           {room.amenities?.length > 4 && (
//             <span className="bg-[#F8F7F4] text-neutral-700 text-xs px-2 py-1 rounded">
//               +{room.amenities.length - 4} more
//             </span>
//           )}
//         </div>
//       </CardContent>

//       {/* Footer với nút View Details */}
//       <CardFooter className="p-6 pt-0">
//         <Link href={`/rooms/${room.id}`} className="w-full">
//           <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium">
//             View Details
//           </Button>
//         </Link>
//       </CardFooter>
//     </Card>
//   );
// };

// export default RoomCard;

import { Link } from "wouter";

export default function RoomCard({ room }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="overflow-hidden h-64">
        <img
          src={room.images[0]}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl text-primary font-semibold mb-2">
          {room.name}
        </h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-neutral-800 font-medium">
            {room.formattedPrice}{" "}
            <span className="text-neutral-500 text-sm">per night</span>
          </span>
          <span className="text-sm text-neutral-500">{room.formattedSize}</span>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center text-neutral-600">
            <span>{room.maxGuests} Guests</span>
          </div>
          <div className="flex items-center text-neutral-600">
            <span>{room.bedType}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 4).map((amenity, index) => (
            <span
              key={index}
              className="bg-[#F8F7F4] text-neutral-700 text-xs px-2 py-1 rounded"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 4 && (
            <span className="bg-[#F8F7F4] text-neutral-700 text-xs px-2 py-1 rounded">
              +{room.amenities.length - 4} more
            </span>
          )}
        </div>
      </div>
      <div className="p-6 pt-0">
        <Link href={`/rooms/${room.id}`} className="w-full">
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
